-- =====================================================
-- RESTAURANT CORE SCHEMA - SAAS MULTI-TENANT VERSION
-- Aligned with existing setup forms
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. RESTAURANTS (Core Multi-tenant Entity)
-- Matches the setup form fields exactly
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Basic Information (from setup form)
    restaurant_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50) DEFAULT 'restaurant',
    cuisine_type TEXT[] DEFAULT '{}', -- Array to match multi-select
    establishment_year VARCHAR(4),
    chain_or_independent VARCHAR(20) DEFAULT 'independent',
    
    -- Location & Contact (from setup form)
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    website TEXT,
    
    -- Operating Hours (matches time-picker component)
    operating_hours JSONB DEFAULT '{
        "monday": {"open": true, "openTime": "11:30", "closeTime": "21:30"},
        "tuesday": {"open": true, "openTime": "11:30", "closeTime": "21:30"},
        "wednesday": {"open": true, "openTime": "11:30", "closeTime": "21:30"},
        "thursday": {"open": true, "openTime": "11:30", "closeTime": "21:30"},
        "friday": {"open": true, "openTime": "11:30", "closeTime": "22:30"},
        "saturday": {"open": true, "openTime": "11:30", "closeTime": "22:30"},
        "sunday": {"open": true, "openTime": "12:30", "closeTime": "20:30"}
    }'::jsonb,
    holiday_hours TEXT,
    
    -- Restaurant Details (from setup form)
    seating_capacity VARCHAR(10),
    private_dining_capacity VARCHAR(10),
    dress_code VARCHAR(50),
    price_range VARCHAR(20), -- $$ ($15-30)
    average_meal_cost VARCHAR(50), -- "$25 per person"
    
    -- Amenities & Features (from multi-select fields)
    dining_features TEXT[] DEFAULT '{}', -- Outdoor Seating, Private Dining, Bar Seating
    dietary_accommodations TEXT[] DEFAULT '{}', -- Vegetarian, Vegan, Gluten-Free
    ambiance_tags TEXT[] DEFAULT '{}', -- Romantic, Family-Friendly, Cozy
    music_entertainment TEXT[] DEFAULT '{}', -- Live Music, Piano Bar
    parking_options TEXT[] DEFAULT '{}', -- Street Parking, Valet Parking
    payment_methods TEXT[] DEFAULT '{}', -- Credit Cards, Debit Cards, Cash, Apple Pay
    
    -- Content & Marketing (from setup form)
    brand_story TEXT,
    chef_specialties TEXT,
    signature_dishes TEXT[] DEFAULT '{}',
    wine_beer_program TEXT,
    happy_hour_details TEXT,
    community_involvement TEXT,
    
    -- Social Media & Digital (from setup form)
    facebook_handle VARCHAR(100),
    instagram_handle VARCHAR(100),
    twitter_handle VARCHAR(100),
    tiktok_handle VARCHAR(100),
    linkedin_handle VARCHAR(100),
    youtube_channel VARCHAR(100),
    google_business_profile VARCHAR(100),
    
    -- Brand Assets (from setup form)
    logo_url TEXT,
    brand_colors JSONB DEFAULT '{
        "primary": "#8B4513",
        "secondary": "#DAA520",
        "accent": "#228B22"
    }'::jsonb,
    brand_assets TEXT[] DEFAULT '{}', -- Array of image URLs
    
    -- Photo Galleries (from image gallery components)
    interior_photos TEXT[] DEFAULT '{}',
    exterior_photos TEXT[] DEFAULT '{}',
    food_photos TEXT[] DEFAULT '{}',
    team_photos TEXT[] DEFAULT '{}',
    
    -- Chef Information (from setup form)
    chef_name VARCHAR(255),
    chef_photo TEXT,
    chef_bio TEXT,
    chef_specialties_detailed TEXT,
    
    -- Services (from setup form)
    special_services TEXT[] DEFAULT '{}', -- Private Events, Catering, Wine Tastings
    catering_services TEXT[] DEFAULT '{}', -- Corporate Catering, Event Catering
    delivery_options TEXT[] DEFAULT '{}', -- DoorDash, Uber Eats, In-house Delivery
    reservation_policy TEXT,
    cancellation_policy TEXT,
    
    -- Quality & Recognition (from setup form)
    sustainability_practices TEXT[] DEFAULT '{}', -- Locally Sourced, Organic Ingredients
    awards_certifications TEXT[] DEFAULT '{}', -- Best Italian Restaurant 2023
    health_safety_measures TEXT[] DEFAULT '{}', -- Enhanced Cleaning, Contactless Payment
    accessibility_features TEXT[] DEFAULT '{}', -- Wheelchair Accessible, Braille Menus
    
    -- Technology Features (from setup form)
    technology_features TEXT[] DEFAULT '{}', -- Online Ordering, Mobile App, QR Code Menus
    online_ordering BOOLEAN DEFAULT false,
    mobile_app BOOLEAN DEFAULT false,
    loyalty_program BOOLEAN DEFAULT false,
    loyalty_program_name VARCHAR(100),
    
    -- SaaS Platform Settings
    subscription_tier VARCHAR(20) DEFAULT 'basic', -- basic, pro, enterprise
    subscription_status VARCHAR(20) DEFAULT 'trial', -- trial, active, suspended, cancelled
    subscription_started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '14 days',
    
    -- Onboarding Progress (matches setup sections)
    onboarding_status VARCHAR(20) DEFAULT 'pending',
    onboarding_completed_at TIMESTAMP WITH TIME ZONE,
    setup_progress JSONB DEFAULT '{
        "restaurant-info": {"completed": false, "progress": 0},
        "menu-setup": {"completed": false, "progress": 0},
        "reviews-setup": {"completed": false, "progress": 0},
        "orders-data": {"completed": false, "progress": 0},
        "customer-data": {"completed": false, "progress": 0},
        "channel-integrations": {"completed": false, "progress": 0}
    }'::jsonb,
    
    -- Restaurant-Specific Analytics Settings
    analytics_settings JSONB DEFAULT '{
        "customer_frequency": {
            "avg_days_per_visit": null,
            "auto_calculate": true,
            "last_calculated": null
        },
        "business_hours_analysis": true,
        "seasonal_patterns": true,
        "competitor_tracking": false
    }'::jsonb,
    
    -- Platform Configuration
    platform_settings JSONB DEFAULT '{
        "notifications": {
            "email": true,
            "sms": false,
            "push": true,
            "frequency": "daily"
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
            "marketing_automation": true,
            "content_generation": true
        },
        "data_sharing": {
            "anonymous_benchmarking": true,
            "industry_insights": true
        }
    }'::jsonb,
    
    -- Performance Metrics (cached for dashboard)
    performance_metrics JSONB DEFAULT '{
        "total_customers": 0,
        "total_orders": 0,
        "total_revenue": 0,
        "avg_rating": 0,
        "total_reviews": 0,
        "last_30_days": {
            "revenue": 0,
            "orders": 0,
            "new_customers": 0,
            "avg_rating": 0
        }
    }'::jsonb,
    
    -- Billing Information
    billing_info JSONB DEFAULT '{
        "company_name": null,
        "billing_email": null,
        "tax_id": null,
        "billing_address": null,
        "payment_method": null,
        "auto_billing": true
    }'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraints for SaaS
    UNIQUE(restaurant_name, city, state) -- Prevent duplicate restaurant names in same city
);

