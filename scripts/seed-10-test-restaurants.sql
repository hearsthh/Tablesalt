-- Creating comprehensive mock data for 10 test restaurants with all related data
-- Seed data for 10 test restaurants with comprehensive data

-- First, let's create 10 test restaurants
INSERT INTO restaurants (id, name, description, address, phone, email, website, cuisine_type, price_range, owner_id, settings, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Bella Vista Italian', 'Authentic Italian cuisine with a modern twist', '123 Main St, New York, NY 10001', '+1-555-0101', 'info@bellavista.com', 'https://bellavista.com', 'Italian', '$$$', '11111111-1111-1111-1111-111111111111', '{"timezone": "America/New_York", "currency": "USD"}', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Dragon Palace', 'Traditional Chinese dishes with premium ingredients', '456 Oak Ave, Los Angeles, CA 90210', '+1-555-0202', 'hello@dragonpalace.com', 'https://dragonpalace.com', 'Chinese', '$$', '22222222-2222-2222-2222-222222222222', '{"timezone": "America/Los_Angeles", "currency": "USD"}', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Taco Libre', 'Fresh Mexican street food and craft cocktails', '789 Pine St, Austin, TX 78701', '+1-555-0303', 'orders@tacolibre.com', 'https://tacolibre.com', 'Mexican', '$$', '33333333-3333-3333-3333-333333333333', '{"timezone": "America/Chicago", "currency": "USD"}', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Sakura Sushi', 'Premium sushi and Japanese cuisine', '321 Elm St, San Francisco, CA 94102', '+1-555-0404', 'reservations@sakurasushi.com', 'https://sakurasushi.com', 'Japanese', '$$$$', '44444444-4444-4444-4444-444444444444', '{"timezone": "America/Los_Angeles", "currency": "USD"}', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'The Burger Joint', 'Gourmet burgers and craft beer', '654 Maple Ave, Chicago, IL 60601', '+1-555-0505', 'info@burgerjoint.com', 'https://burgerjoint.com', 'American', '$$', '55555555-5555-5555-5555-555555555555', '{"timezone": "America/Chicago", "currency": "USD"}', NOW(), NOW()),
('66666666-6666-6666-6666-666666666666', 'Mediterranean Breeze', 'Fresh Mediterranean flavors and healthy options', '987 Cedar St, Miami, FL 33101', '+1-555-0606', 'contact@medbreeze.com', 'https://medbreeze.com', 'Mediterranean', '$$$', '66666666-6666-6666-6666-666666666666', '{"timezone": "America/New_York", "currency": "USD"}', NOW(), NOW()),
('77777777-7777-7777-7777-777777777777', 'Spice Route', 'Authentic Indian cuisine with bold flavors', '147 Birch St, Seattle, WA 98101', '+1-555-0707', 'orders@spiceroute.com', 'https://spiceroute.com', 'Indian', '$$', '77777777-7777-7777-7777-777777777777', '{"timezone": "America/Los_Angeles", "currency": "USD"}', NOW(), NOW()),
('88888888-8888-8888-8888-888888888888', 'Le Petit Bistro', 'Classic French cuisine in an intimate setting', '258 Willow St, Boston, MA 02101', '+1-555-0808', 'reservations@petitbistro.com', 'https://petitbistro.com', 'French', '$$$$', '88888888-8888-8888-8888-888888888888', '{"timezone": "America/New_York", "currency": "USD"}', NOW(), NOW()),
('99999999-9999-9999-9999-999999999999', 'BBQ Smokehouse', 'Slow-smoked meats and Southern comfort food', '369 Ash St, Nashville, TN 37201', '+1-555-0909', 'info@bbqsmokehouse.com', 'https://bbqsmokehouse.com', 'BBQ', '$$', '99999999-9999-9999-9999-999999999999', '{"timezone": "America/Chicago", "currency": "USD"}', NOW(), NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Green Garden Cafe', 'Organic vegetarian and vegan dishes', '741 Spruce St, Portland, OR 97201', '+1-555-1010', 'hello@greengarden.com', 'https://greengarden.com', 'Vegetarian', '$$', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '{"timezone": "America/Los_Angeles", "currency": "USD"}', NOW(), NOW());

-- Create menu categories for each restaurant
INSERT INTO menu_categories (id, restaurant_id, name, description, display_order, is_active, created_at) VALUES
-- Bella Vista Italian
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Appetizers', 'Start your meal with our delicious appetizers', 1, true, NOW()),
('c1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Pasta', 'Fresh handmade pasta dishes', 2, true, NOW()),
('c1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'Pizza', 'Wood-fired pizzas with premium toppings', 3, true, NOW()),
('c1111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', 'Desserts', 'Traditional Italian desserts', 4, true, NOW()),
-- Dragon Palace
('c2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'Dim Sum', 'Traditional steamed and fried dumplings', 1, true, NOW()),
('c2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Stir Fry', 'Wok-tossed dishes with fresh vegetables', 2, true, NOW()),
('c2222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'Noodles', 'Hand-pulled noodles and rice dishes', 3, true, NOW()),
-- Taco Libre
('c3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'Tacos', 'Authentic street tacos with fresh ingredients', 1, true, NOW()),
('c3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'Burritos', 'Large flour tortillas stuffed with goodness', 2, true, NOW()),
('c3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Cocktails', 'Craft cocktails and margaritas', 3, true, NOW());

-- Create sample menu items (showing a few examples for each restaurant)
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, calories, prep_time, is_available, is_featured, tags, dietary_info, allergens, ingredients, created_at, updated_at) VALUES
-- Bella Vista Italian
('m1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Bruschetta Trio', 'Three varieties of our signature bruschetta', 14.99, 320, 10, true, true, ARRAY['appetizer', 'vegetarian'], ARRAY['vegetarian'], ARRAY['gluten'], ARRAY['tomatoes', 'basil', 'mozzarella', 'bread'], NOW(), NOW()),
('m1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111112', 'Spaghetti Carbonara', 'Classic Roman pasta with pancetta and egg', 18.99, 650, 15, true, true, ARRAY['pasta', 'classic'], ARRAY[], ARRAY['gluten', 'eggs'], ARRAY['spaghetti', 'pancetta', 'eggs', 'parmesan'], NOW(), NOW()),
('m1111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111113', 'Margherita Pizza', 'San Marzano tomatoes, fresh mozzarella, basil', 16.99, 580, 12, true, true, ARRAY['pizza', 'vegetarian', 'classic'], ARRAY['vegetarian'], ARRAY['gluten', 'dairy'], ARRAY['pizza dough', 'tomatoes', 'mozzarella', 'basil'], NOW(), NOW()),
-- Dragon Palace
('m2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222221', 'Pork Dumplings', 'Steamed dumplings with seasoned pork filling', 12.99, 280, 8, true, true, ARRAY['dim sum', 'steamed'], ARRAY[], ARRAY['gluten'], ARRAY['pork', 'flour', 'ginger', 'soy sauce'], NOW(), NOW()),
('m2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'Kung Pao Chicken', 'Spicy stir-fried chicken with peanuts', 16.99, 420, 12, true, false, ARRAY['spicy', 'stir fry'], ARRAY[], ARRAY['peanuts'], ARRAY['chicken', 'peanuts', 'chili peppers', 'vegetables'], NOW(), NOW()),
-- Taco Libre
('m3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333331', 'Carnitas Tacos', 'Slow-cooked pork with onions and cilantro', 3.99, 180, 5, true, true, ARRAY['street taco', 'pork'], ARRAY[], ARRAY[], ARRAY['pork', 'corn tortilla', 'onions', 'cilantro'], NOW(), NOW()),
('m3333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333332', 'California Burrito', 'Carne asada with fries, cheese, and guacamole', 13.99, 850, 10, true, true, ARRAY['burrito', 'beef'], ARRAY[], ARRAY['dairy'], ARRAY['beef', 'fries', 'cheese', 'guacamole', 'flour tortilla'], NOW(), NOW());

-- Create customers for each restaurant
INSERT INTO customers (id, restaurant_id, first_name, last_name, email, phone, total_orders, total_spent, avg_order_value, loyalty_points, customer_segment, preferences, dietary_restrictions, last_order_date, created_at, updated_at) VALUES
-- Bella Vista Italian customers
('cu111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'John', 'Smith', 'john.smith@email.com', '+1-555-1001', 15, 487.50, 32.50, 150, 'regular', '{"favorite_items": ["Spaghetti Carbonara", "Margherita Pizza"], "preferred_time": "evening"}', ARRAY[], NOW() - INTERVAL '3 days', NOW() - INTERVAL '6 months', NOW()),
('cu111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Sarah', 'Johnson', 'sarah.j@email.com', '+1-555-1002', 8, 234.80, 29.35, 80, 'occasional', '{"favorite_items": ["Bruschetta Trio"], "preferred_time": "lunch"}', ARRAY['vegetarian'], NOW() - INTERVAL '1 week', NOW() - INTERVAL '4 months', NOW()),
-- Dragon Palace customers
('cu222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'Michael', 'Chen', 'michael.chen@email.com', '+1-555-2001', 22, 678.90, 30.86, 220, 'vip', '{"favorite_items": ["Pork Dumplings", "Kung Pao Chicken"], "preferred_time": "dinner"}', ARRAY[], NOW() - INTERVAL '2 days', NOW() - INTERVAL '8 months', NOW()),
('cu222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Lisa', 'Wong', 'lisa.wong@email.com', '+1-555-2002', 12, 345.60, 28.80, 120, 'regular', '{"favorite_items": ["Dim Sum"], "preferred_time": "lunch"}', ARRAY[], NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 months', NOW()),
-- Taco Libre customers
('cu333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'Carlos', 'Rodriguez', 'carlos.r@email.com', '+1-555-3001', 18, 234.50, 13.03, 180, 'regular', '{"favorite_items": ["Carnitas Tacos"], "preferred_time": "lunch"}', ARRAY[], NOW() - INTERVAL '1 day', NOW() - INTERVAL '7 months', NOW()),
('cu333333-3333-3333-3333-333333333332', '33333333-3333-3333-3333-333333333333', 'Emma', 'Davis', 'emma.davis@email.com', '+1-555-3002', 6, 89.40, 14.90, 60, 'occasional', '{"favorite_items": ["California Burrito"], "preferred_time": "dinner"}', ARRAY[], NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 months', NOW());

-- Create sample orders
INSERT INTO orders (id, restaurant_id, customer_id, order_number, status, order_type, payment_method, payment_status, subtotal, tax_amount, tip_amount, total_amount, notes, created_at, updated_at) VALUES
('o1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'cu111111-1111-1111-1111-111111111111', 'BV-001', 'completed', 'dine_in', 'credit_card', 'paid', 45.98, 4.14, 9.20, 59.32, 'Table 12', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('o2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'cu222222-2222-2222-2222-222222222221', 'DP-001', 'completed', 'takeout', 'cash', 'paid', 29.98, 2.70, 6.00, 38.68, 'Extra spicy', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('o3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'cu333333-3333-3333-3333-333333333331', 'TL-001', 'completed', 'delivery', 'credit_card', 'paid', 17.97, 1.62, 3.60, 23.19, 'Leave at door', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Create order items
INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price, total_price, modifications, special_instructions) VALUES
('oi111111-1111-1111-1111-111111111111', 'o1111111-1111-1111-1111-111111111111', 'm1111111-1111-1111-1111-111111111111', 1, 14.99, 14.99, '{}', ''),
('oi111111-1111-1111-1111-111111111112', 'o1111111-1111-1111-1111-111111111111', 'm1111111-1111-1111-1111-111111111112', 1, 18.99, 18.99, '{}', 'Extra parmesan'),
('oi111111-1111-1111-1111-111111111113', 'o1111111-1111-1111-1111-111111111111', 'm1111111-1111-1111-1111-111111111113', 1, 16.99, 16.99, '{}', ''),
('oi222222-2222-2222-2222-222222222221', 'o2222222-2222-2222-2222-222222222221', 'm2222222-2222-2222-2222-222222222221', 1, 12.99, 12.99, '{}', ''),
('oi222222-2222-2222-2222-222222222222', 'o2222222-2222-2222-2222-222222222221', 'm2222222-2222-2222-2222-222222222222', 1, 16.99, 16.99, '{}', 'Extra spicy'),
('oi333333-3333-3333-3333-333333333331', 'o3333333-3333-3333-3333-333333333331', 'm3333333-3333-3333-3333-333333333331', 3, 3.99, 11.97, '{}', ''),
('oi333333-3333-3333-3333-333333333332', 'o3333333-3333-3333-3333-333333333331', 'm3333333-3333-3333-3333-333333333332', 1, 13.99, 13.99, '{}', 'No sour cream');

-- Create reviews
INSERT INTO reviews (id, restaurant_id, customer_id, order_id, platform, platform_review_id, reviewer_name, reviewer_avatar, title, content, rating, sentiment_score, sentiment_label, keywords, is_responded, response_text, response_date, is_featured, created_at, updated_at) VALUES
('r1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'cu111111-1111-1111-1111-111111111111', 'o1111111-1111-1111-1111-111111111111', 'google', 'google_123', 'John S.', '', 'Amazing Italian Food!', 'The pasta was perfectly cooked and the service was excellent. Will definitely come back!', 5, 0.95, 'positive', ARRAY['pasta', 'service', 'excellent'], true, 'Thank you so much for your kind words! We look forward to serving you again.', NOW() - INTERVAL '2 days', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
('r2222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'cu222222-2222-2222-2222-222222222221', 'o2222222-2222-2222-2222-222222222221', 'yelp', 'yelp_456', 'Michael C.', '', 'Great Dim Sum', 'Authentic flavors and fresh ingredients. The dumplings were outstanding!', 4, 0.85, 'positive', ARRAY['authentic', 'fresh', 'dumplings'], false, '', NULL, false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('r3333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'cu333333-3333-3333-3333-333333333331', 'o3333333-3333-3333-3333-333333333331', 'google', 'google_789', 'Carlos R.', '', 'Best Tacos in Town', 'Quick delivery and the carnitas tacos were incredible. Highly recommend!', 5, 0.92, 'positive', ARRAY['delivery', 'carnitas', 'recommend'], true, 'Gracias! We appreciate your support and are glad you enjoyed the tacos!', NOW() - INTERVAL '12 hours', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours');

-- Create AI insights
INSERT INTO ai_insights (id, restaurant_id, insight_type, title, description, data, confidence_score, is_actionable, is_read, created_at) VALUES
('ai111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'menu_optimization', 'Margherita Pizza High Demand', 'Your Margherita Pizza shows consistently high demand. Consider featuring it more prominently or creating variations.', '{"item_name": "Margherita Pizza", "order_frequency": 0.85, "profit_margin": 0.72, "customer_satisfaction": 4.8}', 0.92, true, false, NOW() - INTERVAL '1 day'),
('ai111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'customer_behavior', 'Peak Hours Analysis', 'Your busiest hours are 7-9 PM on weekends. Consider staffing adjustments and promotional offers during slower periods.', '{"peak_hours": ["19:00-21:00"], "peak_days": ["Friday", "Saturday", "Sunday"], "utilization_rate": 0.78}', 0.88, true, false, NOW() - INTERVAL '2 days'),
('ai222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'revenue_optimization', 'Lunch Revenue Opportunity', 'Lunch sales are 40% below dinner. Consider lunch specials or combo deals to increase midday revenue.', '{"lunch_revenue": 1250.50, "dinner_revenue": 2890.75, "opportunity": "lunch_specials"}', 0.85, true, false, NOW() - INTERVAL '1 day'),
('ai333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'marketing', 'Social Media Engagement', 'Your Instagram posts about tacos get 3x more engagement. Focus content strategy on taco varieties and preparation.', '{"platform": "instagram", "engagement_rate": 0.12, "top_content": "tacos", "recommendation": "focus_on_tacos"}', 0.79, true, false, NOW() - INTERVAL '3 days');

-- Create marketing campaigns
INSERT INTO marketing_campaigns (id, restaurant_id, name, type, status, target_audience, content, scheduled_date, sent_count, opened_count, clicked_count, conversion_count, budget, spent, created_at, updated_at) VALUES
('mc111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Weekend Special Promotion', 'email', 'completed', '{"segment": "regular_customers", "min_orders": 5}', '{"subject": "Weekend Special: 20% Off Pasta Dishes", "body": "Join us this weekend for our special pasta promotion!", "cta": "Order Now"}', NOW() - INTERVAL '1 week', 150, 89, 23, 8, 100.00, 75.50, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '1 week'),
('mc222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'Dim Sum Happy Hour', 'social_media', 'active', '{"age_range": "25-45", "interests": ["chinese_food", "happy_hour"]}', '{"platform": "facebook", "message": "Half-price dim sum every weekday 2-5 PM!", "image_url": "/images/dimsum-special.jpg"}', NOW() + INTERVAL '2 days', 0, 0, 0, 0, 200.00, 0.00, NOW() - INTERVAL '3 days', NOW()),
('mc333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'Taco Tuesday Launch', 'sms', 'scheduled', '{"segment": "all_customers"}', '{"message": "New Taco Tuesday deal! $2 tacos every Tuesday. Reply STOP to opt out."}', NOW() + INTERVAL '1 day', 0, 0, 0, 0, 50.00, 0.00, NOW() - INTERVAL '1 day', NOW());

-- Create analytics events
INSERT INTO analytics_events (id, restaurant_id, user_id, session_id, event_type, event_data, timestamp) VALUES
('ae111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'session_123', 'page_view', '{"page": "/dashboard", "duration": 45}', NOW() - INTERVAL '2 hours'),
('ae111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'session_123', 'menu_view', '{"item_id": "m1111111-1111-1111-1111-111111111113", "item_name": "Margherita Pizza"}', NOW() - INTERVAL '2 hours'),
('ae222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'session_456', 'order_placed', '{"order_id": "o2222222-2222-2222-2222-222222222221", "total": 38.68}', NOW() - INTERVAL '2 days'),
('ae333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'session_789', 'review_submitted', '{"review_id": "r3333333-3333-3333-3333-333333333331", "rating": 5}', NOW() - INTERVAL '1 day');

-- Create integration providers
INSERT INTO integration_providers (id, name, display_name, category, description, logo_url, api_available, demo_available, supported_countries, created_at, updated_at) VALUES
('ip111111-1111-1111-1111-111111111111', 'google_my_business', 'Google My Business', 'reviews', 'Manage your Google Business Profile and reviews', '/logos/google.png', true, true, ARRAY['US', 'CA', 'UK', 'AU'], NOW(), NOW()),
('ip222222-2222-2222-2222-222222222222', 'square_pos', 'Square POS', 'pos', 'Point of sale system integration', '/logos/square.png', true, true, ARRAY['US', 'CA', 'UK', 'AU'], NOW(), NOW()),
('ip333333-3333-3333-3333-333333333333', 'yelp_business', 'Yelp for Business', 'reviews', 'Manage Yelp reviews and business profile', '/logos/yelp.png', true, true, ARRAY['US', 'CA'], NOW(), NOW()),
('ip444444-4444-4444-4444-444444444444', 'mailchimp', 'Mailchimp', 'marketing', 'Email marketing and automation', '/logos/mailchimp.png', true, true, ARRAY['US', 'CA', 'UK', 'AU', 'EU'], NOW(), NOW()),
('ip555555-5555-5555-5555-555555555555', 'facebook_business', 'Facebook Business', 'social_media', 'Social media marketing and advertising', '/logos/facebook.png', true, true, ARRAY['US', 'CA', 'UK', 'AU', 'EU'], NOW(), NOW());

-- Create restaurant integrations
INSERT INTO restaurant_integrations (id, restaurant_id, provider_name, status, credentials, config, last_sync_at, created_at, updated_at) VALUES
('ri111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'google_my_business', 'connected', '{"access_token": "demo_token_123", "refresh_token": "demo_refresh_123"}', '{"auto_respond": true, "response_template": "Thank you for your review!"}', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 month', NOW()),
('ri111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'square_pos', 'connected', '{"application_id": "demo_app_123", "access_token": "demo_square_123"}', '{"sync_frequency": "hourly", "sync_menu": true}', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '1 month', NOW()),
('ri222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'yelp_business', 'connected', '{"api_key": "demo_yelp_123"}', '{"auto_respond": false}', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '3 weeks', NOW()),
('ri333333-3333-3333-3333-333333333331', '33333333-3333-3333-3333-333333333333', 'mailchimp', 'connected', '{"api_key": "demo_mailchimp_123"}', '{"list_id": "demo_list_123", "auto_segment": true}', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '2 weeks', NOW());

-- Create profiles for restaurant owners
INSERT INTO profiles (id, email, full_name, avatar_url, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'owner@bellavista.com', 'Marco Rossi', '/avatars/marco.jpg', NOW() - INTERVAL '1 year', NOW()),
('22222222-2222-2222-2222-222222222222', 'owner@dragonpalace.com', 'David Chen', '/avatars/david.jpg', NOW() - INTERVAL '1 year', NOW()),
('33333333-3333-3333-3333-333333333333', 'owner@tacolibre.com', 'Maria Garcia', '/avatars/maria.jpg', NOW() - INTERVAL '1 year', NOW()),
('44444444-4444-4444-4444-444444444444', 'owner@sakurasushi.com', 'Hiroshi Tanaka', '/avatars/hiroshi.jpg', NOW() - INTERVAL '1 year', NOW()),
('55555555-5555-5555-5555-555555555555', 'owner@burgerjoint.com', 'Jake Miller', '/avatars/jake.jpg', NOW() - INTERVAL '1 year', NOW()),
('66666666-6666-6666-6666-666666666666', 'owner@medbreeze.com', 'Sofia Papadopoulos', '/avatars/sofia.jpg', NOW() - INTERVAL '1 year', NOW()),
('77777777-7777-7777-7777-777777777777', 'owner@spiceroute.com', 'Raj Patel', '/avatars/raj.jpg', NOW() - INTERVAL '1 year', NOW()),
('88888888-8888-8888-8888-888888888888', 'owner@petitbistro.com', 'Pierre Dubois', '/avatars/pierre.jpg', NOW() - INTERVAL '1 year', NOW()),
('99999999-9999-9999-9999-999999999999', 'owner@bbqsmokehouse.com', 'Bobby Johnson', '/avatars/bobby.jpg', NOW() - INTERVAL '1 year', NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'owner@greengarden.com', 'Emma Thompson', '/avatars/emma.jpg', NOW() - INTERVAL '1 year', NOW());

COMMIT;
