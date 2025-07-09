const { Sequelize } = require("sequelize");
require("dotenv").config();

// Load test environment variables if in test mode
if (process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env.test" });
}

const sequelize = new Sequelize({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database:
    process.env.DB_NAME ||
    (process.env.NODE_ENV === "test" ? "ecommerce_test_db" : "ecommerce_db"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: process.env.NODE_ENV === "test" ? 2 : 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