-- =====================================================
-- 2. RESTAURANT_CUSTOMER_FREQUENCY_CONFIG
-- Dynamic frequency calculation per restaurant
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_customer_frequency_config (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Calculated Base Metrics (unique per restaurant)
    avg_days_per_visit DECIMAL(5,2), -- Calculated from actual order data
    median_days_per_visit DECIMAL(5,2),
    std_deviation_days DECIMAL(5,2),
    total_customers_analyzed INTEGER DEFAULT 0,
    
    -- Dynamic Thresholds (calculated based on restaurant's patterns)
    frequency_thresholds JSONB DEFAULT '{
        "new_customer_days": null,
        "active_max_days": null,
        "at_risk_min_days": null,
        "at_risk_max_days": null,
        "churned_min_days": null
    }'::jsonb,
    
    -- Multiplier Rules (customizable per restaurant)
    frequency_multipliers JSONB DEFAULT '{
        "new_threshold": 2.0,
        "active_threshold": 2.0,
        "at_risk_min": 2.0,
        "at_risk_max": 3.0,
        "churned_threshold": 3.0
    }'::jsonb,
    
    -- Business Rules (restaurant can customize)
    business_rules JSONB DEFAULT '{
        "minimum_orders_for_analysis": 3,
        "exclude_delivery_only": false,
        "seasonal_adjustment": true,
        "weekend_weight": 1.0,
        "holiday_exclusions": true
    }'::jsonb,
    
    -- Calculation Status
    calculation_status VARCHAR(20) DEFAULT 'pending', -- pending, calculating, completed, error
    last_calculated_at TIMESTAMP WITH TIME ZONE,
    next_calculation_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
    calculation_error TEXT,
    
    -- Data Quality Metrics
    data_quality JSONB DEFAULT '{
        "sufficient_data": false,
        "confidence_score": 0,
        "data_points": 0,
        "date_range_days": 0,
        "warnings": []
    }'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id)
);

