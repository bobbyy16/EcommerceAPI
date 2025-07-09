const express = require("express");
const {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { authenticateToken, requireCustomer } = require("../middleware/auth");
const {
  validateCartItem,
  validateCartUpdate,
} = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticateToken, requireCustomer, getCartItems);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       400:
 *         description: Validation error or insufficient stock
 *       404:
 *         description: Product not found
 */
router.post(
  "/",
  authenticateToken,
  requireCustomer,
  validateCartItem,
  addToCart
);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear all items from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.delete("/clear", authenticateToken, requireCustomer, clearCart);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Validation error or insufficient stock
 *       404:
 *         description: Cart item not found
 */
router.put(
  "/:id",
  authenticateToken,
  requireCustomer,
  validateCartUpdate,
  updateCartItem
);

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
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
 *         description: Item removed from cart successfully
 *       404:
 *         description: Cart item not found
 */
router.delete("/:id", authenticateToken, requireCustomer, removeFromCart);

module.exports = router;
