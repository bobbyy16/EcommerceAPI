const request = require("supertest");
const app = require("../server");
const { User, Category, Product, Cart } = require("../models");

describe("Cart", () => {
  let customerToken, category, product;

  beforeEach(async () => {
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

    // Create customer user
    const customerUser = await User.create({
      email: "customer@example.com",
      password: "password123",
      firstName: "Customer",
      lastName: "User",
      role: "customer",
    });

    // Login customer
    const customerLogin = await request(app).post("/api/auth/login").send({
      email: "customer@example.com",
      password: "password123",
    });
    customerToken = customerLogin.body.token;

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

  describe("POST /api/cart", () => {
    it("should add item to cart", async () => {
      const cartData = {
        productId: product.id,
        quantity: 2,
      };

      const response = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(cartData)
        .expect(201);

      expect(response.body.message).toBe("Item added to cart successfully");
      expect(response.body.cartItem.quantity).toBe(2);
      expect(Number.parseFloat(response.body.cartItem.priceAtTime)).toBe(
        999.99
      );
    });

    it("should update quantity if item already exists in cart", async () => {
      // Add item first time
      await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          productId: product.id,
          quantity: 2,
        });

      // Add same item again
      const response = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          productId: product.id,
          quantity: 3,
        })
        .expect(200);

      expect(response.body.message).toBe("Cart item updated successfully");
      expect(response.body.cartItem.quantity).toBe(5);
    });

    it("should not add item with insufficient stock", async () => {
      const cartData = {
        productId: product.id,
        quantity: 15, // More than available stock (10)
      };

      const response = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(cartData)
        .expect(400);

      expect(response.body.error).toBe("Insufficient stock");
      expect(response.body.availableStock).toBe(10);
    });

    it("should not add non-existent product", async () => {
      const cartData = {
        productId: 999,
        quantity: 1,
      };

      const response = await request(app)
        .post("/api/cart")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(cartData)
        .expect(404);

      expect(response.body.error).toBe("Product not found");
    });
  });

  describe("GET /api/cart", () => {
    beforeEach(async () => {
      const user = await User.findOne({
        where: { email: "customer@example.com" },
      });
      await Cart.create({
        userId: user.id,
        productId: product.id,
        quantity: 2,
        priceAtTime: 999.99,
      });
    });

    it("should get cart items", async () => {
      const response = await request(app)
        .get("/api/cart")
        .set("Authorization", `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.cartItems).toHaveLength(1);
      expect(response.body.summary.totalItems).toBe(1);
      expect(response.body.summary.totalQuantity).toBe(2);
      expect(response.body.summary.totalAmount).toBe(1999.98);
    });
  });

  describe("PUT /api/cart/:id", () => {
    let cartItem;

    beforeEach(async () => {
      const user = await User.findOne({
        where: { email: "customer@example.com" },
      });
      cartItem = await Cart.create({
        userId: user.id,
        productId: product.id,
        quantity: 2,
        priceAtTime: 999.99,
      });
    });

    it("should update cart item quantity", async () => {
      const response = await request(app)
        .put(`/api/cart/${cartItem.id}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ quantity: 5 })
        .expect(200);

      expect(response.body.message).toBe("Cart item updated successfully");
      expect(response.body.cartItem.quantity).toBe(5);
    });

    it("should not update with insufficient stock", async () => {
      const response = await request(app)
        .put(`/api/cart/${cartItem.id}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ quantity: 15 })
        .expect(400);

      expect(response.body.error).toBe("Insufficient stock");
    });
  });

  describe("DELETE /api/cart/:id", () => {
    let cartItem;

    beforeEach(async () => {
      const user = await User.findOne({
        where: { email: "customer@example.com" },
      });
      cartItem = await Cart.create({
        userId: user.id,
        productId: product.id,
        quantity: 2,
        priceAtTime: 999.99,
      });
    });

    it("should remove item from cart", async () => {
      const response = await request(app)
        .delete(`/api/cart/${cartItem.id}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body.message).toBe("Item removed from cart successfully");

      // Verify item is removed
      const deletedItem = await Cart.findByPk(cartItem.id);
      expect(deletedItem).toBeNull();
    });
  });
});
