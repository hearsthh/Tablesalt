const { createClient } = require("@supabase/supabase-js")

async function seedDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log("🌱 Starting database seeding...")

  try {
    // Insert sample restaurant
    console.log("🏪 Creating sample restaurant...")
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .insert({
        name: "Tablesalt Demo Restaurant",
        description: "AI-powered restaurant management demo",
        cuisine_type: "International",
        phone: "+1234567890",
        email: "demo@tablesalt.ai",
        address: "123 Demo Street",
        city: "San Francisco",
        country: "USA",
      })
      .select()
      .single()

    if (restaurantError) throw restaurantError

    // Insert sample categories
    console.log("📂 Creating sample categories...")
    const categories = [
      { name: "Appetizers", description: "Start your meal right", display_order: 0 },
      { name: "Main Course", description: "Hearty main dishes", display_order: 1 },
      { name: "Desserts", description: "Sweet endings", display_order: 2 },
    ]

    const { data: createdCategories, error: categoriesError } = await supabase
      .from("categories")
      .insert(
        categories.map((cat) => ({
          ...cat,
          restaurant_id: restaurant.id,
        })),
      )
      .select()

    if (categoriesError) throw categoriesError

    // Insert sample menu items
    console.log("🍽️ Creating sample menu items...")
    const menuItems = [
      {
        name: "Caesar Salad",
        description: "Crisp romaine lettuce with parmesan and croutons",
        price: 12.99,
        cost_price: 4.5,
        category_id: createdCategories.find((c) => c.name === "Appetizers").id,
        dietary_tags: ["Vegetarian"],
        allergens: ["Dairy", "Eggs"],
        preparation_time: 10,
        calories: 250,
      },
      {
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon with herbs and lemon",
        price: 24.99,
        cost_price: 12.0,
        category_id: createdCategories.find((c) => c.name === "Main Course").id,
        dietary_tags: ["Gluten-Free", "Healthy"],
        allergens: ["Fish"],
        preparation_time: 20,
        calories: 350,
      },
      {
        name: "Chocolate Cake",
        description: "Rich chocolate cake with vanilla ice cream",
        price: 8.99,
        cost_price: 3.0,
        category_id: createdCategories.find((c) => c.name === "Desserts").id,
        dietary_tags: ["Vegetarian"],
        allergens: ["Dairy", "Eggs", "Wheat"],
        preparation_time: 5,
        calories: 450,
      },
    ]

    const { error: menuItemsError } = await supabase.from("menu_items").insert(
      menuItems.map((item) => ({
        ...item,
        restaurant_id: restaurant.id,
      })),
    )

    if (menuItemsError) throw menuItemsError

    console.log("✅ Database seeding completed successfully!")
    console.log(`📊 Created: 1 restaurant, ${categories.length} categories, ${menuItems.length} menu items`)
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  }
}

if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase }
