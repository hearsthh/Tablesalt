-- =====================================================
-- TABLESALT AI - SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample organization
INSERT INTO organizations (id, name, slug, email, subscription_plan) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Demo Restaurant Group', 'demo-restaurant-group', 'admin@demorestaurant.com', 'professional');

-- Insert sample user
INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name, role) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'admin@demorestaurant.com', '$2b$10$example_hash', 'John', 'Doe', 'admin');

-- Insert sample restaurant
INSERT INTO restaurants (id, organization_id, name, slug, description, cuisine_type, phone, email) VALUES 
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Bella Vista Italian', 'bella-vista-italian', 'Authentic Italian cuisine with modern flair', 'Italian', '+1-555-0123', 'info@bellavista.com');

-- Insert sample menu categories
INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order) VALUES 
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Appetizers', 'Start your meal with our delicious appetizers', 1),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Main Courses', 'Our signature pasta and meat dishes', 2),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Desserts', 'Sweet endings to your perfect meal', 3);

-- Insert sample menu items
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, calories, preparation_time) VALUES 
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Bruschetta Trio', 'Three varieties of our signature bruschetta', 12.99, 320, 10),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'Spaghetti Carbonara', 'Classic Roman pasta with pancetta and parmesan', 18.99, 650, 15),
('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'Tiramisu', 'Traditional Italian dessert with espresso and mascarpone', 8.99, 420, 5);

-- Insert sample customers
INSERT INTO customers (id, restaurant_id, email, first_name, last_name, total_orders, total_spent) VALUES 
('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', 'sarah@example.com', 'Sarah', 'Johnson', 5, 127.45),
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'mike@example.com', 'Mike', 'Chen', 3, 89.97);

-- Insert sample orders
INSERT INTO orders (id, restaurant_id, customer_id, order_number, subtotal, total_amount, order_type, order_status) VALUES 
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440009', 'ORD-001', 31.98, 34.78, 'dine-in', 'completed'),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 'ORD-002', 18.99, 20.67, 'takeaway', 'completed');

-- Insert sample reviews
INSERT INTO reviews (id, restaurant_id, customer_id, platform, rating, title, content) VALUES 
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440009', 'google', 5, 'Amazing Italian food!', 'The carbonara was absolutely perfect. Will definitely be back!'),
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 'yelp', 4, 'Great atmosphere', 'Food was good, service was excellent. Tiramisu was the highlight.');
