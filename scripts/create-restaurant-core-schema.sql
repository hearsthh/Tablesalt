-- =====================================================
-- RESTAURANT CORE SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. RESTAURANTS (Core Multi-tenant Entity)
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- URL-friendly identifier
    description TEXT,
    business_type VARCHAR(50) DEFAULT 'restaurant', -- restaurant, cafe, bar, food_truck
    cuisine_types TEXT[] DEFAULT '{}', -- Array of cuisine types
    establishment_year INTEGER,
    chain_or_independent VARCHAR(20) DEFAULT 'independent',
    
    -- Location Data
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    coordinates POINT, -- PostGIS point for lat/lng
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Contact Information
    phone VARCHAR(20),
    email VARCHAR(255),
    website TEXT,
    
    -- Business Hours (JSONB for flexibility)
    business_hours JSONB DEFAULT '{
        "monday": {"open": true, "openTime": "09:00", "closeTime": "22:00"},
        "tuesday": {"open": true, "openTime": "09:00", "closeTime": "22:00"},
        "wednesday": {"open": true, "openTime": "09:00", "closeTime": "22:00"},
        "thursday": {"open": true, "openTime": "09:00", "closeTime": "22:00"},
        "friday": {"open": true, "openTime": "09:00", "closeTime": "23:00"},
        "saturday": {"open": true, "openTime": "09:00", "closeTime": "23:00"},
        "sunday": {"open": true, "openTime": "10:00", "closeTime": "21:00"}
    }'::jsonb,
    
    holiday_hours TEXT, -- Special holiday hours description
    
    -- Business Details
    seating_capacity INTEGER,
    private_dining_capacity INTEGER,
    dress_code VARCHAR(50),
    price_range VARCHAR(20), -- $, $$, $$$, $$$$
    average_meal_cost DECIMAL(10,2),
    
    -- Features and Amenities
    dining_features TEXT[] DEFAULT '{}', -- outdoor_seating, private_dining, bar_seating
    dietary_accommodations TEXT[] DEFAULT '{}', -- vegetarian, vegan, gluten_free
    ambiance_tags TEXT[] DEFAULT '{}', -- romantic, family_friendly, casual
    music_entertainment TEXT[] DEFAULT '{}', -- live_music, dj, sports_tv
    parking_options TEXT[] DEFAULT '{}', -- street, lot, valet
    payment_methods TEXT[] DEFAULT '{}', -- cash, cards, mobile_payments
    
    -- Brand and Marketing
    brand_story TEXT,
    signature_dishes TEXT[] DEFAULT '{}',
    chef_specialties TEXT,
    wine_beer_program TEXT,
    happy_hour_details TEXT,
    community_involvement TEXT,
    
    -- Social Media Handles
    social_media JSONB DEFAULT '{
        "facebook": null,
        "instagram": null,
        "twitter": null,
        "tiktok": null,
        "linkedin": null,
        "youtube": null
    }'::jsonb,
    
    -- Brand Assets
    logo_url TEXT,
    brand_colors JSONB DEFAULT '{
        "primary": "#000000",
        "secondary": "#666666",
        "accent": "#ff6b35"
    }'::jsonb,
    
    -- Services
    special_services TEXT[] DEFAULT '{}', -- catering, private_events, wine_tastings
    catering_services TEXT[] DEFAULT '{}', -- corporate, event, drop_off
    delivery_options TEXT[] DEFAULT '{}', -- doordash, uber_eats, in_house
    reservation_policy TEXT,
    cancellation_policy TEXT,
    
    -- Quality and Recognition
    sustainability_practices TEXT[] DEFAULT '{}',
    awards_certifications TEXT[] DEFAULT '{}',
    health_safety_measures TEXT[] DEFAULT '{}',
    accessibility_features TEXT[] DEFAULT '{}',
    
    -- Technology Features
    technology_features TEXT[] DEFAULT '{}', -- online_ordering, mobile_app, qr_menus
    online_ordering BOOLEAN DEFAULT false,
    mobile_app BOOLEAN DEFAULT false,
    loyalty_program BOOLEAN DEFAULT false,
    loyalty_program_name VARCHAR(100),
    
    -- Platform Settings
    subscription_tier VARCHAR(20) DEFAULT 'basic', -- basic, pro, enterprise
    subscription_status VARCHAR(20) DEFAULT 'active', -- active, suspended, cancelled
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Onboarding and Setup
    onboarding_status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed
    onboarding_completed_at TIMESTAMP WITH TIME ZONE,
    setup_progress JSONB DEFAULT '{
        "restaurant_info": false,
        "menu_setup": false,
        "reviews_setup": false,
        "orders_data": false,
        "customer_data": false,
        "channel_integrations": false
    }'::jsonb,
    
    -- Platform Configuration
    settings JSONB DEFAULT '{
        "notifications": {
            "email": true,
            "sms": false,
            "push": true
        },
        "integrations": {
            "pos_systems": [],
            "review_platforms": [],
            "social_media": [],
            "delivery_apps": []
        },
        "ai_features": {
            "menu_optimization": true,
            "review_responses": true,
            "customer_segmentation": true,
            "marketing_automation": true
        },
        "data_retention": {
            "orders_years": 3,
            "reviews_indefinite": true,
            "analytics_months": 12
        }
    }'::jsonb,
    
    -- Analytics and Performance
    performance_metrics JSONB DEFAULT '{
        "total_customers": 0,
        "total_orders": 0,
        "total_revenue": 0,
        "avg_rating": 0,
        "total_reviews": 0
    }'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. USERS (Restaurant Staff Access Management)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Profile Information
    profile JSONB DEFAULT '{
        "first_name": null,
        "last_name": null,
        "avatar_url": null,
        "phone": null,
        "title": null,
        "department": null
    }'::jsonb,
    
    -- Access Control
    role VARCHAR(20) NOT NULL DEFAULT 'staff', -- owner, manager, staff, viewer
    permissions JSONB DEFAULT '{
        "dashboard": {"read": true, "write": false},
        "menu": {"read": true, "write": false},
        "customers": {"read": true, "write": false},
        "reviews": {"read": true, "write": false},
        "marketing": {"read": false, "write": false},
        "analytics": {"read": true, "write": false},
        "settings": {"read": false, "write": false}
    }'::jsonb,
    
    -- User Preferences
    preferences JSONB DEFAULT '{
        "language": "en",
        "timezone": "UTC",
        "notifications": {
            "email": true,
            "push": true,
            "sms": false
        },
        "dashboard_layout": "default",
        "theme": "light"
    }'::jsonb,
    
    -- Activity Tracking
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Security
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CUSTOMER FREQUENCY SEGMENTS (Dynamic Segmentation)
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_frequency_segments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Segment Configuration
    segment_name VARCHAR(50) NOT NULL, -- new, active, at_risk, churned
    segment_type VARCHAR(20) DEFAULT 'frequency', -- frequency, rfm, behavioral
    
    -- Dynamic Frequency Logic (based on avg_days_per_visit)
    frequency_rules JSONB DEFAULT '{
        "base_multiplier": 1.0,
        "new_threshold": 2.0,
        "active_threshold": 2.0,
        "at_risk_min": 2.0,
        "at_risk_max": 3.0,
        "churned_threshold": 3.0
    }'::jsonb,
    
    -- Calculated Thresholds (updated based on restaurant data)
    current_thresholds JSONB DEFAULT '{
        "avg_days_per_visit": 14,
        "new_days": 28,
        "active_max_days": 28,
        "at_risk_min_days": 28,
        "at_risk_max_days": 42,
        "churned_min_days": 42
    }'::jsonb,
    
    -- Segment Statistics
    customer_count INTEGER DEFAULT 0,
    percentage_of_total DECIMAL(5,2) DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    avg_visit_frequency DECIMAL(5,2) DEFAULT 0,
    
    -- Marketing Configuration
    marketing_priority INTEGER DEFAULT 1, -- 1=highest, 5=lowest
    default_campaign_types TEXT[] DEFAULT '{}', -- retention, acquisition, reactivation
    
    -- Automation Rules
    auto_update BOOLEAN DEFAULT true,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_calculation_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, segment_name)
);

