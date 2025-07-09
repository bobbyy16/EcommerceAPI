const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { Product, Category } = require("../models");
const { uploadToCloudinary } = require("../middleware/upload");

/**
 * @desc    Get products with filters and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};

    // Search filter
    if (search) {
      whereClause.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // Category filter
    if (category) {
      whereClause.categoryId = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = minPrice;
      if (maxPrice) whereClause.price[Op.lte] = maxPrice;
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
      order: [[sortBy, sortOrder]],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      products,
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
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name", "description"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private (Admin only)
 */
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, stock, categoryId } = req.body;

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }

    let imageUrl = null;

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, "products");
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return res.status(400).json({ error: "Failed to upload image" });
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      categoryId,
      imageUrl,
    });

    // Fetch product with category details
    const productWithCategory = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(201).json({
      message: "Product created successfully",
      product: productWithCategory,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private (Admin only)
 */
const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { name, description, price, stock, categoryId } = req.body;

    // Check if category exists (if provided)
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ error: "Category not found" });
      }
    }

    let imageUrl = product.imageUrl;

    // Upload new image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, "products");
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return res.status(400).json({ error: "Failed to upload image" });
      }
    }

    await product.update({
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(price && { price }),
      ...(stock !== undefined && { stock }),
      ...(categoryId && { categoryId }),
      imageUrl,
    });

    // Fetch updated product with category details
    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
    });

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin only)
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.destroy();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
