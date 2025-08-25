-- =====================================================
-- MARKETING AND CAMPAIGNS SCHEMA
-- Comprehensive marketing automation and campaign management
-- =====================================================

-- =====================================================
-- 1. MARKETING_CHANNELS
-- Master list of marketing channels
-- =====================================================
CREATE TABLE IF NOT EXISTS marketing_channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    channel_type VARCHAR(20) NOT NULL CHECK (channel_type IN ('social', 'email', 'sms', 'paid_ads', 'content', 'referral', 'direct')),
    platform_name VARCHAR(50), -- facebook, instagram, google, mailchimp
    is_active BOOLEAN DEFAULT true,
    setup_required BOOLEAN DEFAULT false,
    api_available BOOLEAN DEFAULT false,
    cost_per_action DECIMAL(8,2), -- Average cost per click/impression
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. MARKETING_CAMPAIGNS
-- =====================================================
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Campaign Basic Information
    campaign_name VARCHAR(200) NOT NULL,
    campaign_description TEXT,
    campaign_type VARCHAR(50) NOT NULL, -- promotion, awareness, retention, acquisition, seasonal
    campaign_objective VARCHAR(100), -- increase_orders, drive_traffic, promote_menu_item, customer_retention
    
    -- Campaign Status
    campaign_status VARCHAR(20) DEFAULT 'draft' CHECK (campaign_status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),
    
    -- Campaign Timeline
    start_date DATE NOT NULL,
      'completed', 'cancelled')),
    
    -- Campaign Timeline
    start_date DATE NOT NULL,
    end_date DATE,
    created_date DATE DEFAULT CURRENT_DATE,
    
    -- Target Audience
    target_segments UUID[] DEFAULT '{}', -- Array of customer segment IDs
    target_criteria JSONB DEFAULT '{
        "age_range": null,
        "location": null,
        "order_frequency": null,
        "spending_range": null,
        "last_visit_days": null
    }'::jsonb,
    estimated_reach INTEGER,
    
    -- Campaign Budget
    total_budget DECIMAL(10,2),
    spent_budget DECIMAL(10,2) DEFAULT 0,
    cost_per_acquisition DECIMAL(8,2),
    
    -- Campaign Content
    campaign_message TEXT,
    call_to_action VARCHAR(200),
    offer_details JSONB DEFAULT '{
        "discount_type": null,
        "discount_value": null,
        "promo_code": null,
        "minimum_order": null,
        "valid_until": null
    }'::jsonb,
    
    -- Creative Assets
    creative_assets JSONB DEFAULT '{
        "images": [],
        "videos": [],
        "copy_variations": []
    }'::jsonb,
    
    -- Channel Configuration
    channels JSONB DEFAULT '[]'::jsonb, -- [{channel_id: 1, budget: 100, status: "active"}]
    
    -- AI Generation Info
    ai_generated BOOLEAN DEFAULT false,
    ai_optimization_enabled BOOLEAN DEFAULT false,
    ai_suggestions JSONB DEFAULT '{}'::jsonb,
    
    -- Performance Tracking
    performance_metrics JSONB DEFAULT '{
        "impressions": 0,
        "clicks": 0,
        "conversions": 0,
        "revenue": 0,
        "roi": 0,
        "engagement_rate": 0
    }'::jsonb,
    
    -- Attribution Settings
    attribution_window_days INTEGER DEFAULT 7,
    utm_parameters JSONB DEFAULT '{
        "utm_source": null,
        "utm_medium": null,
        "utm_campaign": null,
        "utm_term": null,
        "utm_content": null
    }'::jsonb,
    
    -- Campaign Creator
    created_by UUID REFERENCES users(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, campaign_name)
);

-- =====================================================
-- 3. MARKETING_ACTIVITIES
-- Individual marketing activities within campaigns
-- =====================================================
CREATE TABLE IF NOT EXISTS marketing_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
    channel_id INTEGER REFERENCES marketing_channels(id),
    
    -- Activity Details
    activity_name VARCHAR(200) NOT NULL,
    activity_type VARCHAR(50) NOT NULL, -- post, email, ad, sms, content
    activity_status VARCHAR(20) DEFAULT 'draft' CHECK (activity_status IN ('draft', 'scheduled', 'published', 'paused', 'completed', 'failed')),
    
    -- Content
    content_title VARCHAR(300),
    content_body TEXT,
    content_assets JSONB DEFAULT '{
        "images": [],
        "videos": [],
        "links": []
    }'::jsonb,
    
    -- Scheduling
    scheduled_datetime TIMESTAMP WITH TIME ZONE,
    published_datetime TIMESTAMP WITH TIME ZONE,
    
    -- Targeting
    target_audience JSONB DEFAULT '{}'::jsonb,
    estimated_reach INTEGER,
    
    -- Budget
    allocated_budget DECIMAL(8,2),
    actual_spend DECIMAL(8,2) DEFAULT 0,
    
    -- Performance Metrics
    performance_metrics JSONB DEFAULT '{
        "impressions": 0,
        "clicks": 0,
        "likes": 0,
        "shares": 0,
        "comments": 0,
        "saves": 0,
        "conversions": 0,
        "revenue": 0
    }'::jsonb,
    
    -- Platform-Specific Data
    platform_post_id VARCHAR(200), -- ID from social media platform
    platform_metrics JSONB DEFAULT '{}'::jsonb,
    
    -- AI Information
    ai_generated_content BOOLEAN DEFAULT false,
    ai_optimization_applied BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. MARKETING_AUTOMATION_RULES
