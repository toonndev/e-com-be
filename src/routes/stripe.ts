import express from 'express'
import { authCheck } from '../middlewares/authCheck'
const router = express.Router()
import { payment } from '../controllers/stripe'

/**
 * @swagger
 * tags:
 *   name: Stripe
 *   description: Stripe payment endpoints
 */

/**
 * @swagger
 * /user/create-payment-intent:
 *   post:
 *     summary: Create a Stripe payment intent for the current user's cart
 *     tags: [Stripe]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns clientSecret
 */
router.post('/user/create-payment-intent', authCheck, payment)

export default router
