-- =====================================================
-- ORDERS AND SALES DATA SCHEMA
-- Comprehensive order management and sales analytics
-- =====================================================

-- =====================================================
-- 1. ORDERS
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Order Identification
    order_number VARCHAR(50) NOT NULL, -- Restaurant's internal order number
    external_order_id VARCHAR(100), -- POS system or delivery platform order ID
    
    -- Customer Information
    customer_id UUID, -- Will reference customers table when created
    customer_name VARCHAR(200),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    
    -- Order Details
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('dine_in', 'takeaway', 'delivery', 'catering')),
    order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled', 'refunded')),
    
    -- Timing Information
    order_date DATE NOT NULL,
    order_time TIME NOT NULL,
    order_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_ready_time TIMESTAMP WITH TIME ZONE,
    actual_ready_time TIMESTAMP WITH TIME ZONE,
    delivered_time TIMESTAMP WITH TIME ZONE,
    
    -- Financial Information
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    tip_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    service_fee DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Payment Information
    payment_method VARCHAR(50), -- cash, card, mobile, online
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partial')),
    payment_reference VARCHAR(100),
    
    -- Delivery Information (for delivery orders)
    delivery_address JSONB DEFAULT '{
        "street": null,
        "city": null,
        "state": null,
        "zip_code": null,
        "coordinates": {"lat": null, "lng": null},
        "delivery_instructions": null
    }'::jsonb,
    delivery_distance_km DECIMAL(5,2),
    delivery_driver VARCHAR(100),
    
    -- Source Information
    order_source VARCHAR(50), -- pos, website, app, phone, delivery_platform
    platform_name VARCHAR(50), -- uber_eats, doordash, grubhub, etc.
    platform_order_id VARCHAR(100),
    platform_fee DECIMAL(10,2) DEFAULT 0,
    
    -- Special Instructions and Notes
    special_instructions TEXT,
    kitchen_notes TEXT,
    staff_notes TEXT,
    
    -- Promotional Information
    promo_code VARCHAR(50),
    discount_type VARCHAR(20), -- percentage, fixed_amount, free_item
    discount_reason VARCHAR(100),
    
    -- Table Information (for dine-in orders)
    table_number VARCHAR(20),
    party_size INTEGER,
    server_name VARCHAR(100),
    
    -- Order Metrics
    preparation_time_minutes INTEGER, -- Actual time taken to prepare
    wait_time_minutes INTEGER, -- Time customer waited
    
    -- Data Source Information
    data_source VARCHAR(50) DEFAULT 'manual', -- manual, pos_import, api_sync, csv_import
    source_system VARCHAR(50), -- square, toast, petpooja, etc.
    imported_at TIMESTAMP WITH TIME ZONE,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, order_number),
    UNIQUE(restaurant_id, external_order_id) WHERE external_order_id IS NOT NULL
);

