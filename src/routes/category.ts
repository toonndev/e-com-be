import express from 'express'
const router = express.Router()
import { create, list, remove } from '../controllers/category'
import { authCheck, adminCheck } from '../middlewares/authCheck'

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Create a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Created category
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.post('/category', authCheck, adminCheck, create)
router.get('/category', list)

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted category
 */
router.delete('/category/:id', authCheck, adminCheck, remove)

export default router
