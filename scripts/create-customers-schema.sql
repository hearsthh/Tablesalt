-- =====================================================
-- CUSTOMERS AND CRM SCHEMA
-- Comprehensive customer management and segmentation
-- =====================================================

-- =====================================================
-- 1. CUSTOMERS
-- =====================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Customer Identification
    customer_number VARCHAR(50), -- Restaurant's internal customer number
    external_customer_id VARCHAR(100), -- From POS or CRM system
    
    -- Personal Information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(200),
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    
    -- Contact Preferences
    preferred_contact_method VARCHAR(20) DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'sms', 'none')),
    email_marketing_consent BOOLEAN DEFAULT false,
    sms_marketing_consent BOOLEAN DEFAULT false,
    
    -- Address Information
    addresses JSONB DEFAULT '[]'::jsonb, -- Array of address objects
    primary_address JSONB DEFAULT '{
        "street": null,
        "city": null,
        "state": null,
        "zip_code": null,
        "country": null,
        "coordinates": {"lat": null, "lng": null}
    }'::jsonb,
    
    -- Customer Preferences
    dietary_preferences TEXT[] DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}',
    favorite_cuisines TEXT[] DEFAULT '{}',
    spice_preference INTEGER CHECK (spice_preference >= 0 AND spice_preference <= 5),
    
    -- Customer Status
    customer_status VARCHAR(20) DEFAULT 'active' CHECK (customer_status IN ('active', 'inactive', 'blocked', 'deleted')),
    customer_tier VARCHAR(20) DEFAULT 'regular' CHECK (customer_tier IN ('new', 'regular', 'vip', 'premium')),
    
    -- Loyalty Program
    loyalty_member BOOLEAN DEFAULT false,
    loyalty_number VARCHAR(50),
    loyalty_points INTEGER DEFAULT 0,
    loyalty_tier VARCHAR(20),
    loyalty_joined_date DATE,
    
    -- Customer Metrics (cached for performance)
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    last_order_date DATE,
    first_order_date DATE,
    
    -- Visit Frequency Analysis
    avg_days_between_visits DECIMAL(5,2),
    visit_frequency_category VARCHAR(20), -- frequent, regular, occasional, rare
    days_since_last_visit INTEGER,
    
    -- Customer Lifetime Value
    lifetime_value DECIMAL(12,2) DEFAULT 0,
    predicted_lifetime_value DECIMAL(12,2),
    customer_acquisition_cost DECIMAL(10,2),
    
    -- Behavioral Insights
    preferred_order_types TEXT[] DEFAULT '{}', -- dine_in, takeaway, delivery
    preferred_order_times JSONB DEFAULT '{
        "breakfast": false,
        "lunch": false,
        "dinner": false,
        "late_night": false
    }'::jsonb,
    favorite_items TEXT[] DEFAULT '{}',
    
    -- Segmentation (automatically calculated)
    current_segment VARCHAR(50), -- new, active, at_risk, churned, vip
    segment_last_calculated TIMESTAMP WITH TIME ZONE,
    rfm_score VARCHAR(3), -- e.g., "555" for Recency-Frequency-Monetary
    
    -- Customer Acquisition
    acquisition_source VARCHAR(50), -- organic, referral, marketing, social_media
    acquisition_campaign VARCHAR(100),
    referral_source VARCHAR(100),
    utm_parameters JSONB DEFAULT '{}'::jsonb,
    
    -- Social Media and Reviews
    social_media_handles JSONB DEFAULT '{
        "instagram": null,
        "facebook": null,
        "twitter": null
    }'::jsonb,
    review_count INTEGER DEFAULT 0,
    avg_review_rating DECIMAL(3,2),
    
    -- Data Source Information
    data_source VARCHAR(50) DEFAULT 'manual', -- manual, pos_import, api_sync, csv_import
    source_system VARCHAR(50), -- square, toast, hubspot, etc.
    imported_at TIMESTAMP WITH TIME ZONE,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    
    -- Privacy and Compliance
    gdpr_consent BOOLEAN DEFAULT false,
    gdpr_consent_date TIMESTAMP WITH TIME ZONE,
    data_retention_consent BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, customer_number) WHERE customer_number IS NOT NULL,
    UNIQUE(restaurant_id, external_customer_id) WHERE external_customer_id IS NOT NULL,
    UNIQUE(restaurant_id, email) WHERE email IS NOT NULL
);

