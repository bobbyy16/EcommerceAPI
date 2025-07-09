# E-Commerce REST API (MVC Architecture)

A comprehensive e-commerce REST API built with **MVC (Model-View-Controller) architecture** using Node.js, Express.js, PostgreSQL, and Cloudinary for image uploads. This API provides complete functionality for user authentication, product management, shopping cart, and order processing with persistent cart pricing.

## 🏗️ Architecture Overview

This application follows the **MVC (Model-View-Controller)** pattern:

- **Models** (`/models`): Database models and business logic using Sequelize ORM
- **Views** (`/routes` + Swagger): API endpoints and documentation (RESTful API serves as the view layer)
- **Controllers** (`/controllers`): Business logic and request handling
- **Middleware** (`/middleware`): Authentication, validation, and file upload handling
- **Configuration** (`/config`): Database, Cloudinary, and Swagger configuration

## 📁 Project Structure

\`\`\`
ecommerce-api-mvc/
├── config/
│ ├── database.js # Database configuration
│ ├── cloudinary.js # Cloudinary configuration
│ └── swagger.js # Swagger documentation config
├── controllers/
│ ├── authController.js # Authentication logic
│ ├── categoryController.js # Category management logic
│ ├── productController.js # Product management logic
│ ├── cartController.js # Shopping cart logic
│ └── orderController.js # Order processing logic
├── middleware/
│ ├── auth.js # Authentication middleware
│ ├── upload.js # File upload middleware
│ └── validation.js # Input validation middleware
├── models/
│ ├── index.js # Sequelize initialization
│ ├── User.js # User model
│ ├── Category.js # Category model
│ ├── Product.js # Product model
│ ├── Cart.js # Cart model
│ ├── Order.js # Order model
│ └── OrderItem.js # Order item model
├── routes/
│ ├── authRoutes.js # Authentication routes
│ ├── categoryRoutes.js # Category routes
│ ├── productRoutes.js # Product routes
│ ├── cartRoutes.js # Cart routes
│ └── orderRoutes.js # Order routes
├── tests/
│ ├── setup.js # Test configuration
│ └── auth.test.js # Authentication tests
├── server.js # Application entry point
├── package.json # Dependencies and scripts
└── README.md # This file
\`\`\`

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin/Customer)
- Secure password hashing with bcrypt
- Protected routes with middleware

### 📦 Product Management

- CRUD operations for products
- Image upload to Cloudinary
- Category-based organization
- Stock management
- Advanced filtering and search

### 🛒 Shopping Cart

- Add/remove items from cart
- Update quantities
- Persistent cart pricing (maintains original price even if product price changes)
- Cart summary with totals

### 📋 Order Management

- Place orders from cart items
- Order history for customers
- Order status management for admins
- Stock deduction on order placement

### 🔍 Advanced Features

- Product filtering by category, price range, and name
- Pagination for all list endpoints
- Comprehensive input validation
- Swagger API documentation
- Automated testing suite

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Architecture**: MVC (Model-View-Controller)
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Validation**: express-validator
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**
- **Cloudinary account** (for image uploads)

## 🚀 Installation Guide

### Step 1: Clone the Repository

\`\`\`bash
git clone <repository-url>
cd ecommerce-api-mvc
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 3: Set Up Environment Variables

1. Copy the example environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Update the `.env` file with your configuration:

\`\`\`env

# Database Configuration

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration

JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (Sign up at https://cloudinary.com)

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration

PORT=3000
NODE_ENV=development
\`\`\`

### Step 4: Set Up PostgreSQL Database

1. **Install PostgreSQL** (if not already installed):

   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`

2. **Create a database**:
   \`\`\`bash

# Connect to PostgreSQL

psql -U postgres

# Create database

CREATE DATABASE ecommerce_db;

# Create user (optional)

CREATE USER your_db_user WITH PASSWORD 'your_db_password';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO your_db_user;

# Exit PostgreSQL

\q
\`\`\`

### Step 5: Set Up Cloudinary

1. **Sign up** for a free account at [cloudinary.com](https://cloudinary.com)
2. **Get your credentials** from the dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. **Add them** to your `.env` file

### Step 6: Run Database Migrations

The application will automatically create tables when you start the server for the first time.

### Step 7: Start the Application

\`\`\`bash

# Development mode (with auto-restart)

npm run dev

# Production mode

npm start
\`\`\`

The server will start on `http://localhost:3000` (or your specified PORT).

