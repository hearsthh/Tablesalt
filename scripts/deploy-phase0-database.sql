-- =====================================================
-- PHASE 0 DATABASE DEPLOYMENT SCRIPT
-- Deploy essential schemas for 10 test restaurants
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- 1. DEPLOY CORE SAAS SCHEMA
-- =====================================================

-- Organizations (Top-level tenant isolation)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255),
    subscription_plan VARCHAR(50) DEFAULT 'phase0_trial' CHECK (subscription_plan IN ('starter', 'professional', 'enterprise', 'custom', 'phase0_trial')),
    subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled', 'suspended')),
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '90 days',
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    billing_email VARCHAR(255),
    limits JSONB DEFAULT '{
        "restaurants": 1,
        "users": 5,
        "customers": 1000,
        "menu_items": 100,
        "monthly_emails": 1000,
        "api_calls_per_month": 10000
    }'::jsonb,
    current_usage JSONB DEFAULT '{
        "restaurants": 0,
        "users": 0,
        "customers": 0,
        "menu_items": 0,
        "monthly_emails": 0,
        "api_calls_this_month": 0
    }'::jsonb,
    settings JSONB DEFAULT '{
        "timezone": "UTC",
        "currency": "USD",
        "features": {
            "ai_insights": true,
            "bulk_communications": true,
            "advanced_analytics": false,
            "api_access": false
        }
    }'::jsonb,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users (Multi-tenant users)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'manager', 'member')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, email)
);

-- Restaurants
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    address JSONB DEFAULT '{}'::jsonb,
    cuisine_types TEXT[] DEFAULT '{}',
    price_range VARCHAR(10) CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
    operating_hours JSONB DEFAULT '{
        "monday": {"open": "09:00", "close": "22:00", "closed": false},
        "tuesday": {"open": "09:00", "close": "22:00", "closed": false},
        "wednesday": {"open": "09:00", "close": "22:00", "closed": false},
        "thursday": {"open": "09:00", "close": "22:00", "closed": false},
        "friday": {"open": "09:00", "close": "23:00", "closed": false},
        "saturday": {"open": "09:00", "close": "23:00", "closed": false},
        "sunday": {"open": "10:00", "close": "21:00", "closed": false}
    }'::jsonb,
    settings JSONB DEFAULT '{
        "timezone": "UTC",
        "currency": "USD",
        "onboarding_completed": false,
        "demo_data_loaded": true
    }'::jsonb,
    social_media JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, slug)
);

-- =====================================================
-- 2. DEPLOY INTEGRATION SCHEMA
-- =====================================================

-- Integration providers
CREATE TABLE IF NOT EXISTS integration_providers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url TEXT,
    api_available BOOLEAN DEFAULT false,
    demo_available BOOLEAN DEFAULT true,
    supported_countries TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant integrations
CREATE TABLE IF NOT EXISTS restaurant_integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    provider_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'demo' CHECK (status IN ('demo', 'connected', 'disconnected', 'error')),
    config JSONB DEFAULT '{}',
    credentials JSONB DEFAULT '{}',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, provider_name)
);

-- =====================================================
-- 3. DEPLOY ESSENTIAL DATA TABLES
-- =====================================================

-- Setup progress tracking
CREATE TABLE IF NOT EXISTS setup_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    step VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    data JSONB DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, step)
);

-- Basic menu structure for Phase 0
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    is_available BOOLEAN DEFAULT true,
    dietary_tags TEXT[] DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_restaurants_organization ON restaurants(organization_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_integrations_restaurant ON restaurant_integrations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_setup_progress_restaurant ON setup_progress(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant ON menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);

-- =====================================================
-- 5. INSERT PHASE 0 DATA
-- =====================================================

-- Insert core integration providers for Phase 0
INSERT INTO integration_providers (name, display_name, category, description, api_available, demo_available, supported_countries) VALUES
('google-my-business', 'Google My Business', 'restaurantInfo', 'Manage your Google listing', true, true, ARRAY['US', 'UK', 'CA', 'AU', 'IN']),
('square-pos', 'Square POS', 'menuOrders', 'Point of sale system', true, true, ARRAY['US', 'CA', 'AU', 'UK']),
('yelp', 'Yelp for Business', 'reviews', 'Customer reviews and ratings', true, true, ARRAY['US', 'CA']),
('mailchimp', 'Mailchimp', 'marketing', 'Email marketing campaigns', true, true, ARRAY['US', 'UK', 'CA', 'AU', 'IN']),
('facebook-business', 'Facebook Business', 'socialMedia', 'Social media management', true, true, ARRAY['US', 'UK', 'CA', 'AU', 'IN'])
ON CONFLICT (name) DO NOTHING;

-- Create Phase 0 test organization
INSERT INTO organizations (id, name, slug, subscription_plan, subscription_status, trial_ends_at, billing_email) VALUES
('00000000-0000-0000-0000-000000000001', 'Phase 0 Test Organization', 'phase0-test', 'phase0_trial', 'active', NOW() + INTERVAL '90 days', 'admin@tablesalt.ai')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 6. CREATE TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_integrations_updated_at BEFORE UPDATE ON restaurant_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_setup_progress_updated_at BEFORE UPDATE ON setup_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PHASE 0 DEPLOYMENT COMPLETE
-- =====================================================

-- Verify deployment
SELECT 
    'Phase 0 Database Deployment Complete' as status,
    NOW() as deployed_at,
    (SELECT COUNT(*) FROM organizations) as organizations_count,
    (SELECT COUNT(*) FROM integration_providers) as integration_providers_count;
