import { Request, Response } from 'express'
import prisma from '../config/prisma'

interface CartItemInput {
  id: number
  count: number
  price: number
}

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        enabled: true,
        address: true
      }
    })
    res.json(users)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const { id, enabled } = req.body
    console.log(id, enabled)
    await prisma.user.update({
      where: { id: Number(id) },
      data: { enabled: enabled }
    })

    res.send('Update Status Success')
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

export const changeRole = async (req: Request, res: Response) => {
  try {
    const { id, role } = req.body

    await prisma.user.update({
      where: { id: Number(id) },
      data: { role: role }
    })

    res.send('Update Role Success')
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

export const userCart = async (req: Request, res: Response) => {
  try {
    const { cart } = req.body as { cart: CartItemInput[] }
    console.log(cart)
    console.log(req.user!.id)

    const user = await prisma.user.findFirst({
      where: { id: Number(req.user!.id) }
    })

    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { quantity: true, title: true }
      })
      if (!product || item.count > product.quantity) {
        return res.status(400).json({
          ok: false,
          message: `ขออภัย. สินค้า ${product?.title || 'product'} หมด`
        })
      }
    }

    await prisma.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: user!.id
        }
      }
    })

    await prisma.cart.deleteMany({
      where: { orderedById: user!.id }
    })

    let products = cart.map((item) => ({
      productId: item.id,
      count: item.count,
      price: item.price
    }))

    let cartTotal = products.reduce((sum, item) => sum + item.price * item.count, 0)

    const newCart = await prisma.cart.create({
      data: {
        products: {
          create: products
        },
        cartTotal: cartTotal,
        orderedById: user!.id
      }
    })
    console.log(newCart)
    res.send('Add Cart Ok')
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

export const getUserCart = async (req: Request, res: Response) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user!.id)
      },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    })
    console.log(cart)
    res.json({
      products: cart?.products,
      cartTotal: cart?.cartTotal
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

export const emptyCart = async (req: Request, res: Response) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { orderedById: Number(req.user!.id) }
    })
    if (!cart) {
      return res.status(400).json({ message: 'No cart' })
    }
    await prisma.productOnCart.deleteMany({
      where: { cartId: cart.id }
    })
    const result = await prisma.cart.deleteMany({
      where: { orderedById: Number(req.user!.id) }
    })

    console.log(result)
    res.json({
      message: 'Cart Empty Success',
      deletedCount: result.count
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

export const saveAddress = async (req: Request, res: Response) => {
  try {
    const { address } = req.body
    console.log(address)
    await prisma.user.update({
      where: {
        id: Number(req.user!.id)
      },
      data: {
        address: address
      }
    })

    res.json({ ok: true, message: 'Address update success' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

export const saveOrder = async (req: Request, res: Response) => {
  try {
    const { id, amount, status, currency } = req.body.paymentIntent

    const userCart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user!.id)
      },
      include: { products: true }
    })

    if (!userCart || userCart.products.length === 0) {
      return res.status(400).json({ ok: false, message: 'Cart is Empty' })
    }

    const amountTHB = Number(amount) / 100

    const order = await prisma.order.create({
      data: {
        products: {
          create: userCart.products.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price
          }))
        },
        orderedBy: {
          connect: { id: req.user!.id }
        },
        cartTotal: userCart.cartTotal,
        stripePaymentId: id,
        amount: amountTHB,
        status: status,
        currentcy: currency
      }
    })

    const update = userCart.products.map((item) => ({
      where: { id: item.productId },
      data: {
        quantity: { decrement: item.count },
        sold: { increment: item.count }
      }
    }))
    console.log(update)

    await Promise.all(update.map((updated) => prisma.product.update(updated)))

    await prisma.cart.deleteMany({
      where: { orderedById: Number(req.user!.id) }
    })
    res.json({ ok: true, order })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

export const getOrder = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { orderedById: Number(req.user!.id) },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    })
    if (orders.length === 0) {
      return res.status(400).json({ ok: false, message: 'No orders' })
    }

    res.json({ ok: true, orders })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}
