import { type NextRequest, NextResponse } from "next/server"
import { smsService } from "@/lib/integrations/sms-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, message, from } = body

    if (!to || !message) {
      return NextResponse.json({ error: "Missing required fields: to, message" }, { status: 400 })
    }

    const result = await smsService.sendSMS({
      to,
      message,
      from,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: "SMS sent successfully",
      })
    } else {
      return NextResponse.json({ error: result.error || "Failed to send SMS" }, { status: 500 })
    }
  } catch (error) {
    console.error("SMS send error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
