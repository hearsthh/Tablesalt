import { type NextRequest, NextResponse } from "next/server"
import { analyticsService } from "@/lib/integrations/analytics-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, properties, userId, restaurantId } = body

    if (!event) {
      return NextResponse.json({ error: "Event name is required" }, { status: 400 })
    }

    await analyticsService.track({
      event,
      properties: properties || {},
      userId,
      restaurantId,
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true, message: "Event tracked successfully" })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
