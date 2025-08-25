import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function initializeDatabase() {
  console.log("🚀 Initializing Tablesalt AI database...")

  try {
    // Create profiles table
    const { error: profilesError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          avatar_url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
        CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
        CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
      `,
    })

    if (profilesError) throw profilesError

    // Create restaurants table
    const { error: restaurantsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS restaurants (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          description TEXT,
          cuisine_type TEXT,
          address TEXT,
          phone TEXT,
          email TEXT,
          website TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view own restaurants" ON restaurants FOR SELECT USING (auth.uid() = owner_id);
        CREATE POLICY "Users can update own restaurants" ON restaurants FOR UPDATE USING (auth.uid() = owner_id);
        CREATE POLICY "Users can insert own restaurants" ON restaurants FOR INSERT WITH CHECK (auth.uid() = owner_id);
        CREATE POLICY "Users can delete own restaurants" ON restaurants FOR DELETE USING (auth.uid() = owner_id);
      `,
    })

    if (restaurantsError) throw restaurantsError

    // Create customers table
    const { error: customersError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS customers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          total_orders INTEGER DEFAULT 0,
          total_spent DECIMAL(10,2) DEFAULT 0,
          last_order_date TIMESTAMPTZ,
          customer_segment TEXT DEFAULT 'new',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view customers of their restaurants" ON customers FOR SELECT 
        USING (restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = auth.uid()));
        
        CREATE POLICY "Users can manage customers of their restaurants" ON customers FOR ALL 
        USING (restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = auth.uid()));
      `,
    })

    if (customersError) throw customersError

    // Create reviews table
    const { error: reviewsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
          customer_name TEXT NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          review_text TEXT,
          platform TEXT DEFAULT 'direct',
          sentiment TEXT,
          ai_response TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view reviews of their restaurants" ON reviews FOR SELECT 
        USING (restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = auth.uid()));
        
        CREATE POLICY "Users can manage reviews of their restaurants" ON reviews FOR ALL 
        USING (restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = auth.uid()));
      `,
    })

    if (reviewsError) throw reviewsError

    console.log("✅ Database initialized successfully!")
    console.log("📊 Created tables: profiles, restaurants, customers, reviews")
    console.log("🔒 Row Level Security enabled on all tables")
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    process.exit(1)
  }
}

initializeDatabase()
