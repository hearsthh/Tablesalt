import { type NextRequest, NextResponse } from "next/server"
import { communicationService } from "@/lib/integrations/communication-service"

export async function POST(request: NextRequest) {
  try {
    const { recipients, content } = await request.json()

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ success: false, error: "Recipients array is required" }, { status: 400 })
    }

    if (!content || typeof content !== "object") {
      return NextResponse.json({ success: false, error: "Content object is required" }, { status: 400 })
    }

    const results = await communicationService.sendCampaign(recipients, content)

    // Calculate summary statistics
    const summary = results.map((channelResult) => ({
      channel: channelResult.channel,
      total: channelResult.results.length,
      successful: channelResult.results.filter((r) => r.success).length,
      failed: channelResult.results.filter((r) => !r.success).length,
    }))

    return NextResponse.json({
      success: true,
      results,
      summary,
    })
  } catch (error) {
    console.error("Campaign API error:", error)
    return NextResponse.json({ success: false, error: "Failed to send campaign" }, { status: 500 })
  }
}
