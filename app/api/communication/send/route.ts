import { type NextRequest, NextResponse } from "next/server"
import { communicationService, type CommunicationMessage } from "@/lib/integrations/communication-service"

export async function POST(request: NextRequest) {
  try {
    const { message, messages } = await request.json()

    if (message) {
      // Send single message
      const result = await communicationService.sendMessage(message as CommunicationMessage)
      return NextResponse.json({ success: true, result })
    } else if (messages && Array.isArray(messages)) {
      // Send multiple messages
      const results = await communicationService.sendMultiChannelMessage(messages as CommunicationMessage[])
      return NextResponse.json({ success: true, results })
    } else {
      return NextResponse.json({ success: false, error: "Invalid request format" }, { status: 400 })
    }
  } catch (error) {
    console.error("Communication API error:", error)
    return NextResponse.json({ success: false, error: "Failed to send communication" }, { status: 500 })
  }
}
