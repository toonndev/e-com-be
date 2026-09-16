import { Request, Response } from 'express'
import prisma from '../config/prisma'

export const changeOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, orderStatus } = req.body
    const orderUpdate = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: orderStatus }
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