-- =====================================================
-- 4. MARKETING ATTRIBUTION TRACKING
-- =====================================================
CREATE TABLE IF NOT EXISTS marketing_attribution (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Attribution Configuration
    attribution_model VARCHAR(20) DEFAULT 'last_touch', -- first_touch, last_touch, multi_touch
    attribution_windows JSONB DEFAULT '{
        "click_window_days": 7,
        "view_window_days": 1,
        "email_window_days": 30,
        "social_window_days": 7,
        "direct_window_days": 1
    }'::jsonb,
    
    -- UTM Parameter Tracking
    utm_sources TEXT[] DEFAULT '{}', -- facebook, instagram, google, email
    utm_mediums TEXT[] DEFAULT '{}', -- social, email, cpc, organic
    utm_campaigns TEXT[] DEFAULT '{}', -- summer_promo, new_menu_launch
    
    -- Promo Code Tracking
    active_promo_codes JSONB DEFAULT '[]'::jsonb, -- [{code, campaign_id, discount, expires_at}]
    
    -- Attribution Rules
    attribution_rules JSONB DEFAULT '{
        "direct_visit": {"weight": 1.0, "priority": 1},
        "promo_code": {"weight": 1.0, "priority": 1},
        "utm_campaign": {"weight": 0.8, "priority": 2},
        "social_referral": {"weight": 0.6, "priority": 3},
        "organic_search": {"weight": 0.4, "priority": 4}
    }'::jsonb,
    
    -- Performance Tracking
    total_attributed_orders INTEGER DEFAULT 0,
    total_attributed_revenue DECIMAL(12,2) DEFAULT 0,
    attribution_accuracy_score DECIMAL(5,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. DATA RETENTION POLICIES
-- =====================================================
CREATE TABLE IF NOT EXISTS data_retention_policies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Retention Rules by Data Type
    retention_rules JSONB DEFAULT '{
        "orders": {
            "retention_years": 3,
            "archive_after_months": 12,
            "delete_after_years": 7
        },
        "customers": {
            "retention_indefinite": true,
            "anonymize_after_years": 5,
            "delete_inactive_after_years": 7
        },
        "reviews": {
            "retention_indefinite": true,
            "archive_after_years": 2
        },
        "marketing_activities": {
            "retention_months": 12,
            "archive_after_months": 6
        },
        "analytics_raw": {
            "retention_months": 6,
            "aggregate_after_days": 30
        },
        "analytics_aggregated": {
            "retention_indefinite": true
        },
        "event_logs": {
            "retention_months": 6,
            "delete_after_months": 12
        }
    }'::jsonb,
    
    -- Compliance Settings
    gdpr_compliance BOOLEAN DEFAULT true,
    ccpa_compliance BOOLEAN DEFAULT true,
    data_processing_consent BOOLEAN DEFAULT false,
    
    -- Automated Cleanup
    auto_cleanup_enabled BOOLEAN DEFAULT true,
    last_cleanup_at TIMESTAMP WITH TIME ZONE,
    next_cleanup_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Restaurants indexes
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_city_state ON restaurants(city, state);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine_types ON restaurants USING GIN(cuisine_types);
CREATE INDEX IF NOT EXISTS idx_restaurants_subscription ON restaurants(subscription_tier, subscription_status);
CREATE INDEX IF NOT EXISTS idx_restaurants_onboarding ON restaurants(onboarding_status);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_restaurant_id ON users(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Customer frequency segments indexes
CREATE INDEX IF NOT EXISTS idx_customer_segments_restaurant ON customer_frequency_segments(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_customer_segments_type ON customer_frequency_segments(segment_type);
CREATE INDEX IF NOT EXISTS idx_customer_segments_calculation ON customer_frequency_segments(next_calculation_at);

-- Marketing attribution indexes
CREATE INDEX IF NOT EXISTS idx_marketing_attribution_restaurant ON marketing_attribution(restaurant_id);

-- Data retention indexes
CREATE INDEX IF NOT EXISTS idx_data_retention_restaurant ON data_retention_policies(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_data_retention_cleanup ON data_retention_policies(next_cleanup_at);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_restaurants_updated_at
    BEFORE UPDATE ON restaurants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_frequency_segments_updated_at
    BEFORE UPDATE ON customer_frequency_segments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_attribution_updated_at
    BEFORE UPDATE ON marketing_attribution
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_retention_policies_updated_at
    BEFORE UPDATE ON data_retention_policies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) FOR MULTI-TENANCY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_frequency_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_retention_policies ENABLE ROW LEVEL SECURITY;

-- RLS Policies (will be implemented based on authentication system)
-- These are placeholder policies - actual implementation depends on auth setup

-- Users can only access their own restaurant's data
CREATE POLICY users_restaurant_isolation ON users
    FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id')::uuid);

CREATE POLICY customer_segments_restaurant_isolation ON customer_frequency_segments
    FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id')::uuid);

CREATE POLICY marketing_attribution_restaurant_isolation ON marketing_attribution
    FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id')::uuid);

CREATE POLICY data_retention_restaurant_isolation ON data_retention_policies
    FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id')::uuid);
