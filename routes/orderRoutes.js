const express = require("express");
const {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const {
  authenticateToken,
  requireCustomer,
  requireAdmin,
} = require("../middleware/auth");
const {
  validateOrderStatus,
  validateOrderFilters,
} = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place an order from cart items
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Cart is empty or insufficient stock
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticateToken, requireCustomer, placeOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user's order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get(
  "/",
  authenticateToken,
  requireCustomer,
  validateOrderFilters,
  getUserOrders
);

/**
 * @swagger
 * /api/orders/admin/all:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *       403:
 *         description: Admin access required
 */
router.get(
  "/admin/all",
  authenticateToken,
  requireAdmin,
  validateOrderFilters,
  getAllOrders
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
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
 *         description: Order details retrieved successfully
 *       404:
 *         description: Order not found
 */
router.get("/:id", authenticateToken, requireCustomer, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 *       403:
 *         description: Admin access required
 */
router.put(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  validateOrderStatus,
  updateOrderStatus
);

module.exports = router;
