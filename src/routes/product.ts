import express from 'express'
const router = express.Router()
import {
  create,
  list,
  read,
  update,
  remove,
  listby,
  searchFilters,
  createImages,
  removeImage
} from '../controllers/product'
import { authCheck, adminCheck } from '../middlewares/authCheck'

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Created product
 */
router.post('/product', authCheck, adminCheck, create)

/**
 * @swagger
 * /products/{count}:
 *   get:
 *     summary: List products
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: count
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/products/:count', list)

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product data
 *   put:
 *     summary: Update a product by ID
 *     tags: [Product]
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
 *         description: Updated product
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Product]
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
 *         description: Deleted product
 */
router.get('/product/:id', read)
router.put('/product/:id', authCheck, adminCheck, update)
router.delete('/product/:id', authCheck, adminCheck, remove)

/**
 * @swagger
 * /productby:
 *   post:
 *     summary: Get products by sort/order/limit
 *     tags: [Product]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sort:
 *                 type: string
 *               order:
 *                 type: string
 *               limit:
 *                 type: integer
 *     responses:
 *       200:
 *         description: List of products
 */
router.post('/productby', listby)

/**
 * @swagger
 * /search/filters:
 *   post:
 *     summary: Search products by query, category or price
 *     tags: [Product]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: integer
 *               price:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: List of matching products
 */
router.post('/search/filters', searchFilters)

/**
 * @swagger
 * /images:
 *   post:
 *     summary: Upload a product image to Cloudinary
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Uploaded image data
 */
router.post('/images', authCheck, adminCheck, createImages)

/**
 * @swagger
 * /removeimages:
 *   post:
 *     summary: Remove a product image from Cloudinary
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Remove success
 */
router.post('/removeimages', authCheck, adminCheck, removeImage)

export default router
