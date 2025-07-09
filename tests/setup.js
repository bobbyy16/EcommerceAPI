const { sequelize } = require("../models");

// Set test environment
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.DB_NAME = "ecommerce_test_db";

beforeAll(async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Test database connection established");

    // Sync database for testing (force: true will drop and recreate tables)
    await sequelize.sync({ force: true });
    console.log("Test database synchronized");
  } catch (error) {
    console.error("Unable to connect to test database:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Close database connection
    await sequelize.close();
    console.log("Test database connection closed");
  } catch (error) {
    console.error("Error closing test database:", error);
  }
});

// Global test timeout
jest.setTimeout(30000);
