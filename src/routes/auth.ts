import express from 'express'
const router = express.Router()
import { register, login, currentUser } from '../controllers/auth'
import { authCheck, adminCheck } from '../middlewares/authCheck'

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Register success
 */
router.post('/register', register)

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns JWT token and payload
 */
router.post('/login', login)

/**
 * @swagger
 * /current-user:
 *   post:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 */
router.post('/current-user', authCheck, currentUser)

/**
 * @swagger
 * /current-admin:
 *   post:
 *     summary: Get current logged-in admin
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current admin data
 */
router.post('/current-admin', authCheck, adminCheck, currentUser)

export default router
