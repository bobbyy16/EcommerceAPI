const { body, query } = require("express-validator");

// Auth validation
const validateSignup = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("firstName").trim().isLength({ min: 2, max: 50 }),
  body("lastName").trim().isLength({ min: 2, max: 50 }),
  body("role").optional().isIn(["customer", "admin"]),
];

const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

// Category validation
const validateCategory = [
  body("name").trim().isLength({ min: 2, max: 100 }),
  body("description").optional().trim(),
];

// Product validation
const validateProduct = [
  body("name").trim().isLength({ min: 2, max: 200 }),
  body("description").optional().trim(),
  body("price").isFloat({ min: 0 }),
  body("stock").isInt({ min: 0 }),
  body("categoryId").isInt({ min: 1 }),
];

const validateProductUpdate = [
  body("name").optional().trim().isLength({ min: 2, max: 200 }),
  body("description").optional().trim(),
  body("price").optional().isFloat({ min: 0 }),
  body("stock").optional().isInt({ min: 0 }),
  body("categoryId").optional().isInt({ min: 1 }),
];

// Cart validation
const validateCartItem = [
  body("productId").isInt({ min: 1 }),
  body("quantity").isInt({ min: 1 }),
];

const validateCartUpdate = [body("quantity").isInt({ min: 1 })];

// Order validation
const validateOrderStatus = [
  body("status").isIn([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
];

// Query validation
const validatePagination = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];

const validateProductFilters = [
  ...validatePagination,
  query("minPrice").optional().isFloat({ min: 0 }),
  query("maxPrice").optional().isFloat({ min: 0 }),
  query("category").optional().isInt({ min: 1 }),
  query("sortBy").optional().isIn(["name", "price", "createdAt"]),
  query("sortOrder").optional().isIn(["ASC", "DESC"]),
];

const validateOrderFilters = [
  ...validatePagination,
  query("status")
    .optional()
    .isIn(["pending", "processing", "shipped", "delivered", "cancelled"]),
];

module.exports = {
  validateSignup,
  validateLogin,
  validateCategory,
  validateProduct,
  validateProductUpdate,
  validateCartItem,
  validateCartUpdate,
  validateOrderStatus,
  validatePagination,
  validateProductFilters,
  validateOrderFilters,
};
