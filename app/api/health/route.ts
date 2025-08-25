import { NextResponse } from "next/server"
import { ProductionMonitor } from "@/lib/monitoring"

export async function GET() {
  try {
    const health = await ProductionMonitor.healthCheck()

    return NextResponse.json(health, {
      status: health.status === "healthy" ? 200 : 503,
    })
  } catch (error) {
    ProductionMonitor.logError(error as Error, { endpoint: "/api/health" })

    return NextResponse.json({ status: "unhealthy", error: "Health check failed" }, { status: 503 })
  }
}
