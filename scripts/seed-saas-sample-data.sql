-- =====================================================
-- SEED DATA FOR SAAS MULTI-TENANT RESTAURANT PLATFORM
-- Multiple sample restaurants with different patterns
-- =====================================================

-- =====================================================
-- RESTAURANT 1: Bella Italiana (Established, High-End)
-- =====================================================
INSERT INTO restaurants (
    id,
    restaurant_name,
    business_type,
    cuisine_type,
    establishment_year,
    chain_or_independent,
    address,
    city,
    state,
    zip_code,
    country,
    phone_number,
    email,
    website,
    seating_capacity,
    private_dining_capacity,
    dress_code,
    price_range,
    average_meal_cost,
    dining_features,
    dietary_accommodations,
    ambiance_tags,
    brand_story,
    signature_dishes,
    facebook_handle,
    instagram_handle,
    chef_name,
    chef_bio,
    special_services,
    sustainability_practices,
    awards_certifications,
    technology_features,
    online_ordering,
    loyalty_program,
    loyalty_program_name,
    subscription_tier,
    subscription_status,
    onboarding_status,
    onboarding_completed_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Bella Italiana',
    'restaurant',
    ARRAY['Italian', 'Mediterranean'],
    '2018',
    'independent',
    '123 Main Street',
    'San Francisco',
    'CA',
    '94102',
    'United States',
    '(415) 555-0123',
    'info@bellaitaliana.com',
    'https://bellaitaliana.com',
    '65',
    '20',
    'casual',
    '$$ ($25-45)',
    '$35 per person',
    ARRAY['outdoor_seating', 'private_dining', 'bar_seating'],
    ARRAY['vegetarian', 'vegan', 'gluten_free'],
    ARRAY['romantic', 'family_friendly', 'cozy'],
    'Authentic Italian cuisine in the heart of San Francisco, featuring traditional recipes passed down through generations.',
    ARRAY['Wood-fired Neapolitan Pizza', 'House-made Pasta', 'Seasonal Risotto'],
    'BellaItalianaRestaurant',
    '@bellaitaliana_sf',
    'Chef Marco Rossi',
    'Chef Marco brings over 15 years of culinary experience from Italy and New York.',
    ARRAY['private_events', 'catering', 'wine_tastings'],
    ARRAY['locally_sourced', 'organic_ingredients'],
    ARRAY['Best Italian Restaurant 2023', 'Wine Spectator Award'],
    ARRAY['online_ordering', 'qr_menus'],
    true,
    true,
    'Bella Rewards',
    'pro',
    'active',
    'completed',
    NOW() - INTERVAL '60 days'
);

-- =====================================================
-- RESTAURANT 2: Taco Libre (Fast-Casual, High Volume)
-- =====================================================
INSERT INTO restaurants (
    id,
    restaurant_name,
    business_type,
    cuisine_type,
    establishment_year,
    chain_or_independent,
    address,
    city,
    state,
    zip_code,
    country,
    phone_number,
    email,
    website,
    seating_capacity,
    dress_code,
    price_range,
    average_meal_cost,
    dining_features,
    dietary_accommodations,
    ambiance_tags,
    brand_story,
    signature_dishes,
    instagram_handle,
    tiktok_handle,
    delivery_options,
    technology_features,
    online_ordering,
    subscription_tier,
    subscription_status,
    onboarding_status
) VALUES (
    '660e8400-e29b-41d4-a716-446655440001',
    'Taco Libre',
    'restaurant',
    ARRAY['Mexican', 'Tex-Mex'],
    '2021',
    'independent',
    '456 University Ave',
    'Austin',
    'TX',
    '78701',
    'United States',
    '(512) 555-0456',
    'hello@tacolibre.com',
    'https://tacolibre.com',
    '40',
    'casual',
    '$ ($8-18)',
    '$12 per person',
    ARRAY['outdoor_seating', 'counter_seating'],
    ARRAY['vegetarian', 'vegan'],
    ARRAY['casual', 'lively', 'trendy'],
    'Fresh, authentic Mexican street food with a modern twist. Fast-casual dining for the busy Austin lifestyle.',
    ARRAY['Street Tacos', 'Loaded Nachos', 'Fresh Guacamole'],
    '@tacolibre_atx',
    '@tacolibre_food',
    ARRAY['uber_eats', 'doordash', 'grubhub'],
    ARRAY['online_ordering', 'mobile_app', 'qr_menus'],
    true,
    'basic',
    'trial',
    'in_progress'
);

