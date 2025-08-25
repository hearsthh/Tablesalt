-- =====================================================
-- TABLESALT AI - SAAS CORE SCHEMA
-- Multi-tenant SaaS platform for restaurant management
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- 1. ORGANIZATIONS (Top-level tenant isolation)
-- =====================================================
CREATE TABLE IF NOT EXISTS organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Organization Details
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- URL-friendly identifier
    domain VARCHAR(255), -- Custom domain if any
    
    -- Subscription & Billing
    subscription_plan VARCHAR(50) DEFAULT 'starter' CHECK (subscription_plan IN ('starter', 'professional', 'enterprise', 'custom')),
    subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled', 'suspended')),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    
    -- Billing Information
    billing_email VARCHAR(255),
    billing_address JSONB DEFAULT '{}'::jsonb,
    payment_method_id VARCHAR(255), -- Stripe payment method ID
    customer_id VARCHAR(255), -- Stripe customer ID
    
    -- Usage Limits & Quotas
    limits JSONB DEFAULT '{
        "restaurants": 1,
        "users": 5,
        "customers": 1000,
        "menu_items": 100,
        "monthly_emails": 1000,
        "monthly_sms": 100,
        "api_calls_per_month": 10000,
        "storage_gb": 1
    }'::jsonb,
    
    -- Current Usage (updated via triggers)
    current_usage JSONB DEFAULT '{
        "restaurants": 0,
        "users": 0,
        "customers": 0,
        "menu_items": 0,
        "monthly_emails": 0,
        "monthly_sms": 0,
        "api_calls_this_month": 0,
        "storage_used_gb": 0
    }'::jsonb,
    
    -- Organization Settings
    settings JSONB DEFAULT '{
        "timezone": "UTC",
        "currency": "USD",
        "date_format": "MM/DD/YYYY",
        "time_format": "12h",
        "language": "en",
        "features": {
            "ai_insights": true,
            "bulk_communications": true,
            "advanced_analytics": false,
            "api_access": false,
            "white_label": false,
            "priority_support": false
        }
    }'::jsonb,
    
    -- Status & Metadata
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_step VARCHAR(50) DEFAULT 'welcome',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 2. USERS (Multi-tenant users with role-based access)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- User Identity
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    
    -- Authentication
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    
    -- Multi-Factor Authentication
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(255),
    backup_codes TEXT[], -- Encrypted backup codes
    
    -- Role & Permissions
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member', 'viewer')),
    permissions JSONB DEFAULT '[]'::jsonb, -- Additional granular permissions
    
    -- User Preferences
    preferences JSONB DEFAULT '{
        "theme": "light",
        "notifications": {
            "email": true,
            "push": true,
            "sms": false
        },
        "dashboard_layout": "default",
        "timezone": "UTC",
        "language": "en"
    }'::jsonb,
    
    -- Session Management
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    session_tokens TEXT[], -- Active session tokens
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'deleted')),
    invited_by UUID REFERENCES users(id),
    invitation_accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(organization_id, email) WHERE deleted_at IS NULL
);

-- =====================================================
-- 3. RESTAURANTS (Multi-tenant restaurant entities)
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Restaurant Identity
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL, -- URL-friendly identifier within org
    description TEXT,
    logo_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    
    -- Contact Information
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    
    -- Address Information
    address JSONB DEFAULT '{
        "street": null,
        "city": null,
        "state": null,
        "zip_code": null,
        "country": null,
        "coordinates": {"lat": null, "lng": null}
    }'::jsonb,
    
    -- Business Information
    cuisine_types TEXT[] DEFAULT '{}',
    price_range VARCHAR(10) CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
    capacity INTEGER,
    
    -- Operating Hours
    operating_hours JSONB DEFAULT '{
        "monday": {"open": "09:00", "close": "22:00", "closed": false},
        "tuesday": {"open": "09:00", "close": "22:00", "closed": false},
        "wednesday": {"open": "09:00", "close": "22:00", "closed": false},
        "thursday": {"open": "09:00", "close": "22:00", "closed": false},
        "friday": {"open": "09:00", "close": "23:00", "closed": false},
        "saturday": {"open": "09:00", "close": "23:00", "closed": false},
        "sunday": {"open": "10:00", "close": "21:00", "closed": false}
    }'::jsonb,
    
    -- Restaurant Settings
    settings JSONB DEFAULT '{
        "timezone": "UTC",
        "currency": "USD",
        "tax_rate": 0.08,
        "service_charge": 0.0,
        "auto_accept_orders": false,
        "order_preparation_time": 30,
        "delivery_radius_km": 5,
        "minimum_order_amount": 0
    }'::jsonb,
    
    -- Social Media & Online Presence
    social_media JSONB DEFAULT '{
        "facebook": null,
        "instagram": null,
        "twitter": null,
        "yelp": null,
        "google_business": null
    }'::jsonb,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'deleted')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(organization_id, slug) WHERE deleted_at IS NULL
);

