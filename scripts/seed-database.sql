-- Seed script for E-commerce API
-- Run this after the application has created the tables

-- Insert sample categories
INSERT INTO "Categories" (name, description, "createdAt", "updatedAt") VALUES
('Electronics', 'Electronic devices and gadgets', NOW(), NOW()),
('Clothing', 'Fashion and apparel', NOW(), NOW()),
('Books', 'Books and educational materials', NOW(), NOW()),
('Home & Garden', 'Home improvement and gardening supplies', NOW(), NOW()),
('Sports', 'Sports equipment and accessories', NOW(), NOW()),
('Beauty', 'Beauty and personal care products', NOW(), NOW()),
('Toys', 'Toys and games for all ages', NOW(), NOW()),
('Automotive', 'Car accessories and parts', NOW(), NOW());

-- Insert admin user (password: admin123)
INSERT INTO "Users" (email, password, "firstName", "lastName", role, "createdAt", "updatedAt") VALUES
('admin@ecommerce.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPyV2yvO', 'Admin', 'User', 'admin', NOW(), NOW());

-- Insert sample customers (password: customer123)
INSERT INTO "Users" (email, password, "firstName", "lastName", role, "createdAt", "updatedAt") VALUES
('john.doe@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', 'customer', NOW(), NOW()),
('jane.smith@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Smith', 'customer', NOW(), NOW()),
('mike.johnson@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mike', 'Johnson', 'customer', NOW(), NOW());

-- Insert sample products
INSERT INTO "Products" (name, description, price, stock, "categoryId", "imageUrl", "createdAt", "updatedAt") VALUES
-- Electronics
('iPhone 15 Pro', 'Latest Apple smartphone with advanced camera system and A17 Pro chip', 1199.99, 25, 1, 'https://example.com/iphone15pro.jpg', NOW(), NOW()),
('Samsung Galaxy S24', 'Premium Android smartphone with AI features', 999.99, 30, 1, 'https://example.com/galaxys24.jpg', NOW(), NOW()),
('MacBook Air M3', 'Lightweight laptop with M3 chip and all-day battery life', 1299.99, 15, 1, 'https://example.com/macbookair.jpg', NOW(), NOW()),
('Sony WH-1000XM5', 'Industry-leading noise canceling wireless headphones', 399.99, 40, 1, 'https://example.com/sony-headphones.jpg', NOW(), NOW()),
('iPad Pro 12.9"', 'Most advanced iPad with M2 chip and Liquid Retina display', 1099.99, 20, 1, 'https://example.com/ipadpro.jpg', NOW(), NOW()),

-- Clothing
('Nike Air Max 270', 'Comfortable running shoes with Max Air cushioning', 149.99, 50, 2, 'https://example.com/airmax270.jpg', NOW(), NOW()),
('Levi''s 501 Jeans', 'Classic straight-fit jeans in premium denim', 79.99, 40, 2, 'https://example.com/levis501.jpg', NOW(), NOW()),
('Adidas Ultraboost 22', 'High-performance running shoes with Boost technology', 189.99, 35, 2, 'https://example.com/ultraboost.jpg', NOW(), NOW()),
('North Face Jacket', 'Waterproof outdoor jacket for all weather conditions', 249.99, 25, 2, 'https://example.com/northface.jpg', NOW(), NOW()),
('Champion Hoodie', 'Comfortable cotton blend hoodie in various colors', 59.99, 60, 2, 'https://example.com/champion-hoodie.jpg', NOW(), NOW()),

-- Books
('The Great Gatsby', 'Classic American novel by F. Scott Fitzgerald', 12.99, 100, 3, 'https://example.com/gatsby.jpg', NOW(), NOW()),
('JavaScript: The Good Parts', 'Essential JavaScript programming guide by Douglas Crockford', 29.99, 75, 3, 'https://example.com/jsbook.jpg', NOW(), NOW()),
('Clean Code', 'A handbook of agile software craftsmanship', 34.99, 50, 3, 'https://example.com/cleancode.jpg', NOW(), NOW()),
('Atomic Habits', 'An easy and proven way to build good habits', 18.99, 80, 3, 'https://example.com/atomichabits.jpg', NOW(), NOW()),
('The Psychology of Money', 'Timeless lessons on wealth, greed, and happiness', 16.99, 65, 3, 'https://example.com/psychology-money.jpg', NOW(), NOW()),