-- =====================================================
-- 2. CUSTOMER_SEGMENTS_ASSIGNMENTS
-- Track which customers belong to which segments
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_segment_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    segment_id UUID NOT NULL REFERENCES customer_segments(id) ON DELETE CASCADE,
    
    -- Assignment Details
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by VARCHAR(50) DEFAULT 'system', -- system, manual, ai
    
    -- Segment Metrics at Time of Assignment
    segment_score DECIMAL(5,2), -- Relevance score for this segment
    confidence_level DECIMAL(3,2), -- 0.00 to 1.00
    
    -- Assignment Status
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(customer_id, segment_id, assigned_at)
);

-- =====================================================
-- 3. CUSTOMER_INTERACTIONS
-- Track all customer touchpoints and interactions
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Interaction Details
    interaction_type VARCHAR(50) NOT NULL, -- order, review, complaint, inquiry, marketing_response
    interaction_channel VARCHAR(50), -- phone, email, in_person, social_media, app
    interaction_source VARCHAR(50), -- staff, customer, system, ai
    
    -- Interaction Content
    subject VARCHAR(200),
    description TEXT,
    sentiment VARCHAR(20), -- positive, neutral, negative
    sentiment_score DECIMAL(3,2), -- -1.00 to 1.00
    
    -- Interaction Status
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Staff Assignment
    assigned_to VARCHAR(100),
    handled_by VARCHAR(100),
    
    -- Resolution Details
    resolution TEXT,
    resolution_time_minutes INTEGER,
    customer_satisfaction_rating INTEGER CHECK (customer_satisfaction_rating >= 1 AND customer_satisfaction_rating <= 5),
    
    -- Follow-up Information
    requires_follow_up BOOLEAN DEFAULT false,
    follow_up_date DATE,
    follow_up_notes TEXT,
    
    -- Related Records
    related_order_id UUID REFERENCES orders(id),
    related_review_id UUID, -- Will reference reviews table when created
    
    -- Timestamps
    interaction_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CUSTOMER_PREFERENCES
-- Detailed customer preferences and history
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Preference Category
    preference_type VARCHAR(50) NOT NULL, -- menu_item, cuisine, dietary, seating, timing
    preference_category VARCHAR(50),
    
    -- Preference Details
    preference_value VARCHAR(200) NOT NULL,
    preference_strength DECIMAL(3,2) DEFAULT 0.5, -- 0.00 to 1.00 (how strong the preference is)
    
    -- Learning Source
    learned_from VARCHAR(50), -- order_history, explicit_feedback, behavior_analysis, ai_inference
    confidence_score DECIMAL(3,2) DEFAULT 0.5, -- 0.00 to 1.00
    
    -- Usage Statistics
    times_observed INTEGER DEFAULT 1,
    last_observed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Preference Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(customer_id, preference_type, preference_value)
);

-- =====================================================
-- 5. CUSTOMER_ANALYTICS_DAILY
-- Daily customer analytics for reporting
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_analytics_daily (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Date Information
    date DATE NOT NULL,
    
    -- Customer Counts
    total_customers INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    returning_customers INTEGER DEFAULT 0,
    active_customers INTEGER DEFAULT 0, -- Customers who ordered
    
    -- Segment Breakdown
    segment_breakdown JSONB DEFAULT '{}'::jsonb, -- {new: 10, active: 50, at_risk: 5, churned: 2}
    
    -- Customer Behavior
    avg_order_frequency DECIMAL(5,2) DEFAULT 0,
    avg_customer_lifetime_value DECIMAL(10,2) DEFAULT 0,
    customer_retention_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Acquisition Metrics
    acquisition_cost DECIMAL(10,2) DEFAULT 0,
    acquisition_sources JSONB DEFAULT '{}'::jsonb, -- {organic: 5, referral: 3, marketing: 2}
    
    -- Engagement Metrics
    email_open_rate DECIMAL(5,2) DEFAULT 0,
    email_click_rate DECIMAL(5,2) DEFAULT 0,
    loyalty_program_signups INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, date)
);