-- Automated marketing rules and triggers
-- =====================================================
CREATE TABLE IF NOT EXISTS marketing_automation_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Rule Configuration
    rule_name VARCHAR(200) NOT NULL,
    rule_description TEXT,
    rule_type VARCHAR(50) NOT NULL, -- welcome, birthday, win_back, loyalty, review_follow_up
    
    -- Trigger Conditions
    trigger_event VARCHAR(50) NOT NULL, -- customer_signup, order_placed, no_visit_30_days, birthday
    trigger_conditions JSONB DEFAULT '{}'::jsonb,
    
    -- Target Criteria
    target_segments UUID[] DEFAULT '{}',
    additional_filters JSONB DEFAULT '{}'::jsonb,
    
    -- Action Configuration
    action_type VARCHAR(50) NOT NULL, -- send_email, send_sms, create_offer, add_to_segment
    action_config JSONB DEFAULT '{}'::jsonb,
    
    -- Content Template
    message_template TEXT,
    subject_template VARCHAR(300),
    offer_template JSONB DEFAULT '{}'::jsonb,
    
    -- Timing and Frequency
    delay_hours INTEGER DEFAULT 0, -- Delay after trigger
    frequency_limit VARCHAR(50) DEFAULT 'once', -- once, daily, weekly, monthly
    cooldown_days INTEGER DEFAULT 0, -- Days between same rule executions for same customer
    
    -- Rule Status
    is_active BOOLEAN DEFAULT true,
    
    -- Performance Tracking
    total_triggered INTEGER DEFAULT 0,
    total_sent INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    total_converted INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, rule_name)
);

-- =====================================================
-- 5. MARKETING_AUTOMATION_EXECUTIONS
-- Track individual executions of automation rules
-- =====================================================
CREATE TABLE IF NOT EXISTS marketing_automation_executions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    rule_id UUID NOT NULL REFERENCES marketing_automation_rules(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Execution Details
    trigger_event_data JSONB DEFAULT '{}'::jsonb,
    execution_status VARCHAR(20) DEFAULT 'pending' CHECK (execution_status IN ('pending', 'processing', 'sent', 'failed', 'skipped')),
    
    -- Content Used
    final_message TEXT,
    final_subject VARCHAR(300),
    personalization_data JSONB DEFAULT '{}'::jsonb,
    
    -- Delivery Information
    delivery_channel VARCHAR(50), -- email, sms, push, in_app
    delivery_address VARCHAR(255), -- email address or phone number
    
    -- Performance Tracking
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    converted_at TIMESTAMP WITH TIME ZONE,
    conversion_value DECIMAL(10,2),
    
    -- Error Handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Timestamps
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. CONTENT_CALENDAR
-- Marketing content calendar and planning
-- =====================================================
CREATE TABLE IF NOT EXISTS content_calendar (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Content Details
    content_title VARCHAR(300) NOT NULL,
    content_description TEXT,
    content_type VARCHAR(50) NOT NULL, -- social_post, blog_article, email, promotion, event
    content_category VARCHAR(50), -- menu_highlight, behind_scenes, customer_story, seasonal
    
    -- Scheduling
    planned_date DATE NOT NULL,
    planned_time TIME,
    actual_publish_datetime TIMESTAMP WITH TIME ZONE,
    
    -- Content Status
    content_status VARCHAR(20) DEFAULT 'planned' CHECK (content_status IN ('planned', 'in_progress', 'review', 'approved', 'published', 'cancelled')),
    
    -- Channel Assignment
    target_channels INTEGER[] DEFAULT '{}', -- Array of marketing_channels.id
    
    -- Content Assets
    content_assets JSONB DEFAULT '{
        "images": [],
        "videos": [],
        "copy": null,
        "hashtags": [],
        "mentions": []
    }'::jsonb,
    
    -- Campaign Association
    campaign_id UUID REFERENCES marketing_campaigns(id),
    
    -- AI Assistance
    ai_generated_suggestions JSONB DEFAULT '{}'::jsonb,
    ai_content_score DECIMAL(3,2), -- 0.00 to 1.00
    
    -- Approval Workflow
    created_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Performance Expectations
    expected_reach INTEGER,
    expected_engagement INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. MARKETING_ANALYTICS_DAILY
-- Daily marketing performance analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS marketing_analytics_daily (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Date Information
    date DATE NOT NULL,
    
    -- Overall Marketing Metrics
    total_spend DECIMAL(10,2) DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    
    -- Channel Performance
    channel_performance JSONB DEFAULT '{}'::jsonb, -- {email: {spend: 50, clicks: 100, conversions: 5}}
    
    -- Campaign Performance
    active_campaigns INTEGER DEFAULT 0,
    campaign_performance JSONB DEFAULT '{}'::jsonb,
    
    -- Customer Acquisition
    new_customers_acquired INTEGER DEFAULT 0,
    acquisition_cost DECIMAL(10,2) DEFAULT 0,
    customer_lifetime_value DECIMAL(10,2) DEFAULT 0,
    
    -- Engagement Metrics
    email_open_rate DECIMAL(5,2) DEFAULT 0,
    email_click_rate DECIMAL(5,2) DEFAULT 0,
    social_engagement_rate DECIMAL(5,2) DEFAULT 0,
    
    -- ROI Metrics
    return_on_ad_spend DECIMAL(8,2) DEFAULT 0,
    cost_per_acquisition DECIMAL(8,2) DEFAULT 0,
    cost_per_click DECIMAL(6,2) DEFAULT 0,
    
    -- Attribution Analysis
    attribution_breakdown JSONB DEFAULT '{}'::jsonb, -- {first_touch: 40%, last_touch: 60%}
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, date)
);

