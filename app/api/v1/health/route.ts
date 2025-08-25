import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface HealthCheck {
  service: string
  status: "healthy" | "unhealthy" | "degraded"
  message: string
  responseTime?: number
  details?: any
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const checks: HealthCheck[] = []

  const envCheck: HealthCheck = {
    service: "Environment Variables",
    status: "healthy",
    message: "All required environment variables are set",
  }

  const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"]

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])
  if (missingVars.length > 0) {
    envCheck.status = "unhealthy"
    envCheck.message = `Missing environment variables: ${missingVars.join(", ")}`
    envCheck.details = { missingVars }
  }
  checks.push(envCheck)

  const dbStartTime = Date.now()
  const dbCheck: HealthCheck = {
    service: "Database",
    status: "healthy",
    message: "Database connection successful",
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("restaurants").select("count(*)").limit(1)

    if (error) {
      dbCheck.status = "unhealthy"
      dbCheck.message = `Database error: ${error.message}`
      dbCheck.details = { error }
    } else {
      dbCheck.responseTime = Date.now() - dbStartTime
      dbCheck.details = { restaurantCount: data?.[0]?.count || 0 }
    }
  } catch (error) {
    dbCheck.status = "unhealthy"
    dbCheck.message = `Database connection failed: ${error}`
    dbCheck.details = { error: String(error) }
  }
  checks.push(dbCheck)

  const integrationStartTime = Date.now()
  const integrationCheck: HealthCheck = {
    service: "Integration Providers",
    status: "healthy",
    message: "Integration providers available",
  }

  try {
    const supabase = createClient()
    const { data: providers, error } = await supabase
      .from("integration_providers")
      .select("name, display_name, api_available, demo_available")

    if (error) {
      integrationCheck.status = "unhealthy"
      integrationCheck.message = `Integration providers error: ${error.message}`
    } else {
      integrationCheck.responseTime = Date.now() - integrationStartTime
      integrationCheck.details = {
        totalProviders: providers?.length || 0,
        apiAvailable: providers?.filter((p) => p.api_available).length || 0,
        demoAvailable: providers?.filter((p) => p.demo_available).length || 0,
        providers: providers?.map((p) => p.name) || [],
      }
    }
  } catch (error) {
    integrationCheck.status = "unhealthy"
    integrationCheck.message = `Integration providers check failed: ${error}`
  }
  checks.push(integrationCheck)

  const apiCheck: HealthCheck = {
    service: "API Endpoints",
    status: "healthy",
    message: "Core API endpoints responding",
  }

  try {
    // Test internal API endpoint
    const baseUrl = request.nextUrl.origin
    const testResponse = await fetch(`${baseUrl}/api/v1/dashboard/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!testResponse.ok) {
      apiCheck.status = "degraded"
      apiCheck.message = `API endpoint returned ${testResponse.status}`
    }
  } catch (error) {
    apiCheck.status = "unhealthy"
    apiCheck.message = `API endpoint check failed: ${error}`
  }
  checks.push(apiCheck)

  const overallStatus = checks.every((check) => check.status === "healthy")
    ? "healthy"
    : checks.some((check) => check.status === "unhealthy")
      ? "unhealthy"
      : "degraded"

  const totalResponseTime = Date.now() - startTime

  const healthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    responseTime: totalResponseTime,
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    checks,
    summary: {
      total: checks.length,
      healthy: checks.filter((c) => c.status === "healthy").length,
      degraded: checks.filter((c) => c.status === "degraded").length,
      unhealthy: checks.filter((c) => c.status === "unhealthy").length,
    },
  }

  const statusCode = overallStatus === "healthy" ? 200 : overallStatus === "degraded" ? 200 : 503

  return NextResponse.json(healthResponse, { status: statusCode })
}
