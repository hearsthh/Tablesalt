-- =====================================================
-- INTEGRATIONS AND DATA SOURCES SCHEMA
-- Manage external integrations and data synchronization
-- =====================================================

-- =====================================================
-- 1. INTEGRATION_PROVIDERS
-- Master list of available integration providers
-- =====================================================
CREATE TABLE IF NOT EXISTS integration_providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    provider_type VARCHAR(30) NOT NULL CHECK (provider_type IN ('pos', 'review_platform', 'social_media', 'delivery', 'reservation', 'crm', 'email_marketing', 'analytics')),
    description TEXT,
    website_url TEXT,
    logo_url TEXT,
    
    -- API Configuration
    api_available BOOLEAN DEFAULT false,
    api_version VARCHAR(20),
    api_base_url TEXT,
    auth_type VARCHAR(20) CHECK (auth_type IN ('api_key', 'oauth2', 'basic_auth', 'webhook', 'manual')),
    
    -- Supported Features
    supported_data_types TEXT[] DEFAULT '{}', -- orders, customers, reviews, menu_items, analytics
    real_time_sync BOOLEAN DEFAULT false,
    webhook_support BOOLEAN DEFAULT false,
    
    -- Pricing and Limits
    is_premium BOOLEAN DEFAULT false,
    rate_limit_per_hour INTEGER,
    data_retention_days INTEGER,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_beta BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. RESTAURANT_INTEGRATIONS
-- Restaurant-specific integration configurations
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    provider_id INTEGER NOT NULL REFERENCES integration_providers(id),
    
    -- Integration Configuration
    integration_name VARCHAR(100), -- Custom name for this integration
    integration_status VARCHAR(20) DEFAULT 'disconnected' CHECK (integration_status IN ('disconnected', 'connecting', 'connected', 'error', 'suspended', 'expired')),
    
    -- Authentication
    auth_credentials JSONB DEFAULT '{}'::jsonb, -- Encrypted credentials
    auth_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Sync Configuration
    sync_enabled BOOLEAN DEFAULT true,
    sync_frequency VARCHAR(20) DEFAULT 'hourly' CHECK (sync_frequency IN ('real_time', 'every_15_min', 'hourly', 'daily', 'weekly', 'manual')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    next_sync_at TIMESTAMP WITH TIME ZONE,
    
    -- Data Mapping Configuration
    field_mappings JSONB DEFAULT '{}'::jsonb, -- Map external fields to internal fields
    data_filters JSONB DEFAULT '{}'::jsonb, -- Filters for what data to sync
    
    -- Sync Settings
    sync_settings JSONB DEFAULT '{
        "sync_historical_data": false,
        "historical_data_days": 90,
        "auto_create_customers": true,
        "auto_create_menu_items": false,
        "duplicate_handling": "skip",
        "error_handling": "log_and_continue"
    }'::jsonb,
    
    -- Performance Metrics
    total_records_synced INTEGER DEFAULT 0,
    last_sync_records INTEGER DEFAULT 0,
    sync_success_rate DECIMAL(5,2) DEFAULT 100.00,
    avg_sync_duration_seconds INTEGER DEFAULT 0,
    
    -- Error Tracking
    last_error_message TEXT,
    last_error_at TIMESTAMP WITH TIME ZONE,
    consecutive_errors INTEGER DEFAULT 0,
    
    -- Webhook Configuration
    webhook_url TEXT,
    webhook_secret VARCHAR(255),
    webhook_events TEXT[] DEFAULT '{}',
    
    -- Integration Metadata
    external_account_id VARCHAR(200),
    external_account_name VARCHAR(200),
    integration_version VARCHAR(20),
    
    -- Status Tracking
    connected_at TIMESTAMP WITH TIME ZONE,
    connected_by UUID REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, provider_id)
);

