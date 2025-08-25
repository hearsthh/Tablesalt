-- =====================================================
-- MENU MANAGEMENT SCHEMA
-- Comprehensive menu structure for restaurants
-- =====================================================

-- =====================================================
-- 1. MENU_CATEGORIES
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Category Information
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    description TEXT,
    
    -- Category Configuration
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Visual Settings
    image_url TEXT,
    icon VARCHAR(50),
    color_scheme JSONB DEFAULT '{
        "background": "#ffffff",
        "text": "#000000",
        "accent": "#ff6b35"
    }'::jsonb,
    
    -- Availability Settings
    availability_schedule JSONB DEFAULT '{
        "always_available": true,
        "time_restrictions": [],
        "day_restrictions": []
    }'::jsonb,
    
    -- SEO and Marketing
    seo_slug VARCHAR(100),
    marketing_tags TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, name),
    UNIQUE(restaurant_id, seo_slug)
);

-- =====================================================
-- 2. MENU_ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
    
    -- Basic Item Information
    name VARCHAR(200) NOT NULL,
    display_name VARCHAR(200),
    description TEXT,
    short_description VARCHAR(500),
    
    -- Pricing Information
    base_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2), -- For profit margin calculations
    currency VARCHAR(3) DEFAULT 'USD',
    price_variations JSONB DEFAULT '[]'::jsonb, -- [{size: "Large", price: 15.99}]
    
    -- Item Details
    preparation_time INTEGER, -- in minutes
    calories INTEGER,
    serving_size VARCHAR(50),
    spice_level INTEGER CHECK (spice_level >= 0 AND spice_level <= 5),
    
    -- Dietary and Allergen Information
    dietary_tags TEXT[] DEFAULT '{}', -- vegetarian, vegan, gluten-free, etc.
    allergens TEXT[] DEFAULT '{}', -- nuts, dairy, shellfish, etc.
    ingredients TEXT[] DEFAULT '{}',
    
    -- Nutritional Information
    nutrition_info JSONB DEFAULT '{
        "calories": null,
        "protein": null,
        "carbs": null,
        "fat": null,
        "fiber": null,
        "sugar": null,
        "sodium": null
    }'::jsonb,
    
    -- Visual Assets
    primary_image_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    
    -- Availability and Status
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    is_seasonal BOOLEAN DEFAULT false,
    
    -- Availability Schedule
    availability_schedule JSONB DEFAULT '{
        "always_available": true,
        "time_restrictions": [],
        "day_restrictions": [],
        "seasonal_start": null,
        "seasonal_end": null
    }'::jsonb,
    
    -- Ordering and Display
    sort_order INTEGER DEFAULT 0,
    
    -- AI-Generated Content
    ai_generated_description TEXT,
    ai_suggested_tags TEXT[] DEFAULT '{}',
    ai_pairing_suggestions TEXT[] DEFAULT '{}',
    ai_marketing_copy TEXT,
    ai_confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    
    -- Performance Metrics (cached)
    performance_metrics JSONB DEFAULT '{
        "total_orders": 0,
        "total_revenue": 0,
        "avg_rating": 0,
        "review_count": 0,
        "last_30_days": {
            "orders": 0,
            "revenue": 0
        }
    }'::jsonb,
    
    -- SEO and Marketing
    seo_slug VARCHAR(150),
    marketing_tags TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, name),
    UNIQUE(restaurant_id, seo_slug)
);

-- =====================================================
-- 3. MENU_ITEM_MODIFIERS
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_item_modifiers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    
    -- Modifier Information
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    description TEXT,
    
    -- Modifier Type
    modifier_type VARCHAR(20) NOT NULL CHECK (modifier_type IN ('required', 'optional', 'extra')),
    
    -- Pricing
    price_adjustment DECIMAL(10,2) DEFAULT 0, -- Can be negative for discounts
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    max_selections INTEGER DEFAULT 1,
    
    -- Ordering
    sort_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. MENU_COMBOS
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_combos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Combo Information
    name VARCHAR(200) NOT NULL,
    display_name VARCHAR(200),
    description TEXT,
    
    -- Pricing
    combo_price DECIMAL(10,2) NOT NULL,
    individual_total DECIMAL(10,2), -- Sum of individual item prices
    savings_amount DECIMAL(10,2), -- individual_total - combo_price
    savings_percentage DECIMAL(5,2),
    
    -- Visual Assets
    image_url TEXT,
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- AI Generation Info
    ai_generated BOOLEAN DEFAULT false,
    ai_confidence_score DECIMAL(3,2),
    ai_reasoning TEXT,
    
    -- Performance Metrics
    performance_metrics JSONB DEFAULT '{
        "total_orders": 0,
        "total_revenue": 0,
        "conversion_rate": 0,
        "avg_rating": 0
    }'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, name)
);