-- =====================================================
-- INDEXES FOR MARKETING SCHEMA
-- =====================================================

-- Marketing channels indexes
CREATE INDEX IF NOT EXISTS idx_marketing_channels_active ON marketing_channels(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_marketing_channels_type ON marketing_channels(channel_type);

-- Marketing campaigns indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_restaurant ON marketing_campaigns(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON marketing_campaigns(restaurant_id, campaign_status);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON marketing_campaigns(restaurant_id, campaign_type);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON marketing_campaigns(restaurant_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_ai ON marketing_campaigns(restaurant_id, ai_generated) WHERE ai_generated = true;

-- Marketing activities indexes
CREATE INDEX IF NOT EXISTS idx_activities_restaurant ON marketing_activities(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_activities_campaign ON marketing_activities(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_activities_channel ON marketing_activities(channel_id) WHERE channel_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_activities_status ON marketing_activities(restaurant_id, activity_status);
CREATE INDEX IF NOT EXISTS idx_activities_scheduled ON marketing_activities(restaurant_id, scheduled_datetime);

-- Marketing automation rules indexes
CREATE INDEX IF NOT EXISTS idx_automation_rules_restaurant ON marketing_automation_rules(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_automation_rules_active ON marketing_automation_rules(restaurant_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_automation_rules_type ON marketing_automation_rules(restaurant_id, rule_type);

-- Marketing automation executions indexes
CREATE INDEX IF NOT EXISTS idx_automation_executions_restaurant ON marketing_automation_executions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_automation_executions_rule ON marketing_automation_executions(rule_id);
CREATE INDEX IF NOT EXISTS idx_automation_executions_customer ON marketing_automation_executions(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_automation_executions_status ON marketing_automation_executions(restaurant_id, execution_status);
CREATE INDEX IF NOT EXISTS idx_automation_executions_triggered ON marketing_automation_executions(restaurant_id, triggered_at);

-- Content calendar indexes
CREATE INDEX IF NOT EXISTS idx_content_calendar_restaurant ON content_calendar(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_date ON content_calendar(restaurant_id, planned_date);
CREATE INDEX IF NOT EXISTS idx_content_calendar_status ON content_calendar(restaurant_id, content_status);
CREATE INDEX IF NOT EXISTS idx_content_calendar_campaign ON content_calendar(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_content_calendar_assigned ON content_calendar(assigned_to) WHERE assigned_to IS NOT NULL;

-- Marketing analytics daily indexes
CREATE INDEX IF NOT EXISTS idx_marketing_analytics_restaurant ON marketing_analytics_daily(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_marketing_analytics_date ON marketing_analytics_daily(restaurant_id, date);

-- =====================================================
-- TRIGGERS FOR MARKETING SCHEMA
-- =====================================================

-- Apply updated_at triggers
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON marketing_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_rules_updated_at BEFORE UPDATE ON marketing_automation_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_executions_updated_at BEFORE UPDATE ON marketing_automation_executions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_calendar_updated_at BEFORE UPDATE ON content_calendar FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_analytics_updated_at BEFORE UPDATE ON marketing_analytics_daily FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY FOR MARKETING SCHEMA
-- =====================================================

-- Enable RLS
ALTER TABLE marketing_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_automation_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_analytics_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY marketing_channels_public ON marketing_channels FOR SELECT USING (true); -- Public read access
CREATE POLICY campaigns_isolation ON marketing_campaigns FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY activities_isolation ON marketing_activities FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY automation_rules_isolation ON marketing_automation_rules FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY automation_executions_isolation ON marketing_automation_executions FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY content_calendar_isolation ON content_calendar FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY marketing_analytics_isolation ON marketing_analytics_daily FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