-- =====================================================
-- 4. USER_RESTAURANT_ACCESS (User access to restaurants)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_restaurant_access (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Access Level
    access_level VARCHAR(20) DEFAULT 'full' CHECK (access_level IN ('full', 'read_only', 'limited')),
    permissions JSONB DEFAULT '[]'::jsonb, -- Specific permissions for this restaurant
    
    -- Timestamps
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES users(id),
    
    UNIQUE(user_id, restaurant_id)
);

-- =====================================================
-- 5. API_KEYS (API access management)
-- =====================================================
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Key Details
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE, -- Hashed API key
    key_prefix VARCHAR(20) NOT NULL, -- First few chars for identification
    
    -- Permissions & Scope
    scopes TEXT[] DEFAULT '{}', -- API scopes (read:customers, write:menu, etc.)
    restaurant_ids UUID[] DEFAULT '{}', -- Specific restaurants this key can access
    
    -- Usage Tracking
    last_used_at TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'revoked')),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. AUDIT_LOGS (System-wide audit trail)
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Actor Information
    user_id UUID REFERENCES users(id),
    api_key_id UUID REFERENCES api_keys(id),
    ip_address INET,
    user_agent TEXT,
    
    -- Action Details
    action VARCHAR(100) NOT NULL, -- create, update, delete, login, etc.
    resource_type VARCHAR(50) NOT NULL, -- user, restaurant, customer, etc.
    resource_id UUID,
    
    -- Change Details
    old_values JSONB,
    new_values JSONB,
    changes JSONB, -- Computed diff
    
    -- Context
    context JSONB DEFAULT '{}'::jsonb, -- Additional context data
    severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. USAGE_METRICS (Track usage for billing)
-- =====================================================
CREATE TABLE IF NOT EXISTS usage_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Metric Details
    metric_type VARCHAR(50) NOT NULL, -- emails_sent, sms_sent, api_calls, storage_used
    metric_value INTEGER NOT NULL DEFAULT 0,
    
    -- Time Period
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(organization_id, metric_type, period_start)
);

-- =====================================================
-- 8. NOTIFICATIONS (System notifications)
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Details
    type VARCHAR(50) NOT NULL, -- system, billing, feature, alert
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Notification Data
    data JSONB DEFAULT '{}'::jsonb,
    action_url VARCHAR(500),
    action_text VARCHAR(100),
    
    -- Status
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Delivery
    channels TEXT[] DEFAULT '{"in_app"}', -- in_app, email, sms, push
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 9. FEATURE_FLAGS (Feature management)
-- =====================================================
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Flag Details
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    flag_type VARCHAR(20) DEFAULT 'boolean' CHECK (flag_type IN ('boolean', 'string', 'number', 'json')),
    
    -- Default Values
    default_value JSONB NOT NULL,
    
    -- Targeting Rules
    targeting_rules JSONB DEFAULT '[]'::jsonb,
    
    -- Status
    enabled BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. ORGANIZATION_FEATURE_FLAGS (Org-specific overrides)
-- =====================================================
CREATE TABLE IF NOT EXISTS organization_feature_flags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    feature_flag_id UUID NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
    
    -- Override Value
    value JSONB NOT NULL,
    enabled BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(organization_id, feature_flag_id)
);

-- =====================================================
-- INDEXES FOR SAAS CORE SCHEMA
-- =====================================================

-- Organizations indexes
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);
CREATE INDEX IF NOT EXISTS idx_organizations_subscription ON organizations(subscription_plan, subscription_status);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(organization_id, role);

