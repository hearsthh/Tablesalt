-- =====================================================
-- RESTAURANT CORE SCHEMA - SAAS MULTI-TENANT VERSION
-- Enhanced with Custom Options Support
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. RESTAURANTS (Core Multi-tenant Entity)
-- Enhanced with custom options support
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Basic Information (from setup form)
    restaurant_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50) DEFAULT 'restaurant',
    cuisine_type TEXT[] DEFAULT '{}', -- Array to match multi-select with custom options
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
    
    -- Services (Enhanced with custom options)
    special_services TEXT[] DEFAULT '{}', -- Private Events, Catering, Wine Tastings + custom
    catering_services TEXT[] DEFAULT '{}', -- Corporate Catering, Event Catering + custom
    delivery_options TEXT[] DEFAULT '{}', -- DoorDash, Uber Eats, In-house Delivery + custom
    reservation_policy TEXT,
    cancellation_policy TEXT,
    
    -- Quality & Recognition (Enhanced with custom options)
    sustainability_practices TEXT[] DEFAULT '{}', -- Locally Sourced, Organic Ingredients + custom
    awards_certifications TEXT[] DEFAULT '{}', -- Best Italian Restaurant 2023 + custom
    health_safety_measures TEXT[] DEFAULT '{}', -- Enhanced Cleaning, Contactless Payment + custom
    accessibility_features TEXT[] DEFAULT '{}', -- Wheelchair Accessible, Braille Menus + custom
    
    -- Technology Features (Enhanced with custom options)
    technology_features TEXT[] DEFAULT '{}', -- Online Ordering, Mobile App, QR Code Menus + custom
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
            "content_generation": true,
            "custom_option_suggestions": true
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
-- 2. OPTION_CATEGORIES (NEW TABLE)
-- Master list of categories for options
-- =====================================================
CREATE TABLE IF NOT EXISTS option_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. PREDEFINED_OPTIONS (NEW TABLE)
-- Master list of predefined options for each category
-- =====================================================
CREATE TABLE IF NOT EXISTS predefined_options (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES option_categories(id) ON DELETE CASCADE,
    value VARCHAR(200) NOT NULL,
    display_name VARCHAR(200),
    description TEXT,
    popularity_score INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT false,
    applicable_business_types TEXT[], -- ['restaurant', 'cafe', 'bar', 'fast-food']
    applicable_cuisine_types TEXT[], -- ['italian', 'mexican', 'asian']
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, value)
);

-- =====================================================
-- 4. CUSTOM_OPTIONS (NEW TABLE)
-- Track all custom options added by restaurants or AI
-- =====================================================
CREATE TABLE IF NOT EXISTS custom_options (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES option_categories(id) ON DELETE CASCADE,
    restaurant_id INTEGER, -- Will reference restaurants table when created
    value VARCHAR(200) NOT NULL,
    display_name VARCHAR(200),
    description TEXT,
    source VARCHAR(50) DEFAULT 'user', -- 'user', 'ai', 'import', 'suggestion'
    ai_confidence_score DECIMAL(3,2), -- 0.00 to 1.00 for AI-generated options
    usage_count INTEGER DEFAULT 1,
    is_approved BOOLEAN DEFAULT true,
    is_promoted BOOLEAN DEFAULT false, -- Can be promoted to predefined
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by VARCHAR(100)
);