-- =====================================================
-- 3. INTEGRATION_SYNC_LOGS
-- Track all synchronization activities
-- =====================================================
CREATE TABLE IF NOT EXISTS integration_sync_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    integration_id UUID NOT NULL REFERENCES restaurant_integrations(id) ON DELETE CASCADE,
    
    -- Sync Details
    sync_type VARCHAR(30) NOT NULL CHECK (sync_type IN ('full', 'incremental', 'manual', 'webhook', 'retry')),
    sync_status VARCHAR(20) NOT NULL CHECK (sync_status IN ('started', 'in_progress', 'completed', 'failed', 'cancelled')),
    
    -- Sync Metrics
    records_processed INTEGER DEFAULT 0,
    records_created INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_skipped INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    
    -- Data Range
    sync_from_datetime TIMESTAMP WITH TIME ZONE,
    sync_to_datetime TIMESTAMP WITH TIME ZONE,
    
    -- Error Information
    error_message TEXT,
    error_details JSONB DEFAULT '{}'::jsonb,
    
    -- Sync Configuration Used
    sync_config JSONB DEFAULT '{}'::jsonb,
    
    -- API Usage
    api_calls_made INTEGER DEFAULT 0,
    api_rate_limit_hit BOOLEAN DEFAULT false,
    
    -- Data Quality
    data_quality_issues JSONB DEFAULT '[]'::jsonb, -- Array of issues found
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. INTEGRATION_DATA_MAPPINGS
-- Store field mappings between external and internal systems
-- =====================================================
CREATE TABLE IF NOT EXISTS integration_data_mappings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    integration_id UUID NOT NULL REFERENCES restaurant_integrations(id) ON DELETE CASCADE,
    
    -- Mapping Configuration
    data_type VARCHAR(50) NOT NULL, -- orders, customers, menu_items, reviews
    external_field VARCHAR(100) NOT NULL,
    internal_field VARCHAR(100) NOT NULL,
    
    -- Transformation Rules
    transformation_type VARCHAR(30) DEFAULT 'direct' CHECK (transformation_type IN ('direct', 'format', 'lookup', 'calculate', 'split', 'combine')),
    transformation_config JSONB DEFAULT '{}'::jsonb,
    
    -- Validation Rules
    validation_rules JSONB DEFAULT '{
        "required": false,
        "data_type": null,
        "min_length": null,
        "max_length": null,
        "pattern": null,
        "allowed_values": []
    }'::jsonb,
    
    -- Default Values
    default_value TEXT,
    fallback_value TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(integration_id, data_type, external_field, internal_field)
);

-- =====================================================
-- 5. INTEGRATION_WEBHOOKS
-- Manage incoming webhooks from integrated systems
-- =====================================================
CREATE TABLE IF NOT EXISTS integration_webhooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    integration_id UUID REFERENCES restaurant_integrations(id) ON DELETE CASCADE,
    
    -- Webhook Details
    webhook_event VARCHAR(100) NOT NULL,
    webhook_source VARCHAR(50) NOT NULL, -- Provider name
    external_id VARCHAR(200), -- External record ID
    
    -- Payload
    raw_payload JSONB NOT NULL,
    processed_payload JSONB DEFAULT '{}'::jsonb,
    
    -- Processing Status
    processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'processed', 'failed', 'ignored')),
    
    -- Processing Results
    created_records JSONB DEFAULT '[]'::jsonb, -- Array of created record IDs
    updated_records JSONB DEFAULT '[]'::jsonb, -- Array of updated record IDs
    processing_errors JSONB DEFAULT '[]'::jsonb,
    
    -- Webhook Metadata
    webhook_signature VARCHAR(500),
    webhook_timestamp TIMESTAMP WITH TIME ZONE,
    user_agent TEXT,
    ip_address INET,
    
    -- Processing Timing
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processing_duration_ms INTEGER,
    
    -- Retry Information
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. DATA_QUALITY_ISSUES
-- Track data quality issues from integrations
-- =====================================================
CREATE TABLE IF NOT EXISTS data_quality_issues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    integration_id UUID REFERENCES restaurant_integrations(id) ON DELETE CASCADE,
    sync_log_id UUID REFERENCES integration_sync_logs(id) ON DELETE CASCADE,
    
    -- Issue Details
    issue_type VARCHAR(50) NOT NULL, -- missing_required_field, invalid_format, duplicate_record, data_inconsistency
    issue_severity VARCHAR(20) DEFAULT 'medium' CHECK (issue_severity IN ('low', 'medium', 'high', 'critical')),
    issue_description TEXT NOT NULL,
    
    -- Affected Data
    data_type VARCHAR(50), -- orders, customers, menu_items
    external_record_id VARCHAR(200),
    internal_record_id UUID,
    field_name VARCHAR(100),
    
    -- Issue Context
    expected_value TEXT,
    actual_value TEXT,
    suggested_fix TEXT,
    
    -- Resolution
    issue_status VARCHAR(20) DEFAULT 'open' CHECK (issue_status IN ('open', 'investigating', 'resolved', 'ignored', 'wont_fix')),
    resolution_notes TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Impact Assessment
    impact_level VARCHAR(20) DEFAULT 'low' CHECK (impact_level IN ('none', 'low', 'medium', 'high', 'critical')),
    affected_records_count INTEGER DEFAULT 1,
    
    -- Timestamps
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR INTEGRATIONS SCHEMA
-- =====================================================

