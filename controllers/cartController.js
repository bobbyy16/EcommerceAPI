const { validationResult } = require("express-validator");
const { Cart, Product, Category } = require("../models");

/**
 * @desc    Get user's cart items
 * @route   GET /api/cart
 * @access  Private (Customer only)
 */
const getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
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
      order: [["createdAt", "DESC"]],
    });

    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + Number.parseFloat(item.priceAtTime) * item.quantity;
    }, 0);

    res.json({
      cartItems,
      summary: {
        totalItems: cartItems.length,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: Number.parseFloat(totalAmount.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private (Customer only)
 */
const addToCart = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;

    // Check if product exists and has sufficient stock
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        error: "Insufficient stock",
        availableStock: product.stock,
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await Cart.findOne({
      where: {
        userId: req.user.id,
        productId,
      },
    });

    if (existingCartItem) {
      // Update quantity if item already exists
      const newQuantity = existingCartItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({
          error: "Insufficient stock for total quantity",
          availableStock: product.stock,
          currentCartQuantity: existingCartItem.quantity,
        });
      }

      await existingCartItem.update({ quantity: newQuantity });

      const updatedCartItem = await Cart.findByPk(existingCartItem.id, {
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
      });

      return res.json({
        message: "Cart item updated successfully",
        cartItem: updatedCartItem,
      });
    }

    // Create new cart item with current price (persistent pricing)
    const cartItem = await Cart.create({
      userId: req.user.id,
      productId,
      quantity,
      priceAtTime: product.price,
    });

    const cartItemWithProduct = await Cart.findByPk(cartItem.id, {
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
    });

    res.status(201).json({
      message: "Item added to cart successfully",
      cartItem: cartItemWithProduct,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/:id
 * @access  Private (Customer only)
 */
const updateCartItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quantity } = req.body;

    const cartItem = await Cart.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: [{ model: Product }],
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Check stock availability
    if (cartItem.Product.stock < quantity) {
      return res.status(400).json({
        error: "Insufficient stock",
        availableStock: cartItem.Product.stock,
      });
    }

    await cartItem.update({ quantity });

    const updatedCartItem = await Cart.findByPk(cartItem.id, {
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
    });

    res.json({
      message: "Cart item updated successfully",
      cartItem: updatedCartItem,
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:id
 * @access  Private (Customer only)
 */
const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await cartItem.destroy();

    res.json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Remove cart item error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Clear all items from cart
 * @route   DELETE /api/cart/clear
 * @access  Private (Customer only)
 */
const clearCart = async (req, res) => {
  try {
    await Cart.destroy({
      where: { userId: req.user.id },
    });

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