-- =====================================================
-- 3. CUSTOMER_SEGMENTS (Dynamic per restaurant)
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_segments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Segment Definition
    segment_name VARCHAR(50) NOT NULL, -- new, active, at_risk, churned, vip, etc.
    segment_type VARCHAR(20) DEFAULT 'frequency', -- frequency, rfm, behavioral, custom
    display_name VARCHAR(100), -- "New Customers", "VIP High-Value"
    description TEXT,
    
    -- Segment Criteria (flexible for different segment types)
    criteria JSONB NOT NULL, -- Different structure based on segment_type
    
    -- Current Statistics (updated during calculation)
    customer_count INTEGER DEFAULT 0,
    percentage_of_total DECIMAL(5,2) DEFAULT 0,
    
    -- Performance Metrics
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    avg_visit_frequency DECIMAL(5,2) DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    avg_lifetime_value DECIMAL(10,2) DEFAULT 0,
    
    -- Marketing Configuration
    marketing_priority INTEGER DEFAULT 3, -- 1=highest, 5=lowest
    default_campaign_types TEXT[] DEFAULT '{}',
    recommended_channels TEXT[] DEFAULT '{}', -- email, sms, social, push
    
    -- Automation Settings
    auto_update BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    is_system_segment BOOLEAN DEFAULT false, -- true for new/active/at_risk/churned
    
    -- Calculation Tracking
    last_calculated_at TIMESTAMP WITH TIME ZONE,
    calculation_duration_ms INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, segment_name)
);

-- =====================================================
-- 4. USERS (Restaurant Staff - Enhanced)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Profile Information (matches setup form structure)
    profile JSONB DEFAULT '{
        "first_name": null,
        "last_name": null,
        "avatar_url": null,
        "phone": null,
        "title": null,
        "department": null,
        "bio": null
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
        "settings": {"read": false, "write": false},
        "billing": {"read": false, "write": false}
    }'::jsonb,
    
    -- User Preferences
    preferences JSONB DEFAULT '{
        "language": "en",
        "timezone": "UTC",
        "date_format": "MM/DD/YYYY",
        "time_format": "12h",
        "notifications": {
            "email": true,
            "push": true,
            "sms": false,
            "frequency": "immediate"
        },
        "dashboard": {
            "layout": "default",
            "widgets": [],
            "refresh_interval": 300
        },
        "theme": "light"
    }'::jsonb,
    
    -- Activity Tracking
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    invitation_accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- Security
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    
    -- Onboarding
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_step VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. SETUP_SECTIONS_PROGRESS (Track setup completion)
-- =====================================================
CREATE TABLE IF NOT EXISTS setup_sections_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Section Information
    section_id VARCHAR(50) NOT NULL, -- restaurant-info, menu-setup, etc.
    section_name VARCHAR(100) NOT NULL,
    
    -- Progress Tracking
    status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed, skipped
    progress_percentage INTEGER DEFAULT 0,
    
    -- Field Completion
    total_fields INTEGER DEFAULT 0,
    completed_fields INTEGER DEFAULT 0,
    required_fields INTEGER DEFAULT 0,
    completed_required_fields INTEGER DEFAULT 0,
    
    -- Integration Status
    total_integrations INTEGER DEFAULT 0,
    connected_integrations INTEGER DEFAULT 0,
    
    -- Form Data (store current form state)
    form_data JSONB DEFAULT '{}'::jsonb,
    
    -- Completion Details
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_updated_by UUID REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, section_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Restaurants indexes
CREATE INDEX IF NOT EXISTS idx_restaurants_subscription ON restaurants(subscription_status, subscription_tier);
CREATE INDEX IF NOT EXISTS idx_restaurants_trial ON restaurants(trial_ends_at) WHERE subscription_status = 'trial';
CREATE INDEX IF NOT EXISTS idx_restaurants_onboarding ON restaurants(onboarding_status);
CREATE INDEX IF NOT EXISTS idx_restaurants_city_state ON restaurants(city, state);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants USING GIN(cuisine_type);

-- Customer frequency config indexes
CREATE INDEX IF NOT EXISTS idx_frequency_config_restaurant ON restaurant_customer_frequency_config(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_frequency_config_calculation ON restaurant_customer_frequency_config(next_calculation_at) WHERE calculation_status = 'pending';

-- Customer segments indexes
CREATE INDEX IF NOT EXISTS idx_segments_restaurant ON customer_segments(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_segments_active ON customer_segments(restaurant_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_segments_system ON customer_segments(restaurant_id, is_system_segment) WHERE is_system_segment = true;

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_restaurant ON users(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(restaurant_id, role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(restaurant_id, is_active) WHERE is_active = true;

-- Setup progress indexes
CREATE INDEX IF NOT EXISTS idx_setup_progress_restaurant ON setup_sections_progress(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_setup_progress_status ON setup_sections_progress(restaurant_id, status);

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

-- Apply updated_at triggers
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_frequency_config_updated_at BEFORE UPDATE ON restaurant_customer_frequency_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_segments_updated_at BEFORE UPDATE ON customer_segments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_setup_progress_updated_at BEFORE UPDATE ON setup_sections_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) FOR MULTI-TENANCY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_customer_frequency_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE setup_sections_progress ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (will be enhanced based on auth implementation)
CREATE POLICY restaurant_isolation ON restaurants FOR ALL USING (id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY frequency_config_isolation ON restaurant_customer_frequency_config FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY segments_isolation ON customer_segments FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY users_isolation ON users FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY setup_progress_isolation ON setup_sections_progress FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