-- =====================================================
-- RESTAURANT 3: The Garden Cafe (Small, Organic)
-- =====================================================
INSERT INTO restaurants (
    id,
    restaurant_name,
    business_type,
    cuisine_type,
    establishment_year,
    chain_or_independent,
    address,
    city,
    state,
    zip_code,
    country,
    phone_number,
    email,
    seating_capacity,
    dress_code,
    price_range,
    average_meal_cost,
    dining_features,
    dietary_accommodations,
    ambiance_tags,
    brand_story,
    sustainability_practices,
    subscription_tier,
    subscription_status,
    onboarding_status
) VALUES (
    '770e8400-e29b-41d4-a716-446655440002',
    'The Garden Cafe',
    'cafe',
    ARRAY['American', 'Healthy'],
    '2020',
    'independent',
    '789 Green Street',
    'Portland',
    'OR',
    '97201',
    'United States',
    '(503) 555-0789',
    'info@gardencafe.com',
    '25',
    'casual',
    '$$ ($12-25)',
    '$18 per person',
    ARRAY['outdoor_seating'],
    ARRAY['vegetarian', 'vegan', 'gluten_free', 'organic'],
    ARRAY['cozy', 'healthy', 'eco_friendly'],
    'Farm-to-table cafe focusing on organic, locally-sourced ingredients and sustainable practices.',
    ARRAY['locally_sourced', 'organic_ingredients', 'compostable_packaging', 'solar_powered'],
    'basic',
    'active',
    'pending'
);

-- =====================================================
-- USERS FOR EACH RESTAURANT
-- =====================================================

-- Bella Italiana Users
INSERT INTO users (id, restaurant_id, email, password_hash, email_verified, profile, role, last_login_at, login_count, onboarding_completed) VALUES
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'marco@bellaitaliana.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqrxe', true, '{"first_name": "Marco", "last_name": "Rossi", "title": "Owner & Head Chef"}'::jsonb, 'owner', NOW() - INTERVAL '2 hours', 156, true),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'sofia@bellaitaliana.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqrxe', true, '{"first_name": "Sofia", "last_name": "Martinez", "title": "General Manager"}'::jsonb, 'manager', NOW() - INTERVAL '1 day', 89, true);

-- Taco Libre Users
INSERT INTO users (id, restaurant_id, email, password_hash, email_verified, profile, role, last_login_at, login_count, onboarding_completed) VALUES
('aa0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', 'carlos@tacolibre.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqrxe', true, '{"first_name": "Carlos", "last_name": "Rodriguez", "title": "Owner"}'::jsonb, 'owner', NOW() - INTERVAL '6 hours', 45, false);

-- Garden Cafe Users
INSERT INTO users (id, restaurant_id, email, password_hash, email_verified, profile, role, last_login_at, login_count, onboarding_completed) VALUES
('bb0e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', 'sarah@gardencafe.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqrxe', true, '{"first_name": "Sarah", "last_name": "Green", "title": "Owner"}'::jsonb, 'owner', NOW() - INTERVAL '3 days', 12, false);

-- =====================================================
-- CUSTOMER FREQUENCY CONFIGURATIONS
-- Different patterns for each restaurant type
-- =====================================================

-- Bella Italiana: Upscale dining, less frequent visits
INSERT INTO restaurant_customer_frequency_config (
    restaurant_id,
    avg_days_per_visit,
    median_days_per_visit,
    total_customers_analyzed,
    frequency_thresholds,
    calculation_status,
    last_calculated_at,
    data_quality
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    21.5, -- Higher-end restaurant, less frequent visits
    18.0,
    1250,
    '{
        "new_customer_days": 43,
        "active_max_days": 43,
        "at_risk_min_days": 43,
        "at_risk_max_days": 65,
        "churned_min_days": 65
    }'::jsonb,
    'completed',
    NOW() - INTERVAL '5 days',
    '{
        "sufficient_data": true,
        "confidence_score": 0.92,
        "data_points": 1250,
        "date_range_days": 365,
        "warnings": []
    }'::jsonb
);