## 📚 API Documentation

Once the server is running, you can access:

- **API Documentation**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/health`

## 🧪 Testing

Run the test suite:

\`\`\`bash

# Run all tests

npm test

# Run tests in watch mode

npm run test:watch
\`\`\`

## 📖 API Usage Examples

### 1. User Registration

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/signup \
 -H "Content-Type: application/json" \
 -d '{
"email": "admin@example.com",
"password": "admin123",
"firstName": "Admin",
"lastName": "User",
"role": "admin"
}'
\`\`\`

### 2. User Login

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{
"email": "admin@example.com",
"password": "admin123"
}'
\`\`\`

### 3. Create Category (Admin)

\`\`\`bash
curl -X POST http://localhost:3000/api/categories \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 -d '{
"name": "Electronics",
"description": "Electronic devices and gadgets"
}'
\`\`\`

### 4. Create Product with Image (Admin)

\`\`\`bash
curl -X POST http://localhost:3000/api/products \
 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 -F "name=iPhone 15" \
 -F "description=Latest iPhone model" \
 -F "price=999.99" \
 -F "stock=10" \
 -F "categoryId=1" \
 -F "image=@/path/to/image.jpg"
\`\`\`

### 5. Get Products with Filters

\`\`\`bash
curl "http://localhost:3000/api/products?search=iPhone&category=1&minPrice=500&maxPrice=1500&page=1&limit=10"
\`\`\`

### 6. Add to Cart (Customer)

\`\`\`bash
curl -X POST http://localhost:3000/api/cart \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_CUSTOMER_JWT_TOKEN" \
 -d '{
"productId": 1,
"quantity": 2
}'
\`\`\`

### 7. Place Order (Customer)

\`\`\`bash
curl -X POST http://localhost:3000/api/orders \
 -H "Authorization: Bearer YOUR_CUSTOMER_JWT_TOKEN"
\`\`\`

## 🔧 Configuration Options

### Database Configuration

The application supports different database configurations for different environments:

- **Development**: Full logging enabled
- **Test**: Separate test database with logging disabled
- **Production**: Optimized for performance

### JWT Configuration

- **JWT_SECRET**: Should be a long, complex string in production
- **JWT_EXPIRES_IN**: Token expiration time (e.g., '7d', '24h', '30m')

### Cloudinary Configuration

- **Folder Organization**: Images are organized in folders (e.g., 'products')
- **Image Optimization**: Automatic resizing and quality optimization
- **File Size Limit**: 5MB maximum file size

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**:

   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Cloudinary Upload Error**:

   - Verify Cloudinary credentials
   - Check internet connection
   - Ensure image file is valid

3. **JWT Token Error**:

   - Check if JWT_SECRET is set
   - Verify token format in Authorization header
   - Check token expiration

4. **Port Already in Use**:
   \`\`\`bash

   # Find process using port 3000

   lsof -i :3000

   # Kill the process

   kill -9 <PID>
   \`\`\`

### Debug Mode

Enable debug logging by setting:
\`\`\`env
NODE_ENV=development
\`\`\`

## 🔒 Security Best Practices

- **Environment Variables**: Never commit `.env` files
- **JWT Secret**: Use a strong, unique secret in production
- **Password Hashing**: Passwords are automatically hashed with bcrypt
- **Input Validation**: All inputs are validated using express-validator
- **CORS**: Configured for security
- **Helmet**: Security headers are automatically added

## 📈 Performance Optimization

- **Database Indexing**: Proper indexes on frequently queried fields
- **Pagination**: All list endpoints support pagination
- **Image Optimization**: Cloudinary automatically optimizes images
- **Connection Pooling**: Database connection pooling is configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the API documentation at `/api-docs`
3. Create an issue in the repository
4. Contact the development team

---

**Happy coding! 🚀**