-- Home & Garden
('Dyson V15 Detect', 'Cordless vacuum with laser dust detection', 749.99, 15, 4, 'https://example.com/dyson-v15.jpg', NOW(), NOW()),
('Instant Pot Duo 7-in-1', 'Multi-use pressure cooker and slow cooker', 99.99, 30, 4, 'https://example.com/instantpot.jpg', NOW(), NOW()),
('Garden Hose 50ft', 'Durable expandable garden hose with spray nozzle', 39.99, 60, 4, 'https://example.com/gardenhose.jpg', NOW(), NOW()),
('LED Desk Lamp', 'Adjustable LED desk lamp with USB charging port', 49.99, 35, 4, 'https://example.com/desklamp.jpg', NOW(), NOW()),
('Air Purifier HEPA', 'True HEPA air purifier for large rooms', 199.99, 20, 4, 'https://example.com/airpurifier.jpg', NOW(), NOW()),

-- Sports
('Wilson Basketball', 'Official size basketball for indoor and outdoor play', 24.99, 80, 5, 'https://example.com/basketball.jpg', NOW(), NOW()),
('Yoga Mat Premium', 'Non-slip yoga mat with carrying strap', 34.99, 45, 5, 'https://example.com/yogamat.jpg', NOW(), NOW()),
('Dumbbells Set', 'Adjustable dumbbell set 5-50 lbs', 299.99, 12, 5, 'https://example.com/dumbbells.jpg', NOW(), NOW()),
('Tennis Racket Pro', 'Professional tennis racket for advanced players', 149.99, 25, 5, 'https://example.com/tennisracket.jpg', NOW(), NOW()),
('Fitness Tracker', 'Waterproof fitness tracker with heart rate monitor', 79.99, 55, 5, 'https://example.com/fitnesstracker.jpg', NOW(), NOW());

-- Add some sample cart items for demonstration
INSERT INTO "Carts" ("userId", "productId", quantity, "priceAtTime", "createdAt", "updatedAt") VALUES
(2, 1, 1, 1199.99, NOW(), NOW()),
(2, 6, 2, 149.99, NOW(), NOW()),
(3, 11, 1, 12.99, NOW(), NOW()),
(3, 16, 1, 749.99, NOW(), NOW());

-- Add some sample orders
INSERT INTO "Orders" ("userId", "totalAmount", status, "createdAt", "updatedAt") VALUES
(2, 1499.97, 'delivered', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),
(3, 762.98, 'shipped', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
(4, 89.98, 'pending', NOW() - INTERVAL '1 day', NOW());

-- Add order items for the sample orders
INSERT INTO "OrderItems" ("orderId", "productId", quantity, "priceAtTime", "createdAt", "updatedAt") VALUES
-- Order 1 items
(1, 1, 1, 1199.99, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(1, 6, 2, 149.99, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

-- Order 2 items
(2, 11, 1, 12.99, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(2, 16, 1, 749.99, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- Order 3 items
(3, 21, 1, 24.99, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(3, 22, 2, 34.99, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Update product stock to reflect the orders
UPDATE "Products" SET stock = stock - 1 WHERE id = 1;
UPDATE "Products" SET stock = stock - 2 WHERE id = 6;
UPDATE "Products" SET stock = stock - 1 WHERE id = 11;
UPDATE "Products" SET stock = stock - 1 WHERE id = 16;
UPDATE "Products" SET stock = stock - 1 WHERE id = 21;
UPDATE "Products" SET stock = stock - 2 WHERE id = 22;