-- Restaurants indexes
CREATE INDEX IF NOT EXISTS idx_restaurants_organization ON restaurants(organization_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(organization_id, slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(organization_id, status);

-- User restaurant access indexes
CREATE INDEX IF NOT EXISTS idx_user_restaurant_access_user ON user_restaurant_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_restaurant_access_restaurant ON user_restaurant_access(restaurant_id);

-- API keys indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_organization ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(organization_id, status);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(organization_id, created_at);

-- Usage metrics indexes
CREATE INDEX IF NOT EXISTS idx_usage_metrics_organization ON usage_metrics(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_type ON usage_metrics(organization_id, metric_type);
CREATE INDEX IF NOT EXISTS idx_usage_metrics_period ON usage_metrics(organization_id, period_start, period_end);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_organization ON notifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(organization_id, created_at);

-- Feature flags indexes
CREATE INDEX IF NOT EXISTS idx_feature_flags_name ON feature_flags(name);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(enabled);

-- Organization feature flags indexes
CREATE INDEX IF NOT EXISTS idx_org_feature_flags_org ON organization_feature_flags(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_feature_flags_flag ON organization_feature_flags(feature_flag_id);

-- =====================================================
-- TRIGGERS FOR SAAS CORE SCHEMA
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
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON feature_flags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organization_feature_flags_updated_at BEFORE UPDATE ON organization_feature_flags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update organization usage metrics
CREATE OR REPLACE FUNCTION update_organization_usage()
RETURNS TRIGGER AS $$
BEGIN
    -- This will be implemented based on specific usage tracking needs
    -- For now, it's a placeholder for usage tracking logic
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- ROW LEVEL SECURITY (RLS) FOR MULTI-TENANCY
-- =====================================================

-- Enable RLS on all tenant-isolated tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_restaurant_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_feature_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant isolation
-- Organizations: Users can only see their own organization
CREATE POLICY organizations_isolation ON organizations FOR ALL 
USING (id = current_setting('app.current_organization_id', true)::uuid);

-- Users: Users can only see users in their organization
CREATE POLICY users_isolation ON users FOR ALL 
USING (organization_id = current_setting('app.current_organization_id', true)::uuid);

-- Restaurants: Users can only see restaurants in their organization
CREATE POLICY restaurants_isolation ON restaurants FOR ALL 
USING (organization_id = current_setting('app.current_organization_id', true)::uuid);

-- User restaurant access: Users can only see access records for their organization
CREATE POLICY user_restaurant_access_isolation ON user_restaurant_access FOR ALL 
USING (user_id IN (SELECT id FROM users WHERE organization_id = current_setting('app.current_organization_id', true)::uuid));

-- API keys: Users can only see API keys for their organization
CREATE POLICY api_keys_isolation ON api_keys FOR ALL 
USING (organization_id = current_setting('app.current_organization_id', true)::uuid);

-- Audit logs: Users can only see audit logs for their organization
CREATE POLICY audit_logs_isolation ON audit_logs FOR ALL 
USING (organization_id = current_setting('app.current_organization_id', true)::uuid);

-- Usage metrics: Users can only see usage metrics for their organization
CREATE POLICY usage_metrics_isolation ON usage_metrics FOR ALL 
USING (organization_id = current_setting('app.current_organization_id', true)::uuid);

-- Notifications: Users can only see notifications for their organization
CREATE POLICY notifications_isolation ON notifications FOR ALL 
USING (organization_id = current_setting('app.current_organization_id', true)::uuid);

-- Organization feature flags: Users can only see feature flags for their organization
CREATE POLICY organization_feature_flags_isolation ON organization_feature_flags FOR ALL 
USING (organization_id = current_setting('app.current_organization_id', true)::uuid);

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert default feature flags
INSERT INTO feature_flags (name, description, flag_type, default_value, enabled) VALUES
('ai_insights', 'Enable AI-powered customer insights and recommendations', 'boolean', 'true', true),
('bulk_communications', 'Enable bulk communication features', 'boolean', 'true', true),
('advanced_analytics', 'Enable advanced analytics and reporting', 'boolean', 'false', true),
('api_access', 'Enable API access for integrations', 'boolean', 'false', true),
('white_label', 'Enable white-label branding options', 'boolean', 'false', true),
('priority_support', 'Enable priority customer support', 'boolean', 'false', true),
('menu_ai_optimization', 'Enable AI-powered menu optimization', 'boolean', 'true', true),
('customer_segmentation', 'Enable advanced customer segmentation', 'boolean', 'true', true),
('automated_marketing', 'Enable automated marketing campaigns', 'boolean', 'false', true),
('multi_location', 'Enable multi-location restaurant management', 'boolean', 'false', true)
ON CONFLICT (name) DO NOTHING;
