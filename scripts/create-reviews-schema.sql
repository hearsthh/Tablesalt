-- =====================================================
-- REVIEWS AND REPUTATION MANAGEMENT SCHEMA
-- Comprehensive review management and sentiment analysis
-- =====================================================

-- =====================================================
-- 1. REVIEW_PLATFORMS
-- Master list of review platforms
-- =====================================================
CREATE TABLE IF NOT EXISTS review_platforms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    website_url TEXT,
    api_available BOOLEAN DEFAULT false,
    logo_url TEXT,
    platform_type VARCHAR(20) DEFAULT 'review' CHECK (platform_type IN ('review', 'social', 'delivery', 'reservation')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. REVIEWS
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    platform_id INTEGER REFERENCES review_platforms(id),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Review Identification
    external_review_id VARCHAR(200), -- Platform's review ID
    review_url TEXT,
    
    -- Reviewer Information
    reviewer_name VARCHAR(200),
    reviewer_profile_url TEXT,
    reviewer_avatar_url TEXT,
    reviewer_location VARCHAR(100),
    is_verified_reviewer BOOLEAN DEFAULT false,
    reviewer_total_reviews INTEGER, -- How many reviews this person has written
    
    -- Review Content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(500),
    review_text TEXT,
    review_language VARCHAR(10) DEFAULT 'en',
    
    -- Review Metadata
    review_date DATE NOT NULL,
    review_datetime TIMESTAMP WITH TIME ZONE,
    
    -- Sentiment Analysis
    sentiment VARCHAR(20), -- positive, neutral, negative
    sentiment_score DECIMAL(4,3), -- -1.000 to 1.000
    sentiment_confidence DECIMAL(3,2), -- 0.00 to 1.00
    
    -- AI Analysis
    ai_summary TEXT,
    key_topics TEXT[] DEFAULT '{}', -- food_quality, service, ambiance, value
    mentioned_items TEXT[] DEFAULT '{}', -- Menu items mentioned
    mentioned_staff TEXT[] DEFAULT '{}', -- Staff members mentioned
    
    -- Review Classification
    review_category VARCHAR(50), -- complaint, compliment, suggestion, question
    is_fake_review BOOLEAN DEFAULT false,
    fake_review_confidence DECIMAL(3,2),
    
    -- Response Information
    has_response BOOLEAN DEFAULT false,
    response_text TEXT,
    response_date DATE,
    response_datetime TIMESTAMP WITH TIME ZONE,
    responded_by VARCHAR(100),
    response_sentiment VARCHAR(20),
    
    -- AI Response Suggestions
    ai_suggested_response TEXT,
    ai_response_tone VARCHAR(20), -- professional, friendly, apologetic, grateful
    ai_response_confidence DECIMAL(3,2),
    
    -- Review Impact
    helpfulness_votes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    
    -- Associated Order
    related_order_id UUID REFERENCES orders(id),
    visit_date DATE,
    
    -- Review Status
    review_status VARCHAR(20) DEFAULT 'published' CHECK (review_status IN ('published', 'pending', 'hidden', 'removed', 'flagged')),
    moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
    
    -- Data Source Information
    data_source VARCHAR(50) DEFAULT 'manual', -- manual, api_sync, scraping, csv_import
    imported_at TIMESTAMP WITH TIME ZONE,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, platform_id, external_review_id) WHERE external_review_id IS NOT NULL
);

-- =====================================================
-- 3. REVIEW_ANALYTICS_DAILY
-- Daily aggregated review data
-- =====================================================
CREATE TABLE IF NOT EXISTS review_analytics_daily (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Date Information
    date DATE NOT NULL,
    
    -- Review Volume
    total_reviews INTEGER DEFAULT 0,
    new_reviews INTEGER DEFAULT 0,
    
    -- Rating Distribution
    rating_1_count INTEGER DEFAULT 0,
    rating_2_count INTEGER DEFAULT 0,
    rating_3_count INTEGER DEFAULT 0,
    rating_4_count INTEGER DEFAULT 0,
    rating_5_count INTEGER DEFAULT 0,
    
    -- Average Ratings
    avg_rating DECIMAL(3,2) DEFAULT 0,
    weighted_avg_rating DECIMAL(3,2) DEFAULT 0, -- Weighted by platform importance
    
    -- Platform Breakdown
    platform_breakdown JSONB DEFAULT '{}'::jsonb, -- {google: {count: 5, avg_rating: 4.2}}
    
    -- Sentiment Analysis
    positive_reviews INTEGER DEFAULT 0,
    neutral_reviews INTEGER DEFAULT 0,
    negative_reviews INTEGER DEFAULT 0,
    avg_sentiment_score DECIMAL(4,3) DEFAULT 0,
    
    -- Response Metrics
    total_responses INTEGER DEFAULT 0,
    response_rate DECIMAL(5,2) DEFAULT 0,
    avg_response_time_hours DECIMAL(8,2) DEFAULT 0,
    
    -- Topic Analysis
    top_positive_topics TEXT[] DEFAULT '{}',
    top_negative_topics TEXT[] DEFAULT '{}',
    mentioned_items JSONB DEFAULT '{}'::jsonb, -- {item_name: mention_count}
    
    -- Review Quality
    verified_reviews INTEGER DEFAULT 0,
    suspected_fake_reviews INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, date)
);

