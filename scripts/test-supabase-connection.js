import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("Testing Supabase connection...")
console.log("Supabase URL:", supabaseUrl ? "Set ✓" : "Missing ✗")
console.log("Service Role Key:", supabaseKey ? "Set ✓" : "Missing ✗")

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

try {
  // Test connection by checking if we can access the restaurants table
  const { data, error } = await supabase.from("restaurants").select("id, name").limit(1)

  if (error) {
    console.error("Connection failed:", error.message)
    console.log("This might mean the restaurants table doesn't exist yet")
    console.log("Let's check what tables exist...")

    // Try to list existing tables
    const { data: tables, error: tablesError } = await supabase.rpc("get_tables")
    if (!tablesError && tables) {
      console.log(
        "Existing tables:",
        tables.map((t) => t.table_name),
      )
    }
  } else {
    console.log("✅ Supabase connection successful!")
    console.log("Found restaurants:", data?.length || 0)
    console.log("Menu schema is ready to use!")
  }
} catch (err) {
  console.error("Connection test failed:", err.message)
}
