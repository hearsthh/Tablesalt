-- Sample data for development and testing
-- This script populates the database with realistic sample data

-- Insert sample restaurant (will be associated with the authenticated user)
INSERT INTO restaurants (id, name, description, address, phone, email, website, cuisine_type, price_range)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Bella Vista Italian',
  'Authentic Italian cuisine with a modern twist, featuring fresh ingredients and traditional recipes passed down through generations.',
  '123 Main Street, Downtown, NY 10001',
  '+1 (555) 123-4567',
  'info@bellavista.com',
  'https://bellavista.com',
  'Italian',
  '$$$'
) ON CONFLICT (id) DO NOTHING;

-- Insert menu categories
INSERT INTO menu_categories (id, restaurant_id, name, description, display_order) VALUES
('cat-1', '550e8400-e29b-41d4-a716-446655440000', 'Appetizers', 'Start your meal with our delicious appetizers', 1),
('cat-2', '550e8400-e29b-41d4-a716-446655440000', 'Main Courses', 'Our signature pasta dishes and entrees', 2),
('cat-3', '550e8400-e29b-41d4-a716-446655440000', 'Desserts', 'Sweet endings to your perfect meal', 3),
('cat-4', '550e8400-e29b-41d4-a716-446655440000', 'Beverages', 'Wine, cocktails, and non-alcoholic drinks', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert menu items
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, ingredients, allergens, dietary_info, calories, is_featured) VALUES
('item-1', '550e8400-e29b-41d4-a716-446655440000', 'cat-1', 'Classic Bruschetta', 'Toasted bread topped with fresh tomatoes, basil, and garlic', 12.99, ARRAY['bread', 'tomatoes', 'basil', 'garlic', 'olive oil'], ARRAY['gluten'], ARRAY['vegetarian'], 180, true),
('item-2', '550e8400-e29b-41d4-a716-446655440000', 'cat-2', 'Spaghetti Carbonara', 'Traditional Roman pasta with eggs, cheese, and pancetta', 18.99, ARRAY['spaghetti', 'eggs', 'pecorino cheese', 'pancetta', 'black pepper'], ARRAY['gluten', 'eggs', 'dairy'], ARRAY[], 520, true),
('item-3', '550e8400-e29b-41d4-a716-446655440000', 'cat-2', 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and fresh basil', 16.99, ARRAY['pizza dough', 'tomato sauce', 'mozzarella', 'basil'], ARRAY['gluten', 'dairy'], ARRAY['vegetarian'], 450, false),
('item-4', '550e8400-e29b-41d4-a716-446655440000', 'cat-3', 'Tiramisu', 'Traditional Italian dessert with coffee-soaked ladyfingers', 8.99, ARRAY['ladyfingers', 'coffee', 'mascarpone', 'eggs', 'cocoa'], ARRAY['gluten', 'eggs', 'dairy'], ARRAY['vegetarian'], 320, true),
('item-5', '550e8400-e29b-41d4-a716-446655440000', 'cat-4', 'Italian Soda', 'Refreshing sparkling water with fruit syrup', 4.99, ARRAY['sparkling water', 'fruit syrup'], ARRAY[], ARRAY['vegan'], 80, false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (id, restaurant_id, email, first_name, last_name, total_orders, total_spent, avg_order_value, customer_segment, loyalty_points) VALUES
('cust-1', '550e8400-e29b-41d4-a716-446655440000', 'john.doe@email.com', 'John', 'Doe', 15, 450.75, 30.05, 'Regular', 450),
('cust-2', '550e8400-e29b-41d4-a716-446655440000', 'sarah.smith@email.com', 'Sarah', 'Smith', 8, 280.40, 35.05, 'Regular', 280),
('cust-3', '550e8400-e29b-41d4-a716-446655440000', 'mike.johnson@email.com', 'Mike', 'Johnson', 25, 1250.00, 50.00, 'VIP', 1250),
('cust-4', '550e8400-e29b-41d4-a716-446655440000', 'emma.wilson@email.com', 'Emma', 'Wilson', 3, 85.50, 28.50, 'New', 85)
ON CONFLICT (id) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (id, restaurant_id, customer_id, order_number, status, order_type, subtotal, tax_amount, total_amount, payment_method, payment_status) VALUES
('order-1', '550e8400-e29b-41d4-a716-446655440000', 'cust-1', 'ORD-001', 'delivered', 'dine-in', 45.97, 4.14, 50.11, 'credit_card', 'paid'),
('order-2', '550e8400-e29b-41d4-a716-446655440000', 'cust-2', 'ORD-002', 'delivered', 'takeout', 31.98, 2.88, 34.86, 'cash', 'paid'),
('order-3', '550e8400-e29b-41d4-a716-446655440000', 'cust-3', 'ORD-003', 'preparing', 'delivery', 62.95, 5.67, 68.62, 'credit_card', 'paid')
ON CONFLICT (id) DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (id, restaurant_id, customer_id, platform, rating, title, content, reviewer_name, sentiment_score, sentiment_label, keywords, is_responded) VALUES
('rev-1', '550e8400-e29b-41d4-a716-446655440000', 'cust-1', 'google', 5, 'Amazing Italian Food!', 'The carbonara was absolutely perfect, and the service was exceptional. Will definitely be back!', 'John D.', 0.9, 'positive', ARRAY['carbonara', 'service', 'perfect'], false),
('rev-2', '550e8400-e29b-41d4-a716-446655440000', 'cust-2', 'yelp', 4, 'Great atmosphere', 'Lovely restaurant with authentic Italian vibes. The bruschetta was fresh and delicious.', 'Sarah S.', 0.7, 'positive', ARRAY['atmosphere', 'authentic', 'bruschetta'], true),
('rev-3', '550e8400-e29b-41d4-a716-446655440000', 'cust-3', 'internal', 5, 'Best tiramisu in town', 'I have tried tiramisu at many places, but this one is simply the best. Creamy, rich, and perfectly balanced.', 'Mike J.', 0.95, 'positive', ARRAY['tiramisu', 'best', 'creamy'], false),
('rev-4', '550e8400-e29b-41d4-a716-446655440000', null, 'google', 3, 'Good but slow service', 'Food was good but we had to wait quite a while for our order. The pizza was worth the wait though.', 'Anonymous', 0.1, 'neutral', ARRAY['slow', 'service', 'pizza', 'wait'], false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample marketing campaigns
INSERT INTO marketing_campaigns (id, restaurant_id, name, type, status, content, sent_count, opened_count, clicked_count) VALUES
('camp-1', '550e8400-e29b-41d4-a716-446655440000', 'Weekend Special Promotion', 'email', 'completed', '{"subject": "Weekend Special: 20% off all pasta dishes!", "body": "Join us this weekend for our special pasta promotion..."}', 250, 125, 35),
('camp-2', '550e8400-e29b-41d4-a716-446655440000', 'New Menu Launch', 'social', 'active', '{"platform": "instagram", "content": "Exciting new dishes added to our menu! Come try them today."}', 1, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Insert sample AI insights
INSERT INTO ai_insights (id, restaurant_id, insight_type, title, description, data, confidence_score, is_actionable) VALUES
('insight-1', '550e8400-e29b-41d4-a716-446655440000', 'customer_behavior', 'Peak Hours Analysis', 'Your busiest hours are 7-9 PM on weekends. Consider increasing staff during these times.', '{"peak_hours": ["19:00-21:00"], "days": ["friday", "saturday", "sunday"], "avg_orders": 45}', 0.85, true),
('insight-2', '550e8400-e29b-41d4-a716-446655440000', 'menu_optimization', 'Popular Item Trend', 'Carbonara orders have increased 35% this month. Consider featuring it more prominently.', '{"item": "Spaghetti Carbonara", "growth": 0.35, "orders_this_month": 127}', 0.92, true),
('insight-3', '550e8400-e29b-41d4-a716-446655440000', 'review_sentiment', 'Service Feedback', 'Recent reviews mention slow service. Average wait time complaints increased by 15%.', '{"sentiment_trend": "declining", "main_complaint": "slow_service", "increase": 0.15}', 0.78, true)
ON CONFLICT (id) DO NOTHING;