-- =====================================================
-- 5. MENU_COMBO_ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_combo_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    combo_id UUID NOT NULL REFERENCES menu_combos(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    
    -- Item Configuration in Combo
    quantity INTEGER DEFAULT 1,
    is_required BOOLEAN DEFAULT true,
    can_substitute BOOLEAN DEFAULT false,
    
    -- Ordering
    sort_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. MENU_TEMPLATES
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE, -- NULL for system templates
    
    -- Template Information
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    description TEXT,
    
    -- Template Type
    template_type VARCHAR(20) DEFAULT 'custom', -- system, custom, ai_generated
    cuisine_type VARCHAR(50),
    business_type VARCHAR(50),
    
    -- Template Configuration
    layout_config JSONB DEFAULT '{
        "columns": 2,
        "show_images": true,
        "show_prices": true,
        "show_descriptions": true,
        "color_scheme": "default",
        "font_family": "default"
    }'::jsonb,
    
    -- Visual Settings
    color_scheme JSONB DEFAULT '{
        "primary": "#000000",
        "secondary": "#666666",
        "accent": "#ff6b35",
        "background": "#ffffff"
    }'::jsonb,
    
    -- Template Assets
    preview_image_url TEXT,
    template_file_url TEXT,
    
    -- Usage and Popularity
    usage_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR MENU SCHEMA
-- =====================================================

-- Menu categories indexes
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant ON menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_active ON menu_categories(restaurant_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_menu_categories_sort ON menu_categories(restaurant_id, sort_order);

-- Menu items indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(restaurant_id, is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(restaurant_id, is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_menu_items_popular ON menu_items(restaurant_id, is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_menu_items_price ON menu_items(restaurant_id, base_price);
CREATE INDEX IF NOT EXISTS idx_menu_items_dietary ON menu_items USING GIN(dietary_tags);
CREATE INDEX IF NOT EXISTS idx_menu_items_allergens ON menu_items USING GIN(allergens);

-- Menu item modifiers indexes
CREATE INDEX IF NOT EXISTS idx_menu_modifiers_item ON menu_item_modifiers(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_modifiers_restaurant ON menu_item_modifiers(restaurant_id);

-- Menu combos indexes
CREATE INDEX IF NOT EXISTS idx_menu_combos_restaurant ON menu_combos(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_combos_available ON menu_combos(restaurant_id, is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_menu_combos_ai ON menu_combos(restaurant_id, ai_generated) WHERE ai_generated = true;

-- Menu combo items indexes
CREATE INDEX IF NOT EXISTS idx_combo_items_combo ON menu_combo_items(combo_id);
CREATE INDEX IF NOT EXISTS idx_combo_items_menu_item ON menu_combo_items(menu_item_id);

-- Menu templates indexes
CREATE INDEX IF NOT EXISTS idx_menu_templates_restaurant ON menu_templates(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_templates_type ON menu_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_menu_templates_cuisine ON menu_templates(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_menu_templates_usage ON menu_templates(usage_count DESC);

-- =====================================================
-- TRIGGERS FOR MENU SCHEMA
-- =====================================================

-- Apply updated_at triggers
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_item_modifiers_updated_at BEFORE UPDATE ON menu_item_modifiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_combos_updated_at BEFORE UPDATE ON menu_combos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_templates_updated_at BEFORE UPDATE ON menu_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY FOR MENU SCHEMA
-- =====================================================

-- Enable RLS
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_combo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY menu_categories_isolation ON menu_categories FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY menu_items_isolation ON menu_items FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY menu_modifiers_isolation ON menu_item_modifiers FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY menu_combos_isolation ON menu_combos FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY menu_combo_items_isolation ON menu_combo_items FOR ALL USING (combo_id IN (SELECT id FROM menu_combos WHERE restaurant_id = current_setting('app.current_restaurant_id', true)::uuid));
CREATE POLICY menu_templates_isolation ON menu_templates FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid OR restaurant_id IS NULL);
