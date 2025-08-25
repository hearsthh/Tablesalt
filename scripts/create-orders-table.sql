-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    pos_system VARCHAR(50) NOT NULL, -- 'square', 'toast', 'petpooja'
    pos_order_id VARCHAR(100),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    order_type VARCHAR(20) NOT NULL, -- 'dine_in', 'takeaway', 'delivery'
    order_status VARCHAR(20) NOT NULL, -- 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50), -- 'cash', 'card', 'upi', 'wallet'
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    table_number VARCHAR(10),
    delivery_address TEXT,
    special_instructions TEXT,
    order_date TIMESTAMP NOT NULL,
    estimated_ready_time TIMESTAMP,
    actual_ready_time TIMESTAMP,
    delivery_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    item_category VARCHAR(100),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    modifications TEXT, -- JSON string of modifications
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_analytics table for aggregated data
CREATE TABLE IF NOT EXISTS order_analytics (
    id SERIAL PRIMARY KEY,
    pos_system VARCHAR(50) NOT NULL,
    date_range VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    dine_in_orders INTEGER DEFAULT 0,
    dine_in_revenue DECIMAL(12,2) DEFAULT 0,
    takeaway_orders INTEGER DEFAULT 0,
    takeaway_revenue DECIMAL(12,2) DEFAULT 0,
    delivery_orders INTEGER DEFAULT 0,
    delivery_revenue DECIMAL(12,2) DEFAULT 0,
    peak_hour_start TIME,
    peak_hour_end TIME,
    peak_hour_orders INTEGER DEFAULT 0,
    top_selling_items TEXT, -- JSON array of top items
    payment_methods TEXT, -- JSON object with payment method breakdown
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_pos_system ON orders(pos_system);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(order_type);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_category ON order_items(item_category);
CREATE INDEX IF NOT EXISTS idx_order_analytics_pos_system ON order_analytics(pos_system);
CREATE INDEX IF NOT EXISTS idx_order_analytics_period ON order_analytics(period_start, period_end);
