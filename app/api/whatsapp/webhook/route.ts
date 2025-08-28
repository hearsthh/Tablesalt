import { type NextRequest, NextResponse } from "next/server"
import { socialMediaConfig } from "@/lib/integrations/social-media-config"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  // Webhook verification for WhatsApp
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  if (mode === "subscribe" && token === socialMediaConfig.whatsapp.webhookVerifyToken) {
    return new Response(challenge, { status: 200 })
  }

  return new Response("Forbidden", { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Process WhatsApp webhook events
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === "messages") {
            await processWhatsAppMessage(change.value)
          }
        }
      }
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("WhatsApp webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function processWhatsAppMessage(messageData: any) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  if (!supabase) return

  // Store incoming messages in database
  for (const message of messageData.messages || []) {
    await supabase.from("whatsapp_messages").insert({
      message_id: message.id,
      from_number: message.from,
      to_number: messageData.metadata?.phone_number_id,
      message_type: message.type,
      content: message.text?.body || JSON.stringify(message),
      timestamp: new Date(Number.parseInt(message.timestamp) * 1000).toISOString(),
      status: "received",
    })
  }

  // Process message status updates
  for (const status of messageData.statuses || []) {
    await supabase
      .from("whatsapp_messages")
      .update({
        status: status.status,
        updated_at: new Date().toISOString(),
      })
      .eq("message_id", status.id)
  }
}