-- Integration providers indexes
CREATE INDEX IF NOT EXISTS idx_integration_providers_type ON integration_providers(provider_type);
CREATE INDEX IF NOT EXISTS idx_integration_providers_active ON integration_providers(is_active) WHERE is_active = true;

-- Restaurant integrations indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_integrations_restaurant ON restaurant_integrations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_integrations_provider ON restaurant_integrations(provider_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_integrations_status ON restaurant_integrations(restaurant_id, integration_status);
CREATE INDEX IF NOT EXISTS idx_restaurant_integrations_sync ON restaurant_integrations(next_sync_at) WHERE sync_enabled = true;

-- Integration sync logs indexes
CREATE INDEX IF NOT EXISTS idx_sync_logs_restaurant ON integration_sync_logs(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_integration ON integration_sync_logs(integration_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON integration_sync_logs(integration_id, sync_status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_started ON integration_sync_logs(integration_id, started_at);

-- Integration data mappings indexes
CREATE INDEX IF NOT EXISTS idx_data_mappings_integration ON integration_data_mappings(integration_id);
CREATE INDEX IF NOT EXISTS idx_data_mappings_type ON integration_data_mappings(integration_id, data_type);
CREATE INDEX IF NOT EXISTS idx_data_mappings_active ON integration_data_mappings(integration_id, is_active) WHERE is_active = true;

-- Integration webhooks indexes
CREATE INDEX IF NOT EXISTS idx_webhooks_restaurant ON integration_webhooks(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_integration ON integration_webhooks(integration_id) WHERE integration_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_webhooks_status ON integration_webhooks(restaurant_id, processing_status);
CREATE INDEX IF NOT EXISTS idx_webhooks_received ON integration_webhooks(restaurant_id, received_at);
CREATE INDEX IF NOT EXISTS idx_webhooks_retry ON integration_webhooks(next_retry_at) WHERE processing_status = 'failed' AND retry_count < max_retries;

-- Data quality issues indexes
CREATE INDEX IF NOT EXISTS idx_quality_issues_restaurant ON data_quality_issues(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_quality_issues_integration ON data_quality_issues(integration_id) WHERE integration_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_quality_issues_status ON data_quality_issues(restaurant_id, issue_status);
CREATE INDEX IF NOT EXISTS idx_quality_issues_severity ON data_quality_issues(restaurant_id, issue_severity);
CREATE INDEX IF NOT EXISTS idx_quality_issues_type ON data_quality_issues(restaurant_id, issue_type);

-- =====================================================
-- TRIGGERS FOR INTEGRATIONS SCHEMA
-- =====================================================

-- Apply updated_at triggers
CREATE TRIGGER update_integration_providers_updated_at BEFORE UPDATE ON integration_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_integrations_updated_at BEFORE UPDATE ON restaurant_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_data_mappings_updated_at BEFORE UPDATE ON integration_data_mappings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON integration_webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quality_issues_updated_at BEFORE UPDATE ON data_quality_issues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY FOR INTEGRATIONS SCHEMA
-- =====================================================

-- Enable RLS
ALTER TABLE integration_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_data_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_quality_issues ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY integration_providers_public ON integration_providers FOR SELECT USING (true); -- Public read access
CREATE POLICY restaurant_integrations_isolation ON restaurant_integrations FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY sync_logs_isolation ON integration_sync_logs FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY data_mappings_isolation ON integration_data_mappings FOR ALL USING (integration_id IN (SELECT id FROM restaurant_integrations WHERE restaurant_id = current_setting('app.current_restaurant_id', true)::uuid));
CREATE POLICY webhooks_isolation ON integration_webhooks FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY quality_issues_isolation ON data_quality_issues FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
