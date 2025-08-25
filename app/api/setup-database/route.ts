import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const DATABASE_SCHEMA = `
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cuisine_type TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT REFERENCES restaurants(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_order_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT REFERENCES restaurants(id),
  customer_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  platform TEXT,
  sentiment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT REFERENCES restaurants(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category TEXT,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own restaurants" ON restaurants FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can manage own restaurants" ON restaurants FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Users can view own restaurant customers" ON customers FOR SELECT USING (
  restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = auth.uid())
);

CREATE POLICY "Users can view own restaurant reviews" ON reviews FOR SELECT USING (
  restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = auth.uid())
);

CREATE POLICY "Users can view own restaurant menu items" ON menu_items FOR SELECT USING (
  restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = auth.uid())
);
`

const SAMPLE_DATA = `
-- Insert sample restaurant (will be updated with real user data)
INSERT INTO restaurants (id, name, description, cuisine_type, address, phone, email, website, owner_id)
VALUES (
  'rest_001',
  'Demo Restaurant',
  'A sample restaurant for testing',
  'Multi-cuisine',
  '123 Demo Street, Demo City',
  '+1-234-567-8900',
  'demo@restaurant.com',
  'https://demo-restaurant.com',
  auth.uid()
) ON CONFLICT (id) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (id, restaurant_id, name, email, phone, total_orders, total_spent, last_order_date)
VALUES 
  ('cust_001', 'rest_001', 'John Smith', 'john@example.com', '+1-234-567-8901', 15, 450.75, NOW() - INTERVAL '2 days'),
  ('cust_002', 'rest_001', 'Sarah Johnson', 'sarah@example.com', '+1-234-567-8902', 8, 280.50, NOW() - INTERVAL '1 week')
ON CONFLICT (id) DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (id, restaurant_id, customer_name, rating, comment, platform, sentiment)
VALUES 
  ('rev_001', 'rest_001', 'John Smith', 5, 'Amazing food and great service!', 'Google', 'positive'),
  ('rev_002', 'rest_001', 'Sarah Johnson', 4, 'Good food, could improve delivery time', 'Yelp', 'neutral')
ON CONFLICT (id) DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (id, restaurant_id, name, description, price, category, available)
VALUES 
  ('menu_001', 'rest_001', 'Margherita Pizza', 'Classic pizza with tomato sauce and mozzarella', 12.99, 'Pizza', true),
  ('menu_002', 'rest_001', 'Caesar Salad', 'Fresh romaine lettuce with caesar dressing', 8.99, 'Salads', true)
ON CONFLICT (id) DO NOTHING;
`

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    const supabase = createClient()

    if (action === "create-schema") {
      const { error } = await supabase.rpc("exec_sql", { sql: DATABASE_SCHEMA })
      if (error) throw error

      return NextResponse.json({ success: true, message: "Database schema created" })
    }

    if (action === "seed-data") {
      const { error } = await supabase.rpc("exec_sql", { sql: SAMPLE_DATA })
      if (error) throw error

      return NextResponse.json({ success: true, message: "Sample data added" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json({ error: "Database setup failed" }, { status: 500 })
  }
}
