console.log("=== Environment Variables Check ===")
console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "Available" : "Missing")
console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Available" : "Missing")
console.log("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY ? "Available" : "Missing")
console.log("POSTGRES_URL:", process.env.POSTGRES_URL ? "Available" : "Missing")

// List all environment variables that start with SUPABASE or POSTGRES
console.log("\n=== All Supabase/Postgres Variables ===")
Object.keys(process.env)
  .filter((key) => key.includes("SUPABASE") || key.includes("POSTGRES"))
  .forEach((key) => {
    console.log(`${key}: ${process.env[key] ? "Set" : "Not set"}`)
  })
