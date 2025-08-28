import { type NextRequest, NextResponse } from "next/server"
import { smsService } from "@/lib/integrations/sms-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Missing required field: messages (array)" }, { status: 400 })
    }

    // Validate each message
    for (const msg of messages) {
      if (!msg.to || !msg.message) {
        return NextResponse.json({ error: "Each message must have 'to' and 'message' fields" }, { status: 400 })
      }
    }

    const results = await smsService.sendBulkSMS(messages)

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
      message: `Bulk SMS completed: ${successful} successful, ${failed} failed`,
    })
  } catch (error) {
    console.error("Bulk SMS error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
