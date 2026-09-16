import express from 'express'
const router = express.Router()
import { authCheck, adminCheck } from '../middlewares/authCheck'
import {
  listUsers,
  changeStatus,
  changeRole,
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  saveOrder,
  getOrder
} from '../controllers/user'

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User, cart and order management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', authCheck, adminCheck, listUsers)

/**
 * @swagger
 * /change-status:
 *   post:
 *     summary: Change a user's enabled status
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Update status success
 */
router.post('/change-status', authCheck, adminCheck, changeStatus)

/**
 * @swagger
 * /change-role:
 *   post:
 *     summary: Change a user's role
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update role success
 */
router.post('/change-role', authCheck, adminCheck, changeRole)

/**
 * @swagger
 * /user/cart:
 *   post:
 *     summary: Add items to cart
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Add cart success
 *   get:
 *     summary: Get current user's cart
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart data
 *   delete:
 *     summary: Empty current user's cart
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart empty success
 */
router.post('/user/cart', authCheck, userCart)
router.get('/user/cart', authCheck, getUserCart)
router.delete('/user/cart', authCheck, emptyCart)

/**
 * @swagger
 * /user/address:
 *   post:
 *     summary: Save user address
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address update success
 */
router.post('/user/address', authCheck, saveAddress)

/**
 * @swagger
 * /user/order:
 *   post:
 *     summary: Place an order from the current cart
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order created
 *   get:
 *     summary: Get current user's orders
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.post('/user/order', authCheck, saveOrder)
router.get('/user/order', authCheck, getOrder)

export default router
