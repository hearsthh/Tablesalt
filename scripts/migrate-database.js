const { createClient } = require("@supabase/supabase-js")

async function migrateDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log("🚀 Starting database migration...")

  try {
    // Enable required extensions
    console.log("📦 Enabling extensions...")
    await supabase.rpc("exec_sql", {
      sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    })

    // Create restaurants table
    console.log("🏪 Creating restaurants table...")
    const { error: restaurantsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS restaurants (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          cuisine_type VARCHAR(100),
          phone VARCHAR(20),
          email VARCHAR(255),
          address TEXT,
          city VARCHAR(100),
          country VARCHAR(100),
          currency VARCHAR(3) DEFAULT 'USD',
          timezone VARCHAR(50) DEFAULT 'UTC',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (restaurantsError) throw restaurantsError

    // Create categories table
    console.log("📂 Creating categories table...")
    const { error: categoriesError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS categories (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (categoriesError) throw categoriesError

    // Create menu_items table
    console.log("🍽️ Creating menu_items table...")
    const { error: menuItemsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS menu_items (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
          category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          cost_price DECIMAL(10,2),
          image_url TEXT,
          dietary_tags TEXT[],
          allergens TEXT[],
          spice_level INTEGER DEFAULT 0,
          preparation_time INTEGER,
          calories INTEGER,
          protein DECIMAL(5,2),
          carbs DECIMAL(5,2),
          fat DECIMAL(5,2),
          fiber DECIMAL(5,2),
          variants JSONB,
          is_available BOOLEAN DEFAULT true,
          popularity_score INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (menuItemsError) throw menuItemsError

    // Create storage bucket for images
    console.log("🖼️ Setting up image storage...")
    const { error: bucketError } = await supabase.storage.createBucket("menu-images", {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      fileSizeLimit: 5242880, // 5MB
    })

    if (bucketError && !bucketError.message.includes("already exists")) {
      throw bucketError
    }

    console.log("✅ Database migration completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

if (require.main === module) {
  migrateDatabase()
}

module.exports = { migrateDatabase }
