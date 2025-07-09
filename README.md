# 🛒 E-commerce REST API

A comprehensive e-commerce REST API built with Node.js, Express.js, and PostgreSQL. This API provides a complete backend solution for e-commerce applications with features like user authentication, product management, shopping cart, and order processing.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

## ✨ Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 👥 **User Management** - Customer and admin user roles
- 📦 **Product Management** - CRUD operations with image upload support
- 🏷️ **Category Management** - Organize products by categories
- 🛒 **Shopping Cart** - Add, update, remove items with persistent pricing
- 📋 **Order Management** - Complete order processing workflow
- 🔍 **Advanced Filtering** - Search, filter, and pagination for products
- 📸 **Image Upload** - Cloudinary integration for product images
- 📚 **API Documentation** - Interactive Swagger/OpenAPI documentation
- 🧪 **Comprehensive Testing** - Unit and integration tests with Jest
- 🔒 **Security** - Helmet.js, CORS, input validation, and sanitization

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer + Cloudinary
- **Validation:** Express Validator
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest + Supertest
- **Security:** Helmet.js, bcryptjs

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/bobbyy16/EcommerceAPI.git
cd EcommerceAPI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE ecommerce_db;
```

### 5. Run Database Migrations

The application will automatically create tables on startup. To seed the database with sample data:

```bash
# The seed script is located in scripts/seed-database.sql
# Run it in your PostgreSQL client or pgAdmin
```

### 6. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## 📖 API Documentation

Once the server is running, you can access the interactive API documentation at:

- **Swagger UI:** `http://localhost:3000/api-docs`
- **Health Check:** `http://localhost:3000/health`

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Products

- `GET /api/products` - Get all products (with filtering & pagination)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Cart

- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders

- `POST /api/orders` - Place an order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/admin/all` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Database Setup

Create a test database:

```sql
CREATE DATABASE ecommerce_test_db;
```

Create a `.env.test` file:

```env
NODE_ENV=test
DB_NAME=ecommerce_test_db
JWT_SECRET=test-jwt-secret
# ... other test configurations
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Bobby** - [GitHub Profile](https://github.com/bobbyy16)

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- Sequelize team for the excellent ORM
- All contributors and the open-source community

---

⭐ If you found this project helpful, please give it a star!

```

```
