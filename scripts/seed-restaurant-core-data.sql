-- =====================================================
-- SEED DATA FOR RESTAURANT CORE SCHEMA
-- =====================================================

-- Insert sample restaurant
INSERT INTO restaurants (
    id,
    name,
    slug,
    description,
    business_type,
    cuisine_types,
    establishment_year,
    chain_or_independent,
    address,
    city,
    state,
    country,
    postal_code,
    phone,
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
    social_media,
    brand_colors,
    special_services,
    sustainability_practices,
    awards_certifications,
    technology_features,
    online_ordering,
    loyalty_program,
    loyalty_program_name,
    subscription_tier,
    onboarding_status,
    onboarding_completed_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Bella Italiana',
    'bella-italiana',
    'Authentic Italian cuisine in the heart of downtown, featuring traditional recipes passed down through generations.',
    'restaurant',
    ARRAY['Italian', 'Mediterranean'],
    2018,
    'independent',
    '123 Main Street',
    'Downtown',
    'CA',
    'United States',
    '12345',
    '(555) 123-4567',
    'info@bellaitaliana.com',
    'https://bellaitaliana.com',
    65,
    20,
    'casual',
    '$$ ($15-30)',
    25.00,
    ARRAY['outdoor_seating', 'private_dining', 'bar_seating'],
    ARRAY['vegetarian', 'vegan', 'gluten_free'],
    ARRAY['romantic', 'family_friendly', 'cozy'],
    'Our restaurant was founded with a passion for bringing authentic flavors and exceptional dining experiences to our community. We believe in using fresh, locally-sourced ingredients to create memorable meals that bring people together.',
    ARRAY['Wood-fired Neapolitan Pizza', 'House-made Pasta', 'Seasonal Risotto', 'Traditional Tiramisu'],
    '{
        "facebook": "BellaItalianaRestaurant",
        "instagram": "@bellaitaliana_restaurant",
        "twitter": "@bellaitaliana",
        "tiktok": "@bellaitaliana_food"
    }'::jsonb,
    '{
        "primary": "#8B4513",
        "secondary": "#DAA520",
        "accent": "#228B22"
    }'::jsonb,
    ARRAY['private_events', 'catering', 'wine_tastings'],
    ARRAY['locally_sourced', 'organic_ingredients', 'compostable_packaging'],
    ARRAY['Best Italian Restaurant 2023', 'OpenTable Diners Choice', 'Wine Spectator Award'],
    ARRAY['online_ordering', 'qr_menus'],
    true,
    true,
    'Bella Rewards',
    'pro',
    'completed',
    NOW() - INTERVAL '30 days'
);

-- Insert restaurant owner user
INSERT INTO users (
    id,
    restaurant_id,
    email,
    password_hash,
    email_verified,
    email_verified_at,
    profile,
    role,
    permissions,
    preferences,
    last_login_at,
    login_count,
    is_active
) VALUES (
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'owner@bellaitaliana.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqrxe', -- hashed 'password123'
    true,
    NOW() - INTERVAL '30 days',
    '{
        "first_name": "Marco",
        "last_name": "Rossi",
        "avatar_url": null,
        "phone": "(555) 123-4567",
        "title": "Owner & Head Chef",
        "department": "Management"
    }'::jsonb,
    'owner',
    '{
        "dashboard": {"read": true, "write": true},
        "menu": {"read": true, "write": true},
        "customers": {"read": true, "write": true},
        "reviews": {"read": true, "write": true},
        "marketing": {"read": true, "write": true},
        "analytics": {"read": true, "write": true},
        "settings": {"read": true, "write": true}
    }'::jsonb,
    '{
        "language": "en",
        "timezone": "America/Los_Angeles",
        "notifications": {
            "email": true,
            "push": true,
            "sms": true
        },
        "dashboard_layout": "advanced",
        "theme": "light"
    }'::jsonb,
    NOW() - INTERVAL '1 day',
    45,
    true
);

-- Insert manager user
INSERT INTO users (
    id,
    restaurant_id,
    email,
    password_hash,
    email_verified,
    profile,
    role,
    permissions,
    last_login_at,
    login_count
) VALUES (
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'manager@bellaitaliana.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqrxe',
    true,
    '{
        "first_name": "Sofia",
        "last_name": "Martinez",
        "phone": "(555) 123-4568",
        "title": "General Manager",
        "department": "Operations"
    }'::jsonb,
    'manager',
    '{
        "dashboard": {"read": true, "write": true},
        "menu": {"read": true, "write": true},
        "customers": {"read": true, "write": true},
        "reviews": {"read": true, "write": true},
        "marketing": {"read": true, "write": false},
        "analytics": {"read": true, "write": false},
        "settings": {"read": true, "write": false}
    }'::jsonb,
    NOW() - INTERVAL '2 hours',
    23
);