-- Taco Libre: Fast-casual, frequent visits
INSERT INTO restaurant_customer_frequency_config (
    restaurant_id,
    avg_days_per_visit,
    median_days_per_visit,
    total_customers_analyzed,
    frequency_thresholds,
    calculation_status,
    last_calculated_at,
    data_quality
) VALUES (
    '660e8400-e29b-41d4-a716-446655440001',
    8.5, -- Fast-casual, more frequent visits
    7.0,
    2100,
    '{
        "new_customer_days": 17,
        "active_max_days": 17,
        "at_risk_min_days": 17,
        "at_risk_max_days": 26,
        "churned_min_days": 26
    }'::jsonb,
    'completed',
    NOW() - INTERVAL '2 days',
    '{
        "sufficient_data": true,
        "confidence_score": 0.88,
        "data_points": 2100,
        "date_range_days": 180,
        "warnings": []
    }'::jsonb
);

-- Garden Cafe: Small cafe, moderate frequency
INSERT INTO restaurant_customer_frequency_config (
    restaurant_id,
    avg_days_per_visit,
    total_customers_analyzed,
    calculation_status,
    data_quality
) VALUES (
    '770e8400-e29b-41d4-a716-446655440002',
    14.0, -- Moderate frequency
    150,
    'pending',
    '{
        "sufficient_data": false,
        "confidence_score": 0.45,
        "data_points": 150,
        "date_range_days": 90,
        "warnings": ["Insufficient data for reliable segmentation"]
    }'::jsonb
);

-- =====================================================
-- CUSTOMER SEGMENTS FOR EACH RESTAURANT
-- =====================================================

-- Bella Italiana Segments (Upscale dining patterns)
INSERT INTO customer_segments (restaurant_id, segment_name, segment_type, display_name, description, criteria, customer_count, percentage_of_total, avg_order_value, marketing_priority, default_campaign_types, is_system_segment) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'new', 'frequency', 'New Customers', 'Customers within 43 days of first visit', '{"days_since_first_order": {"max": 43}}'::jsonb, 125, 10.0, 42.50, 2, ARRAY['welcome_series', 'second_visit_incentive'], true),
('550e8400-e29b-41d4-a716-446655440000', 'active', 'frequency', 'Active Customers', 'Regular customers who visited within 43 days', '{"days_since_last_order": {"max": 43}}'::jsonb, 750, 60.0, 38.75, 3, ARRAY['loyalty_rewards', 'new_menu_items'], true),
('550e8400-e29b-41d4-a716-446655440000', 'at_risk', 'frequency', 'At-Risk Customers', 'Haven\'t visited in 43-65 days', '{"days_since_last_order": {"min": 43, "max": 65}}'::jsonb, 250, 20.0, 35.20, 1, ARRAY['win_back', 'special_offers'], true),
('550e8400-e29b-41d4-a716-446655440000', 'churned', 'frequency', 'Churned Customers', 'Haven\'t visited in over 65 days', '{"days_since_last_order": {"min": 65}}'::jsonb, 125, 10.0, 32.10, 4, ARRAY['reactivation', 'major_discounts'], true);

-- Taco Libre Segments (Fast-casual patterns)
INSERT INTO customer_segments (restaurant_id, segment_name, segment_type, display_name, description, criteria, customer_count, percentage_of_total, avg_order_value, marketing_priority, default_campaign_types, is_system_segment) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'new', 'frequency', 'New Customers', 'Customers within 17 days of first visit', '{"days_since_first_order": {"max": 17}}'::jsonb, 420, 20.0, 14.25, 2, ARRAY['welcome_series', 'app_download'], true),
('660e8400-e29b-41d4-a716-446655440001', 'active', 'frequency', 'Active Customers', 'Regular customers who visited within 17 days', '{"days_since_last_order": {"max": 17}}'::jsonb, 1260, 60.0, 12.80, 3, ARRAY['loyalty_program', 'daily_specials'], true),
('660e8400-e29b-41d4-a716-446655440001', 'at_risk', 'frequency', 'At-Risk Customers', 'Haven\'t visited in 17-26 days', '{"days_since_last_order": {"min": 17, "max": 26}}'::jsonb, 315, 15.0, 11.90, 1, ARRAY['comeback_offer', 'limited_time_deals'], true),
('660e8400-e29b-41d4-a716-446655440001', 'churned', 'frequency', 'Churned Customers', 'Haven\'t visited in over 26 days', '{"days_since_last_order": {"min": 26}}'::jsonb, 105, 5.0, 10.50, 4, ARRAY['reactivation', 'free_item_offer'], true);

