import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // Test basic connection
    const result = await sql`SELECT NOW() as current_time, version() as postgres_version`

    // Test if our tables exist
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('restaurants', 'categories', 'menu_items')
    `

    return Response.json({
      success: true,
      message: "Postgres connection successful!",
      data: {
        currentTime: result.rows[0]?.current_time,
        version: result.rows[0]?.postgres_version,
        tables: tablesResult.rows.map((row) => row.table_name),
      },
    })
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error.message,
        details: "Failed to connect to Postgres database",
      },
      { status: 500 },
    )
  }
}
