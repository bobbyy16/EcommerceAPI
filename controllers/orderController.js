const { validationResult } = require("express-validator");
const {
  sequelize,
  Order,
  OrderItem,
  Cart,
  Product,
  Category,
} = require("../models");

/**
 * @desc    Place an order from cart items
 * @route   POST /api/orders
 * @access  Private (Customer only)
 */
const placeOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // Get cart items
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product }],
      transaction,
    });

    if (cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Check stock availability and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cartItems) {
      if (cartItem.Product.stock < cartItem.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Insufficient stock for ${cartItem.Product.name}`,
          availableStock: cartItem.Product.stock,
          requestedQuantity: cartItem.quantity,
        });
      }

      totalAmount +=
        Number.parseFloat(cartItem.priceAtTime) * cartItem.quantity;
      orderItems.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        priceAtTime: cartItem.priceAtTime,
      });
    }

    // Create order
    const order = await Order.create(
      {
        userId: req.user.id,
        totalAmount,
        status: "pending",
      },
      { transaction }
    );

    // Create order items and update product stock
    for (const item of orderItems) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtTime: item.priceAtTime,
        },
        { transaction }
      );

      // Update product stock
      await Product.decrement("stock", {
        by: item.quantity,
        where: { id: item.productId },
        transaction,
      });
    }

    // Clear cart
    await Cart.destroy({
      where: { userId: req.user.id },
      transaction,
    });

    await transaction.commit();

    // Fetch complete order details
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: Category,
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(201).json({
      message: "Order placed successfully",
      order: completeOrder,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Place order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Get user's order history
 * @route   GET /api/orders
 * @access  Private (Customer only)
 */
const getUserOrders = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId: req.user.id };
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: Category,
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      orders,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: Number.parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Get order details by ID
 * @route   GET /api/orders/:id
 * @access  Private (Customer only)
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: Category,
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders/admin/all
 * @access  Private (Admin only)
 */
const getAllOrders = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: Category,
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      orders,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: Number.parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private (Admin only)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    await order.update({ status });

    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              include: [
                {
                  model: Category,
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    });

    res.json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
