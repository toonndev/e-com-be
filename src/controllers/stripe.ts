import { Request, Response } from 'express'
import prisma from '../config/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const payment = async (req: Request, res: Response) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: req.user!.id
      }
    })
    const amountTHB = cart!.cartTotal * 100

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountTHB,
      currency: 'thb',
      automatic_payment_methods: {
        enabled: true
      }
    })

    res.send({
      clientSecret: paymentIntent.client_secret
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Error' })
  }
}
