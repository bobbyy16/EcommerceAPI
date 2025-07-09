const request = require("supertest");
const app = require("../server");
const { User, Category, Product } = require("../models");

describe("Products", () => {
  let adminToken, customerToken, category;

  beforeEach(async () => {
    await Product.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await Category.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await User.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    // Create admin user
    const adminUser = await User.create({
      email: "admin@example.com",
      password: "password123",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    });

    // Create customer user
    const customerUser = await User.create({
      email: "customer@example.com",
      password: "password123",
      firstName: "Customer",
      lastName: "User",
      role: "customer",
    });

    // Login admin
    const adminLogin = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });
    adminToken = adminLogin.body.token;

    // Login customer
    const customerLogin = await request(app).post("/api/auth/login").send({
      email: "customer@example.com",
      password: "password123",
    });
    customerToken = customerLogin.body.token;

    // Create category
    category = await Category.create({
      name: "Electronics",
      description: "Electronic devices",
    });
  });

  describe("GET /api/products", () => {
    beforeEach(async () => {
      await Product.bulkCreate([
        {
          name: "iPhone 15",
          description: "Latest iPhone",
          price: 999.99,
          stock: 10,
          categoryId: category.id,
        },
        {
          name: "Samsung Galaxy",
          description: "Android phone",
          price: 799.99,
          stock: 15,
          categoryId: category.id,
        },
      ]);
    });

    it("should get all products", async () => {
      const response = await request(app).get("/api/products").expect(200);

      expect(response.body.products).toHaveLength(2);
      expect(response.body.pagination.totalItems).toBe(2);
    });

    it("should filter products by search term", async () => {
      const response = await request(app)
        .get("/api/products?search=iPhone")
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].name).toBe("iPhone 15");
    });

    it("should filter products by price range", async () => {
      const response = await request(app)
        .get("/api/products?minPrice=800&maxPrice=1000")
        .expect(200);

      expect(response.body.products).toHaveLength(1);
    });

    it("should filter products by category", async () => {
      const response = await request(app)
        .get(`/api/products?category=${category.id}`)
        .expect(200);

      expect(response.body.products).toHaveLength(2);
    });

    it("should paginate products", async () => {
      const response = await request(app)
        .get("/api/products?page=1&limit=1")
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(2);
    });
  });

  describe("POST /api/products", () => {
    it("should create product as admin", async () => {
      const productData = {
        name: "MacBook Pro",
        description: "Professional laptop",
        price: 1999.99,
        stock: 5,
        categoryId: category.id,
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.message).toBe("Product created successfully");
      expect(response.body.product.name).toBe(productData.name);
    });

    it("should not create product as customer", async () => {
      const productData = {
        name: "MacBook Pro",
        description: "Professional laptop",
        price: 1999.99,
        stock: 5,
        categoryId: category.id,
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(productData)
        .expect(403);

      expect(response.body.error).toBe("Admin access required");
    });

    it("should not create product without authentication", async () => {
      const productData = {
        name: "MacBook Pro",
        description: "Professional laptop",
        price: 1999.99,
        stock: 5,
        categoryId: category.id,
      };

      const response = await request(app)
        .post("/api/products")
        .send(productData)
        .expect(401);

      expect(response.body.error).toBe("Access token required");
    });

    it("should not create product with invalid data", async () => {
      const productData = {
        name: "",
        price: -10,
        stock: -5,
        categoryId: 999,
      };

      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe("PUT /api/products/:id", () => {
    let product;

    beforeEach(async () => {
      product = await Product.create({
        name: "iPhone 15",
        description: "Latest iPhone",
        price: 999.99,
        stock: 10,
        categoryId: category.id,
      });
    });

    it("should update product as admin", async () => {
      const updateData = {
        name: "iPhone 15 Pro",
        price: 1099.99,
      };

      const response = await request(app)
        .put(`/api/products/${product.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe("Product updated successfully");
      expect(response.body.product.name).toBe(updateData.name);
      expect(Number.parseFloat(response.body.product.price)).toBe(
        updateData.price
      );
    });

    it("should not update non-existent product", async () => {
      const updateData = {
        name: "iPhone 15 Pro",
      };

      const response = await request(app)
        .put("/api/products/999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.error).toBe("Product not found");
    });
  });

  describe("DELETE /api/products/:id", () => {
    let product;

    beforeEach(async () => {
      product = await Product.create({
        name: "iPhone 15",
        description: "Latest iPhone",
        price: 999.99,
        stock: 10,
        categoryId: category.id,
      });
    });

    it("should delete product as admin", async () => {
      const response = await request(app)
        .delete(`/api/products/${product.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.message).toBe("Product deleted successfully");

      // Verify product is deleted
      const deletedProduct = await Product.findByPk(product.id);
      expect(deletedProduct).toBeNull();
    });

    it("should not delete non-existent product", async () => {
      const response = await request(app)
        .delete("/api/products/999")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.error).toBe("Product not found");
    });
  });
});