-- =====================================================
-- SETUP PROGRESS TRACKING
-- =====================================================

-- Bella Italiana: Completed setup
INSERT INTO setup_sections_progress (restaurant_id, user_id, section_id, section_name, status, progress_percentage, total_fields, completed_fields, required_fields, completed_required_fields, completed_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440003', 'restaurant-info', 'Restaurant Profile', 'completed', 100, 45, 45, 12, 12, NOW() - INTERVAL '60 days'),
('550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440003', 'menu-setup', 'Menu Setup', 'completed', 100, 8, 8, 3, 3, NOW() - INTERVAL '58 days'),
('550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440003', 'reviews-setup', 'Reviews & Insights', 'completed', 100, 6, 6, 2, 2, NOW() - INTERVAL '55 days'),
('550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440003', 'orders-data', 'Orders & Sales Data', 'completed', 100, 6, 6, 1, 1, NOW() - INTERVAL '50 days'),
('550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440003', 'customer-data', 'Customer Data', 'completed', 100, 6, 6, 3, 3, NOW() - INTERVAL '45 days'),
('550e8400-e29b-41d4-a716-446655440000', '880e8400-e29b-41d4-a716-446655440003', 'channel-integrations', 'Marketing Campaigns', 'completed', 100, 6, 6, 4, 4, NOW() - INTERVAL '40 days');

-- Taco Libre: Partial setup
INSERT INTO setup_sections_progress (restaurant_id, user_id, section_id, section_name, status, progress_percentage, total_fields, completed_fields, required_fields, completed_required_fields, started_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440005', 'restaurant-info', 'Restaurant Profile', 'completed', 100, 45, 32, 12, 12, NOW() - INTERVAL '10 days'),
('660e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440005', 'menu-setup', 'Menu Setup', 'in_progress', 60, 8, 5, 3, 2, NOW() - INTERVAL '8 days'),
('660e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440005', 'reviews-setup', 'Reviews & Insights', 'not_started', 0, 6, 0, 2, 0, NULL);

-- Garden Cafe: Just started
INSERT INTO setup_sections_progress (restaurant_id, user_id, section_id, section_name, status, progress_percentage, total_fields, completed_fields, required_fields, completed_required_fields, started_at) VALUES
('770e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440006', 'restaurant-info', 'Restaurant Profile', 'in_progress', 25, 45, 8, 12, 3, NOW() - INTERVAL '2 days');

-- =====================================================
-- UPDATE RESTAURANT PERFORMANCE METRICS
-- =====================================================

-- Bella Italiana: Established restaurant metrics
UPDATE restaurants SET performance_metrics = '{
    "total_customers": 1250,
    "total_orders": 12847,
    "total_revenue": 495000.00,
    "avg_rating": 4.3,
    "total_reviews": 1247,
    "last_30_days": {
        "revenue": 42500.00,
        "orders": 1150,
        "new_customers": 45,
        "avg_rating": 4.4
    }
}'::jsonb WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Taco Libre: High-volume, lower-price metrics
UPDATE restaurants SET performance_metrics = '{
    "total_customers": 2100,
    "total_orders": 18500,
    "total_revenue": 237000.00,
    "avg_rating": 4.1,
    "total_reviews": 890,
    "last_30_days": {
        "revenue": 28500.00,
        "orders": 2250,
        "new_customers": 125,
        "avg_rating": 4.2
    }
}'::jsonb WHERE id = '660e8400-e29b-41d4-a716-446655440001';

-- Garden Cafe: Small cafe metrics
UPDATE restaurants SET performance_metrics = '{
    "total_customers": 150,
    "total_orders": 850,
    "total_revenue": 15300.00,
    "avg_rating": 4.6,
    "total_reviews": 67,
    "last_30_days": {
        "revenue": 2100.00,
        "orders": 115,
        "new_customers": 8,
        "avg_rating": 4.7
    }
}'::jsonb WHERE id = '770e8400-e29b-41d4-a716-446655440002';