-- =====================================================
-- 2. ORDER_ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
    
    -- Item Information
    item_name VARCHAR(200) NOT NULL, -- Stored for historical accuracy
    item_description TEXT,
    category_name VARCHAR(100),
    
    -- Quantity and Pricing
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Item Customizations
    modifiers JSONB DEFAULT '[]'::jsonb, -- [{name: "Extra Cheese", price: 2.00}]
    special_instructions TEXT,
    
    -- Item Status
    item_status VARCHAR(20) DEFAULT 'ordered' CHECK (item_status IN ('ordered', 'preparing', 'ready', 'served', 'cancelled')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. SALES_ANALYTICS_DAILY
-- Daily aggregated sales data for fast querying
-- =====================================================
CREATE TABLE IF NOT EXISTS sales_analytics_daily (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Date Information
    date DATE NOT NULL,
    day_of_week INTEGER NOT NULL, -- 1=Monday, 7=Sunday
    week_of_year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    quarter INTEGER NOT NULL,
    year INTEGER NOT NULL,
    
    -- Order Metrics
    total_orders INTEGER DEFAULT 0,
    dine_in_orders INTEGER DEFAULT 0,
    takeaway_orders INTEGER DEFAULT 0,
    delivery_orders INTEGER DEFAULT 0,
    catering_orders INTEGER DEFAULT 0,
    cancelled_orders INTEGER DEFAULT 0,
    
    -- Revenue Metrics
    total_revenue DECIMAL(12,2) DEFAULT 0,
    dine_in_revenue DECIMAL(12,2) DEFAULT 0,
    takeaway_revenue DECIMAL(12,2) DEFAULT 0,
    delivery_revenue DECIMAL(12,2) DEFAULT 0,
    catering_revenue DECIMAL(12,2) DEFAULT 0,
    
    -- Financial Breakdown
    subtotal DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    tip_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    delivery_fees DECIMAL(12,2) DEFAULT 0,
    platform_fees DECIMAL(12,2) DEFAULT 0,
    
    -- Average Metrics
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    avg_party_size DECIMAL(5,2) DEFAULT 0,
    avg_preparation_time DECIMAL(5,2) DEFAULT 0,
    
    -- Customer Metrics
    unique_customers INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    returning_customers INTEGER DEFAULT 0,
    
    -- Payment Method Breakdown
    cash_orders INTEGER DEFAULT 0,
    card_orders INTEGER DEFAULT 0,
    mobile_payment_orders INTEGER DEFAULT 0,
    cash_revenue DECIMAL(12,2) DEFAULT 0,
    card_revenue DECIMAL(12,2) DEFAULT 0,
    mobile_payment_revenue DECIMAL(12,2) DEFAULT 0,
    
    -- Platform Breakdown
    platform_breakdown JSONB DEFAULT '{}'::jsonb, -- {uber_eats: {orders: 10, revenue: 250.00}}
    
    -- Peak Hours Analysis
    peak_hour INTEGER, -- Hour with most orders (0-23)
    peak_hour_orders INTEGER DEFAULT 0,
    peak_hour_revenue DECIMAL(10,2) DEFAULT 0,
    
    -- Weather and External Factors (can be populated later)
    weather_condition VARCHAR(50),
    temperature_celsius DECIMAL(4,1),
    is_holiday BOOLEAN DEFAULT false,
    special_events TEXT[] DEFAULT '{}',
    
    -- Data Quality
    data_completeness_score DECIMAL(3,2) DEFAULT 1.00, -- 0.00 to 1.00
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, date)
);

-- =====================================================
-- 4. SALES_ANALYTICS_HOURLY
-- Hourly sales data for detailed analysis
-- =====================================================
CREATE TABLE IF NOT EXISTS sales_analytics_hourly (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Time Information
    date DATE NOT NULL,
    hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
    datetime_hour TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Order Metrics
    total_orders INTEGER DEFAULT 0,
    dine_in_orders INTEGER DEFAULT 0,
    takeaway_orders INTEGER DEFAULT 0,
    delivery_orders INTEGER DEFAULT 0,
    
    -- Revenue Metrics
    total_revenue DECIMAL(10,2) DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    
    -- Operational Metrics
    avg_preparation_time DECIMAL(5,2) DEFAULT 0,
    avg_wait_time DECIMAL(5,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, date, hour)
);

-- =====================================================
-- 5. MENU_ITEM_PERFORMANCE
-- Track performance of individual menu items
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_item_performance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    
    -- Time Period
    date DATE NOT NULL,
    
    -- Item Information (stored for historical accuracy)
    item_name VARCHAR(200) NOT NULL,
    category_name VARCHAR(100),
    
    -- Performance Metrics
    total_orders INTEGER DEFAULT 0,
    total_quantity INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    avg_unit_price DECIMAL(10,2) DEFAULT 0,
    
    -- Ranking Metrics
    popularity_rank INTEGER, -- Rank by quantity sold
    revenue_rank INTEGER, -- Rank by revenue generated
    
    -- Order Type Breakdown
    dine_in_quantity INTEGER DEFAULT 0,
    takeaway_quantity INTEGER DEFAULT 0,
    delivery_quantity INTEGER DEFAULT 0,
    
    -- Time-based Analysis
    peak_hour INTEGER, -- Hour when this item sells most
    peak_hour_quantity INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(restaurant_id, menu_item_id, date)
);