-- =====================================================
-- 4. REVIEW_TOPICS
-- Track topics and themes mentioned in reviews
-- =====================================================
CREATE TABLE IF NOT EXISTS review_topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    
    -- Topic Information
    topic_category VARCHAR(50) NOT NULL, -- food_quality, service, ambiance, value, cleanliness
    topic_name VARCHAR(100) NOT NULL,
    topic_sentiment VARCHAR(20), -- positive, neutral, negative
    topic_score DECIMAL(4,3), -- -1.000 to 1.000
    
    -- Context
    mentioned_text TEXT, -- The actual text where this topic was mentioned
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    
    -- AI Analysis
    extracted_by VARCHAR(20) DEFAULT 'ai', -- ai, manual, hybrid
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. REVIEW_RESPONSES
-- Track all responses to reviews
-- =====================================================
CREATE TABLE IF NOT EXISTS review_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    
    -- Response Details
    response_text TEXT NOT NULL,
    response_type VARCHAR(20) DEFAULT 'manual' CHECK (response_type IN ('manual', 'ai_generated', 'template', 'hybrid')),
    
    -- Response Metadata
    responded_by VARCHAR(100),
    response_tone VARCHAR(20), -- professional, friendly, apologetic, grateful
    response_language VARCHAR(10) DEFAULT 'en',
    
    -- AI Information (if AI-generated)
    ai_model_used VARCHAR(50),
    ai_confidence_score DECIMAL(3,2),
    human_edited BOOLEAN DEFAULT false,
    
    -- Response Status
    response_status VARCHAR(20) DEFAULT 'published' CHECK (response_status IN ('draft', 'pending', 'published', 'deleted')),
    
    -- Performance Metrics
    customer_reaction VARCHAR(20), -- positive, neutral, negative, no_reaction
    follow_up_review BOOLEAN DEFAULT false,
    
    -- Timestamps
    response_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. REVIEW_IMPROVEMENT_ACTIONS
-- Track actions taken based on review feedback
-- =====================================================
CREATE TABLE IF NOT EXISTS review_improvement_actions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Action Details
    action_title VARCHAR(200) NOT NULL,
    action_description TEXT,
    action_category VARCHAR(50), -- menu, service, ambiance, operations, staff_training
    
    -- Related Reviews
    related_review_ids UUID[] DEFAULT '{}', -- Array of review IDs that triggered this action
    common_complaint VARCHAR(200),
    
    -- Action Status
    action_status VARCHAR(20) DEFAULT 'planned' CHECK (action_status IN ('planned', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Assignment
    assigned_to VARCHAR(100),
    department VARCHAR(50),
    
    -- Timeline
    planned_start_date DATE,
    planned_completion_date DATE,
    actual_start_date DATE,
    actual_completion_date DATE,
    
    -- Budget and Resources
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    resources_required TEXT,
    
    -- Success Metrics
    success_criteria TEXT,
    impact_measurement TEXT,
    before_rating DECIMAL(3,2),
    after_rating DECIMAL(3,2),
    
    -- Follow-up
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    follow_up_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR REVIEWS SCHEMA
-- =====================================================

-- Review platforms indexes
CREATE INDEX IF NOT EXISTS idx_review_platforms_active ON review_platforms(is_active) WHERE is_active = true;

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_platform ON reviews(restaurant_id, platform_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON reviews(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(restaurant_id, review_date);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(restaurant_id, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON reviews(restaurant_id, sentiment);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(restaurant_id, review_status);
CREATE INDEX IF NOT EXISTS idx_reviews_response ON reviews(restaurant_id, has_response);
CREATE INDEX IF NOT EXISTS idx_reviews_external_id ON reviews(platform_id, external_review_id) WHERE external_review_id IS NOT NULL;

-- Review analytics daily indexes
CREATE INDEX IF NOT EXISTS idx_review_analytics_restaurant ON review_analytics_daily(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_review_analytics_date ON review_analytics_daily(restaurant_id, date);

-- Review topics indexes
CREATE INDEX IF NOT EXISTS idx_review_topics_review ON review_topics(review_id);
CREATE INDEX IF NOT EXISTS idx_review_topics_restaurant ON review_topics(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_review_topics_category ON review_topics(restaurant_id, topic_category);
CREATE INDEX IF NOT EXISTS idx_review_topics_sentiment ON review_topics(restaurant_id, topic_sentiment);

-- Review responses indexes
CREATE INDEX IF NOT EXISTS idx_review_responses_review ON review_responses(review_id);
CREATE INDEX IF NOT EXISTS idx_review_responses_type ON review_responses(response_type);
CREATE INDEX IF NOT EXISTS idx_review_responses_status ON review_responses(response_status);

-- Review improvement actions indexes
CREATE INDEX IF NOT EXISTS idx_improvement_actions_restaurant ON review_improvement_actions(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_improvement_actions_status ON review_improvement_actions(restaurant_id, action_status);
CREATE INDEX IF NOT EXISTS idx_improvement_actions_category ON review_improvement_actions(restaurant_id, action_category);
CREATE INDEX IF NOT EXISTS idx_improvement_actions_priority ON review_improvement_actions(restaurant_id, priority);

-- =====================================================
-- TRIGGERS FOR REVIEWS SCHEMA
-- =====================================================

-- Apply updated_at triggers
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_review_analytics_updated_at BEFORE UPDATE ON review_analytics_daily FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_review_responses_updated_at BEFORE UPDATE ON review_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_improvement_actions_updated_at BEFORE UPDATE ON review_improvement_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY FOR REVIEWS SCHEMA
-- =====================================================

-- Enable RLS
ALTER TABLE review_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_improvement_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY review_platforms_public ON review_platforms FOR SELECT USING (true); -- Public read access
CREATE POLICY reviews_isolation ON reviews FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY review_analytics_isolation ON review_analytics_daily FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY review_topics_isolation ON review_topics FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY review_responses_isolation ON review_responses FOR ALL USING (review_id IN (SELECT id FROM reviews WHERE restaurant_id = current_setting('app.current_restaurant_id', true)::uuid));
CREATE POLICY improvement_actions_isolation ON review_improvement_actions FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
