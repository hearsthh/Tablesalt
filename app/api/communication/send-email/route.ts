import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/integrations/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html, text, templateId, templateData, from } = body

    if (!to || (!subject && !templateId)) {
      return NextResponse.json(
        { error: "Missing required fields: to, and either subject or templateId" },
        { status: 400 },
      )
    }

    const result = await emailService.sendEmail({
      to,
      from: from || process.env.DEFAULT_FROM_EMAIL || "noreply@tablesalt.ai",
      subject: subject || "",
      html: html || "",
      text,
      templateId,
      templateData,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: "Email sent successfully",
      })
    } else {
      return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
