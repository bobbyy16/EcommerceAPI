const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API (MVC Architecture)",
      version: "1.0.0",
      description:
        "A comprehensive e-commerce REST API with MVC architecture, authentication, product management, and order processing",
      contact: {
        name: "API Support",
        email: "support@ecommerce-api.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js", "./controllers/*.js"],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
