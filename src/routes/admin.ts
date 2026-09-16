import express from 'express'
import { authCheck } from '../middlewares/authCheck'
const router = express.Router()
import { getOrderAdmin, changeOrderStatus } from '../controllers/admin'

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin order management
 */

/**
 * @swagger
 * /admin/order-status:
 *   put:
 *     summary: Change an order's status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *               orderStatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated order
 */
router.put('/admin/order-status', authCheck, changeOrderStatus)

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get('/admin/orders', authCheck, getOrderAdmin)

export default router
