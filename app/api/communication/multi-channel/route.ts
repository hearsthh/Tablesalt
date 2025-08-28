import { type NextRequest, NextResponse } from "next/server"
import { communicationService } from "@/lib/integrations/communication-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Missing required field: messages (array)" }, { status: 400 })
    }

    // Validate each message
    for (const msg of messages) {
      if (!msg.channel || !msg.recipient || !msg.content?.message) {
        return NextResponse.json(
          { error: "Each message must have 'channel', 'recipient', and 'content.message' fields" },
          { status: 400 },
        )
      }
    }

    const results = await communicationService.sendMultiChannelMessage(messages)

    const successful = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: messages.length,
        successful,
        failed,
      },
      message: `Multi-channel messaging completed: ${successful} successful, ${failed} failed`,
    })
  } catch (error) {
    console.error("Multi-channel messaging error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
