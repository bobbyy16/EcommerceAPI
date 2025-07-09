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

// Routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validateCategory,
  createCategory
);
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  validateCategory,
  updateCategory
);
router.delete("/:id", authenticateToken, requireAdmin, deleteCategory);

module.exports = router;
