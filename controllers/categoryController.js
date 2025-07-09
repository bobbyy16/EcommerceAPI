const { validationResult } = require("express-validator");
const { Category, Product } = require("../models");

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Product,
          attributes: ["id"],
        },
      ],
    });

    const categoriesWithCount = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      productCount: category.Products.length,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));

    res.json({
      categories: categoriesWithCount,
      total: categories.length,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "imageUrl"],
        },
      ],
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ category });
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private (Admin only)
 */
const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Category name already exists" });
    }
    console.error("Create category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private (Admin only)
 */
const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const { name, description } = req.body;

    await category.update({
      ...(name && { name }),
      ...(description !== undefined && { description }),
    });

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Category name already exists" });
    }
    console.error("Update category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin only)
 */
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check if category has products
    if (category.Products && category.Products.length > 0) {
      return res.status(409).json({
        error: "Cannot delete category with existing products",
        productCount: category.Products.length,
      });
    }

    await category.destroy();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