-- =====================================================
-- 5. RESTAURANT_DINING_FEATURES (NEW TABLE)
-- Junction table for dining features
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_dining_features (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER, -- Will reference restaurants table
    option_type VARCHAR(20) NOT NULL CHECK (option_type IN ('predefined', 'custom')),
    predefined_option_id INTEGER REFERENCES predefined_options(id) ON DELETE CASCADE,
    custom_option_id INTEGER REFERENCES custom_options(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by VARCHAR(100),
    CONSTRAINT check_option_reference CHECK (
        (option_type = 'predefined' AND predefined_option_id IS NOT NULL AND custom_option_id IS NULL) OR
        (option_type = 'custom' AND custom_option_id IS NOT NULL AND predefined_option_id IS NULL)
    )
);

-- =====================================================
-- 6. RESTAURANT_DIETARY_ACCOMMODATIONS (NEW TABLE)
-- Junction table for dietary accommodations
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_dietary_accommodations (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER,
    option_type VARCHAR(20) NOT NULL CHECK (option_type IN ('predefined', 'custom')),
    predefined_option_id INTEGER REFERENCES predefined_options(id) ON DELETE CASCADE,
    custom_option_id INTEGER REFERENCES custom_options(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by VARCHAR(100),
    CONSTRAINT check_option_reference CHECK (
        (option_type = 'predefined' AND predefined_option_id IS NOT NULL AND custom_option_id IS NULL) OR
        (option_type = 'custom' AND custom_option_id IS NOT NULL AND predefined_option_id IS NULL)
    )
);

-- =====================================================
-- 7. RESTAURANT_AMBIANCE_TAGS (NEW TABLE)
-- Junction table for ambiance tags
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_ambiance_tags (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER,
    option_type VARCHAR(20) NOT NULL CHECK (option_type IN ('predefined', 'custom')),
    predefined_option_id INTEGER REFERENCES predefined_options(id) ON DELETE CASCADE,
    custom_option_id INTEGER REFERENCES custom_options(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by VARCHAR(100),
    CONSTRAINT check_option_reference CHECK (
        (option_type = 'predefined' AND predefined_option_id IS NOT NULL AND custom_option_id IS NULL) OR
        (option_type = 'custom' AND custom_option_id IS NOT NULL AND predefined_option_id IS NULL)
    )
);

-- =====================================================
-- 8. RESTAURANT_MUSIC_ENTERTAINMENT (NEW TABLE)
-- Junction table for music entertainment
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_music_entertainment (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER,
    option_type VARCHAR(20) NOT NULL CHECK (option_type IN ('predefined', 'custom')),
    predefined_option_id INTEGER REFERENCES predefined_options(id) ON DELETE CASCADE,
    custom_option_id INTEGER REFERENCES custom_options(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by VARCHAR(100),
    CONSTRAINT check_option_reference CHECK (
        (option_type = 'predefined' AND predefined_option_id IS NOT NULL AND custom_option_id IS NULL) OR
        (option_type = 'custom' AND custom_option_id IS NOT NULL AND predefined_option_id IS NULL)
    )
);

-- =====================================================
-- 9. RESTAURANT_PARKING_OPTIONS (NEW TABLE)
-- Junction table for parking options
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_parking_options (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER,
    option_type VARCHAR(20) NOT NULL CHECK (option_type IN ('predefined', 'custom')),
    predefined_option_id INTEGER REFERENCES predefined_options(id) ON DELETE CASCADE,
    custom_option_id INTEGER REFERENCES custom_options(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by VARCHAR(100),
    CONSTRAINT check_option_reference CHECK (
        (option_type = 'predefined' AND predefined_option_id IS NOT NULL AND custom_option_id IS NULL) OR
        (option_type = 'custom' AND custom_option_id IS NOT NULL AND predefined_option_id IS NULL)
    )
);

-- =====================================================
-- 10. RESTAURANT_PAYMENT_METHODS (NEW TABLE)
-- Junction table for payment methods
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_payment_methods (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER,
    option_type VARCHAR(20) NOT NULL CHECK (option_type IN ('predefined', 'custom')),
    predefined_option_id INTEGER REFERENCES predefined_options(id) ON DELETE CASCADE,
    custom_option_id INTEGER REFERENCES custom_options(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by VARCHAR(100),
    CONSTRAINT check_option_reference CHECK (
        (option_type = 'predefined' AND predefined_option_id IS NOT NULL AND custom_option_id IS NULL) OR
        (option_type = 'custom' AND custom_option_id IS NOT NULL AND predefined_option_id IS NULL)
    )
);

-- =====================================================
-- 11. RESTAURANT_SPECIAL_SERVICES (NEW TABLE)
-- Junction table for special services
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_special_services (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER,
    option_type VARCHAR(20) NOT NULL CHECK (option_type IN ('predefined', 'custom')),
    predefined_option_id INTEGER REFERENCES predefined_options(id) ON DELETE CASCADE,
    custom_option_id INTEGER REFERENCES custom_options(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by VARCHAR(100),
    CONSTRAINT check_option_reference CHECK (
        (option_type = 'predefined' AND predefined_option_id IS NOT NULL AND custom_option_id IS NULL) OR
        (option_type = 'custom' AND custom_option_id IS NOT NULL AND predefined_option_id IS NULL)
    )
);

-- =====================================================
-- 12. RESTAURANT_SUSTAINABILITY_PRACTICES (NEW TABLE)
-- Junction table for sustainability practices
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_sustainability_practices (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER,
    option_type VARCHAR(20) NOT NULL CHECK (option_type IN ('predefined', 'custom')),
    predefined_option_id INTEGER REFERENCES predefined_options(id) ON DELETE CASCADE,
    custom_option_id INTEGER REFERENCES custom_options(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by VARCHAR(100),
    CONSTRAINT check_option_reference CHECK (
        (option_type = 'predefined' AND predefined_option_id IS NOT NULL AND custom_option_id IS NULL) OR
        (option_type = 'custom' AND custom_option_id IS NOT NULL AND predefined_option_id IS NULL)
    )
);

-- =====================================================
-- 13. RESTAURANT_TECHNOLOGY_FEATURES (NEW TABLE)
-- Junction table for technology features
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_technology_features (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER,
    option_type VARCHAR(20) NOT NULL CHECK (option_type IN ('predefined', 'custom')),
    predefined_option_id INTEGER REFERENCES predefined_options(id) ON DELETE CASCADE,
    custom_option_id INTEGER REFERENCES custom_options(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by VARCHAR(100),
    CONSTRAINT check_option_reference CHECK (
        (option_type = 'predefined' AND predefined_option_id IS NOT NULL AND custom_option_id IS NULL) OR
        (option_type = 'custom' AND custom_option_id IS NOT NULL AND predefined_option_id IS NULL)
    )
);

-- =====================================================
-- 14. CUSTOMER_SEGMENTS (Dynamic per restaurant)
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
-- 15. USERS (Restaurant Staff - Enhanced)
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
-- 16. SETUP_SECTIONS_PROGRESS (Track setup completion)
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

-- Predefined options indexes
CREATE INDEX IF NOT EXISTS idx_predefined_options_category ON predefined_options(category_id);
CREATE INDEX IF NOT EXISTS idx_predefined_options_active ON predefined_options(category_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_predefined_options_popularity ON predefined_options(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_predefined_options_subscription ON predefined_options(is_premium);

-- Custom options indexes
CREATE INDEX IF NOT EXISTS idx_custom_options_category ON custom_options(category_id);
CREATE INDEX IF NOT EXISTS idx_custom_options_restaurant ON custom_options(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_custom_options_usage ON custom_options(usage_count DESC);

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

-- Junction tables indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_dining_features_restaurant ON restaurant_dining_features(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_dietary_accommodations_restaurant ON restaurant_dietary_accommodations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_ambiance_tags_restaurant ON restaurant_ambiance_tags(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_music_entertainment_restaurant ON restaurant_music_entertainment(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_parking_options_restaurant ON restaurant_parking_options(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_payment_methods_restaurant ON restaurant_payment_methods(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_special_services_restaurant ON restaurant_special_services(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_sustainability_practices_restaurant ON restaurant_sustainability_practices(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_technology_features_restaurant ON restaurant_technology_features(restaurant_id);

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
CREATE TRIGGER update_predefined_options_updated_at BEFORE UPDATE ON predefined_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custom_options_updated_at BEFORE UPDATE ON custom_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_frequency_config_updated_at BEFORE UPDATE ON restaurant_customer_frequency_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_segments_updated_at BEFORE UPDATE ON customer_segments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_setup_progress_updated_at BEFORE UPDATE ON setup_sections_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CUSTOM OPTION TRACKING TRIGGERS
-- =====================================================

-- Function to track custom options when restaurant data is updated
CREATE OR REPLACE FUNCTION track_custom_options()
RETURNS TRIGGER AS $$
DECLARE
    category_name TEXT;
    option_value TEXT;
    predefined_options_list TEXT[];
BEGIN
    -- Only process if this is an update and arrays have changed
    IF TG_OP = 'UPDATE' THEN
        -- Check each array field for new custom options
        FOR category_name IN SELECT unnest(ARRAY[
            'dining_features', 'dietary_accommodations', 'ambiance_tags', 
            'music_entertainment', 'parking_options', 'payment_methods',
            'signature_dishes', 'special_services', 'catering_services',
            'delivery_options', 'sustainability_practices', 'awards_certifications',
            'health_safety_measures', 'accessibility_features', 'technology_features',
            'cuisine_type'
        ]) LOOP
            -- Get current values for this category
            EXECUTE format('SELECT $1.%I', category_name) USING NEW INTO predefined_options_list;
            
            -- Check each option in the array
            FOR option_value IN SELECT unnest(predefined_options_list) LOOP
                -- If option doesn't exist in predefined_options, log it as custom
                IF NOT EXISTS (
                    SELECT 1 FROM predefined_options 
                    WHERE category_id = (SELECT id FROM option_categories WHERE name = category_name) AND value = option_value
                ) THEN
                    -- Insert or update custom option log
                    INSERT INTO custom_options (
                        category_id, restaurant_id, value, display_name, source
                    ) VALUES (
                        (SELECT id FROM option_categories WHERE name = category_name), NEW.id, option_value, option_value, 'user'
                    ) ON CONFLICT (category_id, restaurant_id, value) 
                    DO UPDATE SET 
                        usage_count = custom_options.usage_count + 1,
                        last_used_at = NOW();
                END IF;
            END LOOP;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply custom option tracking trigger
CREATE TRIGGER track_restaurant_custom_options 
    AFTER UPDATE ON restaurants 
    FOR EACH ROW 
    EXECUTE FUNCTION track_custom_options();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) FOR MULTI-TENANCY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE option_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE predefined_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_dining_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_dietary_accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_ambiance_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_music_entertainment ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_parking_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_special_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_sustainability_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_technology_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE setup_sections_progress ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (will be enhanced based on auth implementation)
CREATE POLICY restaurant_isolation ON restaurants FOR ALL USING (id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY option_categories_public ON option_categories FOR SELECT USING (true); -- Public read access
CREATE POLICY predefined_options_public ON predefined_options FOR SELECT USING (true); -- Public read access
CREATE POLICY custom_options_isolation ON custom_options FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY dining_features_isolation ON restaurant_dining_features FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY dietary_accommodations_isolation ON restaurant_dietary_accommodations FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY ambiance_tags_isolation ON restaurant_ambiance_tags FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY music_entertainment_isolation ON restaurant_music_entertainment FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY parking_options_isolation ON restaurant_parking_options FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY payment_methods_isolation ON restaurant_payment_methods FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY special_services_isolation ON restaurant_special_services FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY sustainability_practices_isolation ON restaurant_sustainability_practices FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY technology_features_isolation ON restaurant_technology_features FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY segments_isolation ON customer_segments FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY users_isolation ON users FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY setup_progress_isolation ON setup_sections_progress FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);

-- =====================================================
-- VIEWS FOR EASY QUERYING
-- =====================================================

-- View for all options in restaurants
CREATE VIEW v_restaurant_all_options AS
SELECT 
    'dining_features' as category,
    rdf.restaurant_id,
    CASE 
        WHEN rdf.option_type = 'predefined' THEN po.value
        ELSE co.value
    END as option_value,
    CASE 
        WHEN rdf.option_type = 'predefined' THEN po.display_name
        ELSE co.display_name
    END as display_name,
    rdf.option_type,
    rdf.added_at
FROM restaurant_dining_features rdf
LEFT JOIN predefined_options po ON rdf.predefined_option_id = po.id
LEFT JOIN custom_options co ON rdf.custom_option_id = co.id

UNION ALL

SELECT 
    'dietary_accommodations' as category,
    rda.restaurant_id,
    CASE 
        WHEN rda.option_type = 'predefined' THEN po.value
        ELSE co.value
    END as option_value,
    CASE 
        WHEN rda.option_type = 'predefined' THEN po.display_name
        ELSE co.display_name
    END as display_name,
    rda.option_type,
    rda.added_at
FROM restaurant_dietary_accommodations rda
LEFT JOIN predefined_options po ON rda.predefined_option_id = po.id
LEFT JOIN custom_options co ON rda.custom_option_id = co.id

UNION ALL

SELECT 
    'ambiance_tags' as category,
    rat.restaurant_id,
    CASE 
        WHEN rat.option_type = 'predefined' THEN po.value
        ELSE co.value
    END as option_value,
    CASE 
        WHEN rat.option_type = 'predefined' THEN po.display_name
        ELSE co.display_name
    END as display_name,
    rat.option_type,
    rat.added_at
FROM restaurant_ambiance_tags rat
LEFT JOIN predefined_options po ON rat.predefined_option_id = po.id
LEFT JOIN custom_options co ON rat.custom_option_id = co.id

UNION ALL

SELECT 
    'music_entertainment' as category,
    rme.restaurant_id,
    CASE 
        WHEN rme.option_type = 'predefined' THEN po.value
        ELSE co.value
    END as option_value,
    CASE 
        WHEN rme.option_type = 'predefined' THEN po.display_name
        ELSE co.display_name
    END as display_name,
    rme.option_type,
    rme.added_at
FROM restaurant_music_entertainment rme
LEFT JOIN predefined_options po ON rme.predefined_option_id = po.id
LEFT JOIN custom_options co ON rme.custom_option_id = co.id

UNION ALL

SELECT 
    'parking_options' as category,
    rpo.restaurant_id,
    CASE 
        WHEN rpo.option_type = 'predefined' THEN po.value
        ELSE co.value
    END as option_value,
    CASE 
        WHEN rpo.option_type = 'predefined' THEN po.display_name
        ELSE co.display_name
    END as display_name,
    rpo.option_type,
    rpo.added_at
FROM restaurant_parking_options rpo
LEFT JOIN predefined_options po ON rpo.predefined_option_id = po.id
LEFT JOIN custom_options co ON rpo.custom_option_id = co.id

UNION ALL

SELECT 
    'payment_methods' as category,
    rpm.restaurant_id,
    CASE 
        WHEN rpm.option_type = 'predefined' THEN po.value
        ELSE co.value
    END as option_value,
    CASE 
        WHEN rpm.option_type = 'predefined' THEN po.display_name
        ELSE co.display_name
    END as display_name,
    rpm.option_type,
    rpm.added_at
FROM restaurant_payment_methods rpm
LEFT JOIN predefined_options po ON rpm.predefined_option_id = po.id
LEFT JOIN custom_options co ON rpm.custom_option_id = co.id

UNION ALL

SELECT 
    'special_services' as category,
    rss.restaurant_id,
    CASE 
        WHEN rss.option_type = 'predefined' THEN po.value
        ELSE co.value
    END as option_value,
    CASE 
        WHEN rss.option_type = 'predefined' THEN po.display_name
        ELSE co.display_name
    END as display_name,
    rss.option_type,
    rss.added_at
FROM restaurant_special_services rss
LEFT JOIN predefined_options po ON rss.predefined_option_id = po.id
LEFT JOIN custom_options co ON rss.custom_option_id = co.id

UNION ALL

SELECT 
    'sustainability_practices' as category,
    rsp.restaurant_id,
    CASE 
        WHEN rsp.option_type = 'predefined' THEN po.value
        ELSE co.value
    END as option_value,
    CASE 
        WHEN rsp.option_type = 'predefined' THEN po.display_name
        ELSE co.display_name
    END as display_name,
    rsp.option_type,
    rsp.added_at
FROM restaurant_sustainability_practices rsp
LEFT JOIN predefined_options po ON rsp.predefined_option_id = po.id
LEFT JOIN custom_options co ON rsp.custom_option_id = co.id

UNION ALL

SELECT 
    'technology_features' as category,
    rtf.restaurant_id,
    CASE 
        WHEN rtf.option_type = 'predefined' THEN po.value
        ELSE co.value
    END as option_value,
    CASE 
        WHEN rtf.option_type = 'predefined' THEN po.display_name
        ELSE co.display_name
    END as display_name,
    rtf.option_type,
    rtf.added_at
FROM restaurant_technology_features rtf
LEFT JOIN predefined_options po ON rtf.predefined_option_id = po.id
LEFT JOIN custom_options co ON rtf.custom_option_id = co.id;

-- Function to get popular custom options that could be promoted
CREATE OR REPLACE FUNCTION get_promotable_custom_options(min_usage_count INTEGER DEFAULT 5)
RETURNS TABLE (
    category_name VARCHAR(100),
    option_value VARCHAR(200),
    usage_count INTEGER,
    restaurant_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        oc.name as category_name,
        co.value as option_value,
        co.usage_count,
        COUNT(DISTINCT co.restaurant_id) as restaurant_count
    FROM custom_options co
    JOIN option_categories oc ON co.category_id = oc.id
    WHERE co.usage_count >= min_usage_count
        AND co.is_approved = true
        AND co.is_promoted = false
    GROUP BY oc.name, co.value, co.usage_count
    ORDER BY co.usage_count DESC, restaurant_count DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE option_categories IS 'Categories for restaurant amenities and features (dining_features, dietary_accommodations, etc.)';
COMMENT ON TABLE predefined_options IS 'Standard/common options available across all restaurants';
COMMENT ON TABLE custom_options IS 'Restaurant-specific or AI-suggested custom options';
COMMENT ON COLUMN custom_options.source IS 'Source of the custom option: user, ai, import, suggestion';
COMMENT ON COLUMN custom_options.ai_confidence_score IS 'AI confidence score (0.00-1.00) for AI-generated options';
COMMENT ON COLUMN predefined_options.popularity_score IS 'Usage popularity score for sorting and recommendations';
