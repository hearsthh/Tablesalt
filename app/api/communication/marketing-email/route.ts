import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/integrations/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html, text } = body

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields: to, subject, html" }, { status: 400 })
    }

    const result = await emailService.sendMarketingEmail(to, subject, html, text)

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: "Marketing email sent successfully",
      })
    } else {
      return NextResponse.json({ error: result.error || "Failed to send marketing email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Marketing email error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