-- =====================================================
-- INDEXES FOR ORDERS AND SALES SCHEMA
-- =====================================================

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(restaurant_id, order_date);
CREATE INDEX IF NOT EXISTS idx_orders_datetime ON orders(restaurant_id, order_datetime);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(restaurant_id, order_type);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(restaurant_id, order_status);
CREATE INDEX IF NOT EXISTS idx_orders_source ON orders(restaurant_id, order_source);
CREATE INDEX IF NOT EXISTS idx_orders_platform ON orders(restaurant_id, platform_name);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_total ON orders(restaurant_id, total_amount);
CREATE INDEX IF NOT EXISTS idx_orders_external_id ON orders(external_order_id) WHERE external_order_id IS NOT NULL;

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item ON order_items(menu_item_id) WHERE menu_item_id IS NOT NULL;

-- Sales analytics daily indexes
CREATE INDEX IF NOT EXISTS idx_sales_daily_restaurant ON sales_analytics_daily(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_sales_daily_date ON sales_analytics_daily(restaurant_id, date);
CREATE INDEX IF NOT EXISTS idx_sales_daily_month ON sales_analytics_daily(restaurant_id, year, month);
CREATE INDEX IF NOT EXISTS idx_sales_daily_quarter ON sales_analytics_daily(restaurant_id, year, quarter);
CREATE INDEX IF NOT EXISTS idx_sales_daily_dow ON sales_analytics_daily(restaurant_id, day_of_week);

-- Sales analytics hourly indexes
CREATE INDEX IF NOT EXISTS idx_sales_hourly_restaurant ON sales_analytics_hourly(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_sales_hourly_datetime ON sales_analytics_hourly(restaurant_id, datetime_hour);
CREATE INDEX IF NOT EXISTS idx_sales_hourly_date_hour ON sales_analytics_hourly(restaurant_id, date, hour);

-- Menu item performance indexes
CREATE INDEX IF NOT EXISTS idx_menu_performance_restaurant ON menu_item_performance(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_performance_item ON menu_item_performance(menu_item_id) WHERE menu_item_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_menu_performance_date ON menu_item_performance(restaurant_id, date);
CREATE INDEX IF NOT EXISTS idx_menu_performance_popularity ON menu_item_performance(restaurant_id, date, popularity_rank);
CREATE INDEX IF NOT EXISTS idx_menu_performance_revenue ON menu_item_performance(restaurant_id, date, revenue_rank);

-- =====================================================
-- TRIGGERS FOR ORDERS AND SALES SCHEMA
-- =====================================================

-- Apply updated_at triggers
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_daily_updated_at BEFORE UPDATE ON sales_analytics_daily FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_hourly_updated_at BEFORE UPDATE ON sales_analytics_hourly FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_performance_updated_at BEFORE UPDATE ON menu_item_performance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY FOR ORDERS AND SALES SCHEMA
-- =====================================================

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_analytics_hourly ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY orders_isolation ON orders FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY order_items_isolation ON order_items FOR ALL USING (order_id IN (SELECT id FROM orders WHERE restaurant_id = current_setting('app.current_restaurant_id', true)::uuid));
CREATE POLICY sales_daily_isolation ON sales_analytics_daily FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY sales_hourly_isolation ON sales_analytics_hourly FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
CREATE POLICY menu_performance_isolation ON menu_item_performance FOR ALL USING (restaurant_id = current_setting('app.current_restaurant_id', true)::uuid);
