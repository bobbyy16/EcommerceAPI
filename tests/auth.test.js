const request = require("supertest");
const app = require("../server");
const { User } = require("../models");

describe("Authentication", () => {
  beforeEach(async () => {
    await User.destroy({
      where: {},
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe("User created successfully");
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.role).toBe("customer");
    });

    it("should not create user with invalid email", async () => {
      const userData = {
        email: "invalid-email",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });

    it("should not create duplicate user", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
      };

      await request(app).post("/api/auth/signup").send(userData).expect(201);

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(409);

      expect(response.body.error).toBe("User already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await User.create({
        email: "test@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should login successfully with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe("Login successful");
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
    });

    it("should not login with invalid credentials", async () => {
      const loginData = {
        email: "wrong@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body.error).toBe("Invalid credentials");
    });
  });

  describe("GET /api/auth/profile", () => {
    let token;

    beforeEach(async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
      };

      const signupResponse = await request(app)
        .post("/api/auth/signup")
        .send(userData);

      token = signupResponse.body.token;
    });

    it("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.user.email).toBe("test@example.com");
      expect(response.body.user.firstName).toBe("John");
    });

    it("should not get profile without token", async () => {
      const response = await request(app).get("/api/auth/profile").expect(401);

      expect(response.body.error).toBe("Access token required");
    });
  });
});
