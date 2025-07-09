const express = require("express");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { validateCategory } = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated category ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Category name
 *           example: "Electronics"
 *         description:
 *           type: string
 *           description: Category description
 *           example: "Electronic devices and gadgets"
 *         productCount:
 *           type: integer
 *           description: Number of products in this category
 *           example: 25
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Category creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Category last update timestamp
 *
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Category name
 *           example: "Electronics"
 *         description:
 *           type: string
 *           description: Category description
 *           example: "Electronic devices and gadgets"
 *
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Category created successfully"
 *         category:
 *           $ref: '#/components/schemas/Category'
 *
 *     CategoriesListResponse:
 *       type: object
 *       properties:
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *         total:
 *           type: integer
 *           description: Total number of categories
 *           example: 8
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all product categories with product count
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriesListResponse'
 *             example:
 *               categories:
 *                 - id: 1
 *                   name: "Electronics"
 *                   description: "Electronic devices and gadgets"
 *                   productCount: 25
 *                   createdAt: "2024-01-15T10:30:00Z"
 *                   updatedAt: "2024-01-15T10:30:00Z"
 *                 - id: 2
 *                   name: "Clothing"
 *                   description: "Fashion and apparel"
 *                   productCount: 18
 *                   createdAt: "2024-01-15T11:00:00Z"
 *                   updatedAt: "2024-01-15T11:00:00Z"
 *               total: 8
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Retrieve a specific category with its associated products
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Category'
 *                     - type: object
 *                       properties:
 *                         Products:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                               price:
 *                                 type: number
 *                               imageUrl:
 *                                 type: string
 *             example:
 *               category:
 *                 id: 1
 *                 name: "Electronics"
 *                 description: "Electronic devices and gadgets"
 *                 Products:
 *                   - id: 1
 *                     name: "iPhone 15 Pro"
 *                     price: 1199.99
 *                     imageUrl: "https://example.com/iphone.jpg"
 *                   - id: 2
 *                     name: "Samsung Galaxy S24"
 *                     price: 999.99
 *                     imageUrl: "https://example.com/galaxy.jpg"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Category not found"
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     description: Create a new product category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *           example:
 *             name: "Home & Garden"
 *             description: "Home improvement and gardening supplies"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *             example:
 *               message: "Category created successfully"
 *               category:
 *                 id: 9
 *                 name: "Home & Garden"
 *                 description: "Home improvement and gardening supplies"
 *                 createdAt: "2024-01-15T12:00:00Z"
 *                 updatedAt: "2024-01-15T12:00:00Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *             example:
 *               errors:
 *                 - msg: "Name must be between 2 and 100 characters"
 *                   param: "name"
 *                   location: "body"
 *       401:
 *         description: Unauthorized - Token required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access token required"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Admin access required"
 *       409:
 *         description: Conflict - Category name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Category name already exists"
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validateCategory,
  createCategory
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     description: Update an existing category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *           example:
 *             name: "Consumer Electronics"
 *             description: "Updated description for electronic devices"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *             example:
 *               message: "Category updated successfully"
 *               category:
 *                 id: 1
 *                 name: "Consumer Electronics"
 *                 description: "Updated description for electronic devices"
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-15T12:30:00Z"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Token required
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Category not found"
 *       409:
 *         description: Conflict - Category name already exists
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  validateCategory,
  updateCategory
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     description: Delete a category (Admin only). Cannot delete categories that have associated products.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Category deleted successfully"
 *       401:
 *         description: Unauthorized - Token required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access token required"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Admin access required"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Category not found"
 *       409:
 *         description: Cannot delete category with existing products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cannot delete category with existing products"
 *                 productCount:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticateToken, requireAdmin, deleteCategory);

module.exports = router;