-- Insert default customer frequency segments
INSERT INTO customer_frequency_segments (
    restaurant_id,
    segment_name,
    segment_type,
    frequency_rules,
    current_thresholds,
    marketing_priority,
    default_campaign_types
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'new',
    'frequency',
    '{
        "base_multiplier": 1.0,
        "new_threshold": 2.0,
        "description": "Customers within 2x avg days since first order"
    }'::jsonb,
    '{
        "avg_days_per_visit": 14,
        "new_days": 28,
        "description": "First-time customers or within 28 days of first visit"
    }'::jsonb,
    2,
    ARRAY['welcome_series', 'onboarding', 'second_visit_incentive']
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'active',
    'frequency',
    '{
        "base_multiplier": 1.0,
        "active_threshold": 2.0,
        "description": "Customers with last order within 2x avg days"
    }'::jsonb,
    '{
        "avg_days_per_visit": 14,
        "active_max_days": 28,
        "description": "Regular customers who visited within 28 days"
    }'::jsonb,
    3,
    ARRAY['loyalty_rewards', 'new_menu_items', 'special_events']
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'at_risk',
    'frequency',
    '{
        "base_multiplier": 1.0,
        "at_risk_min": 2.0,
        "at_risk_max": 3.0,
        "description": "Customers with last order between 2x-3x avg days"
    }'::jsonb,
    '{
        "avg_days_per_visit": 14,
        "at_risk_min_days": 28,
        "at_risk_max_days": 42,
        "description": "Customers who haven\'t visited in 28-42 days"
    }'::jsonb,
    1,
    ARRAY['win_back', 'special_offers', 'personal_outreach']
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'churned',
    'frequency',
    '{
        "base_multiplier": 1.0,
        "churned_threshold": 3.0,
        "description": "Customers with last order >3x avg days"
    }'::jsonb,
    '{
        "avg_days_per_visit": 14,
        "churned_min_days": 42,
        "description": "Customers who haven\'t visited in over 42 days"
    }'::jsonb,
    4,
    ARRAY['reactivation', 'survey_feedback', 'major_discounts']
);

-- Insert marketing attribution configuration
INSERT INTO marketing_attribution (
    restaurant_id,
    attribution_model,
    attribution_windows,
    utm_sources,
    utm_mediums,
    utm_campaigns,
    attribution_rules
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'multi_touch',
    '{
        "click_window_days": 7,
        "view_window_days": 1,
        "email_window_days": 30,
        "social_window_days": 7,
        "direct_window_days": 1
    }'::jsonb,
    ARRAY['facebook', 'instagram', 'google', 'email', 'yelp', 'direct'],
    ARRAY['social', 'email', 'cpc', 'organic', 'referral', 'direct'],
    ARRAY['summer_menu_2024', 'happy_hour_promo', 'new_customer_welcome', 'loyalty_rewards'],
    '{
        "direct_visit": {"weight": 1.0, "priority": 1},
        "promo_code": {"weight": 1.0, "priority": 1},
        "utm_campaign": {"weight": 0.8, "priority": 2},
        "social_referral": {"weight": 0.6, "priority": 3},
        "organic_search": {"weight": 0.4, "priority": 4},
        "email_campaign": {"weight": 0.7, "priority": 2}
    }'::jsonb
);

-- Insert data retention policy
INSERT INTO data_retention_policies (
    restaurant_id,
    retention_rules,
    gdpr_compliance,
    ccpa_compliance,
    auto_cleanup_enabled
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '{
        "orders": {
            "retention_years": 3,
            "archive_after_months": 12,
            "delete_after_years": 7,
            "reason": "Tax compliance and trend analysis"
        },
        "customers": {
            "retention_indefinite": true,
            "anonymize_after_years": 5,
            "delete_inactive_after_years": 7,
            "reason": "Customer relationship management"
        },
        "reviews": {
            "retention_indefinite": true,
            "archive_after_years": 2,
            "reason": "Long-term reputation tracking"
        },
        "marketing_activities": {
            "retention_months": 12,
            "archive_after_months": 6,
            "reason": "Campaign performance analysis"
        },
        "analytics_raw": {
            "retention_months": 6,
            "aggregate_after_days": 30,
            "reason": "Performance optimization"
        },
        "analytics_aggregated": {
            "retention_indefinite": true,
            "reason": "Historical trend analysis"
        },
        "event_logs": {
            "retention_months": 6,
            "delete_after_months": 12,
            "reason": "Debugging and audit trails"
        }
    }'::jsonb,
    true,
    true,
    true
);

-- Update restaurant performance metrics
UPDATE restaurants 
SET performance_metrics = '{
    "total_customers": 1250,
    "total_orders": 12847,
    "total_revenue": 284750.00,
    "avg_rating": 4.3,
    "total_reviews": 1247,
    "last_updated": "2024-01-15T10:30:00Z"
}'::jsonb
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
