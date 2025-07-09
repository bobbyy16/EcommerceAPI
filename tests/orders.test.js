const request = require("supertest");
const app = require("../server");
const {
  User,
  Category,
  Product,
  Cart,
  Order,
  OrderItem,
} = require("../models");

describe("Orders", () => {
  let customerToken, adminToken, category, product, customer;

  beforeEach(async () => {
    await OrderItem.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await Order.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await Cart.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
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

    // Create users
    customer = await User.create({
      email: "customer@example.com",
      password: "password123",
      firstName: "Customer",
      lastName: "User",
      role: "customer",
    });

    const admin = await User.create({
      email: "admin@example.com",
      password: "password123",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    });

    // Login users
    const customerLogin = await request(app).post("/api/auth/login").send({
      email: "customer@example.com",
      password: "password123",
    });
    customerToken = customerLogin.body.token;

    const adminLogin = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });
    adminToken = adminLogin.body.token;

    // Create category and product
    category = await Category.create({
      name: "Electronics",
      description: "Electronic devices",
    });

    product = await Product.create({
      name: "iPhone 15",
      description: "Latest iPhone",
      price: 999.99,
      stock: 10,
      categoryId: category.id,
    });
  });

  describe("POST /api/orders", () => {
    beforeEach(async () => {
      // Add item to cart
      await Cart.create({
        userId: customer.id,
        productId: product.id,
        quantity: 2,
        priceAtTime: 999.99,
      });
    });

    it("should place order from cart items", async () => {
      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`)
        .expect(201);

      expect(response.body.message).toBe("Order placed successfully");
      expect(response.body.order.totalAmount).toBe("1999.98");
      expect(response.body.order.status).toBe("pending");
      expect(response.body.order.OrderItems).toHaveLength(1);

      // Verify cart is cleared
      const cartItems = await Cart.findAll({ where: { userId: customer.id } });
      expect(cartItems).toHaveLength(0);

      // Verify stock is updated
      const updatedProduct = await Product.findByPk(product.id);
      expect(updatedProduct.stock).toBe(8);
    });

    it("should not place order with empty cart", async () => {
      // Clear cart
      await Cart.destroy({ where: { userId: customer.id } });

      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`)
        .expect(400);

      expect(response.body.error).toBe("Cart is empty");
    });

    it("should not place order with insufficient stock", async () => {
      // Update product stock to less than cart quantity
      await product.update({ stock: 1 });

      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`)
        .expect(400);

      expect(response.body.error).toContain("Insufficient stock");
    });
  });

  describe("GET /api/orders", () => {
    let order;

    beforeEach(async () => {
      // Create order
      order = await Order.create({
        userId: customer.id,
        totalAmount: 999.99,
        status: "pending",
      });

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: 1,
        priceAtTime: 999.99,
      });
    });

    it("should get user orders", async () => {
      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.orders).toHaveLength(1);
      expect(response.body.orders[0].id).toBe(order.id);
      expect(response.body.pagination.totalItems).toBe(1);
    });

    it("should filter orders by status", async () => {
      const response = await request(app)
        .get("/api/orders?status=pending")
        .set("Authorization", `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.orders).toHaveLength(1);
      expect(response.body.orders[0].status).toBe("pending");
    });
  });

  describe("GET /api/orders/:id", () => {
    let order;

    beforeEach(async () => {
      order = await Order.create({
        userId: customer.id,
        totalAmount: 999.99,
        status: "pending",
      });

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: 1,
        priceAtTime: 999.99,
      });
    });

    it("should get order details", async () => {
      const response = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.order.id).toBe(order.id);
      expect(response.body.order.OrderItems).toHaveLength(1);
    });

    it("should not get other user's order", async () => {
      // Create another user
      const otherUser = await User.create({
        email: "other@example.com",
        password: "password123",
        firstName: "Other",
        lastName: "User",
        role: "customer",
      });

      const otherOrder = await Order.create({
        userId: otherUser.id,
        totalAmount: 999.99,
        status: "pending",
      });

      const response = await request(app)
        .get(`/api/orders/${otherOrder.id}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .expect(404);

      expect(response.body.error).toBe("Order not found");
    });
  });

  describe("PUT /api/orders/:id/status", () => {
    let order;

    beforeEach(async () => {
      order = await Order.create({
        userId: customer.id,
        totalAmount: 999.99,
        status: "pending",
      });
    });

    it("should update order status as admin", async () => {
      const response = await request(app)
        .put(`/api/orders/${order.id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "processing" })
        .expect(200);

      expect(response.body.message).toBe("Order status updated successfully");
      expect(response.body.order.status).toBe("processing");
    });

    it("should not update order status as customer", async () => {
      const response = await request(app)
        .put(`/api/orders/${order.id}/status`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ status: "processing" })
        .expect(403);

      expect(response.body.error).toBe("Admin access required");
    });
  });
});
