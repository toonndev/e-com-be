import { Request, Response } from 'express'
import prisma from '../config/prisma'

export const changeOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, orderStatus } = req.body

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { products: true }
    })

    if (!existingOrder) {
      return res.status(400).json({ message: 'Order not found' })
    }

    const isCancelling = orderStatus === 'Cancelled' && existingOrder.orderStatus !== 'Cancelled'

    const orderUpdate = await prisma.$transaction(async (tx) => {
      if (isCancelling) {
        for (const item of existingOrder.products) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: { increment: item.count },
              sold: { decrement: item.count }
            }
          })
        }
      }

      return tx.order.update({
        where: { id: orderId },
        data: { orderStatus: orderStatus }
      })
    })

    res.json(orderUpdate)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getOrderAdmin = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: {
          include: {
            product: true
          }
        },
        orderedBy: {
          select: {
            id: true,
            email: true,
            address: true
          }
        }
      }
    })
    res.json(orders)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}