-- =====================================================
-- INDEXES FOR CUSTOMERS SCHEMA
-- =====================================================

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_restaurant ON customers(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(restaurant_id, email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(restaurant_id, phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(restaurant_id, customer_status);
CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(restaurant_id, customer_tier);
CREATE INDEX IF NOT EXISTS idx_customers_segment ON customers(restaurant_id, current_segment);
CREATE INDEX IF NOT EXISTS idx_customers_last_order ON customers(restaurant_id, last_order_date);
CREATE INDEX IF NOT EXISTS idx_customers_total_spent ON customers(restaurant_id, total_spent DESC);
CREATE INDEX IF NOT EXISTS idx_customers_loyalty ON customers(restaurant_id, loyalty_member) WHERE loyalty_member = true;
CREATE INDEX IF NOT EXISTS idx_customers_visit_frequency ON customers(restaurant_id, visit_frequency_category);

-- Customer segment assignments indexes
CREATE INDEX IF NOT EXISTS idx_segment_assignments_customer ON customer_segment_assignments(customer_id);
CREATE INDEX IF NOT EXISTS idx_segment_assignments_segment ON customer_segment_assignments(segment_id);
CREATE INDEX IF NOT EXISTS idx_segment_assignments_active ON customer_segment_assignments(customer_id, is_active) WHERE is_active = true;

-- Customer interactions indexes
CREATE INDEX IF NOT EXISTS idx_interactions_customer ON customer_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_interactions_restaurant ON customer_interactions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON customer_interactions(restaurant_id, interaction_type);
CREATE INDEX IF NOT EXISTS idx_interactions_status ON customer_interactions(restaurant_id, status);
CREATE INDEX IF NOT EXISTS idx_interactions_datetime ON customer_interactions(restaurant_id, interaction_datetime);
CREATE INDEX IF NOT EXISTS idx_interactions_sentiment ON customer_interactions(restaurant_id, sentiment);

-- Customer preferences indexes
CREATE INDEX IF NOT EXISTS idx_preferences_customer ON customer_preferences(customer_id);
CREATE INDEX IF NOT EXISTS idx_preferences_type ON customer_preferences(customer_id, preference_type);
CREATE INDEX IF NOT EXISTS idx_preferences_active ON customer_preferences(customer_id, is_active) WHERE is_active = true;

-- Customer analytics daily indexes
CREATE INDEX IF NOT EXISTS idx_customer_analytics_restaurant ON customer_analytics_daily(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_customer_analytics_date ON customer_analytics_daily(restaurant_id, date);

-- =====================================================
-- TRIGGERS FOR CUSTOMERS SCHEMA
-- =====================================================

-- Apply updated_at triggers
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_interactions_updated_at BEFORE UPDATE ON customer_interactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_preferences_updated_at BEFORE UPDATE ON customer_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_analytics_updated_at BEFORE UPDATE ON customer_analytics_daily FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY FOR CUSTOMERS SCHEMA
-- =====================================================

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_segment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_analytics_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY customers_isolation ON customers FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY segment_assignments_isolation ON customer_segment_assignments FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY interactions_isolation ON customer_interactions FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY preferences_isolation ON customer_preferences FOR ALL USING (customer_id IN (SELECT id FROM customers WHERE restaurant_id = current_setting('app.current_restaurant_id', true)::uuid));
CREATE POLICY customer_analytics_isolation ON customer_analytics_daily FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
