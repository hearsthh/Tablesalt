import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { restaurantId, platform, content, scheduledTime } = await request.json()

    if (!restaurantId || !platform || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get integration credentials
    const { data: integration } = await supabase
      .from("restaurant_integrations")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("provider_name", `${platform}-business`)
      .eq("status", "connected")
      .single()

    if (!integration) {
      return NextResponse.json({ error: `${platform} integration not found or not connected` }, { status: 404 })
    }

    let result
    switch (platform) {
      case "facebook":
        result = await postToFacebook(integration, content, scheduledTime)
        break
      case "instagram":
        result = await postToInstagram(integration, content, scheduledTime)
        break
      case "twitter":
        result = await postToTwitter(integration, content, scheduledTime)
        break
      case "whatsapp":
        result = await sendWhatsAppMessage(integration, content)
        break
      default:
        return NextResponse.json({ error: "Unsupported platform" }, { status: 400 })
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Social media post error:", error)
    return NextResponse.json({ error: "Failed to post content" }, { status: 500 })
  }
}

async function postToFacebook(integration: any, content: any, scheduledTime?: string) {
  const accessToken = integration.credentials.access_token
  const pageId = integration.config.pages[0]?.id // Use first page

  const postData: any = {
    message: content.text,
    access_token: accessToken,
  }

  if (content.image_url) {
    postData.link = content.image_url
  }

  if (scheduledTime) {
    postData.scheduled_publish_time = Math.floor(new Date(scheduledTime).getTime() / 1000)
    postData.published = false
  }

  const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  })

  return response.json()
}

async function postToInstagram(integration: any, content: any, scheduledTime?: string) {
  // Instagram posting requires media upload first, then publishing
  const accessToken = integration.credentials.access_token
  const pageId = integration.config.pages[0]?.id

  if (!content.image_url) {
    throw new Error("Instagram posts require an image")
  }

  // Create media container
  const containerResponse = await fetch(`https://graph.facebook.com/v18.0/${pageId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: content.image_url,
      caption: content.text,
      access_token: accessToken,
    }),
  })

  const containerData = await containerResponse.json()

  if (scheduledTime) {
    // Schedule the post
    return { container_id: containerData.id, scheduled: true }
  } else {
    // Publish immediately
    const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${pageId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: accessToken,
      }),
    })

    return publishResponse.json()
  }
}

async function postToTwitter(integration: any, content: any, scheduledTime?: string) {
  // Twitter API v2 posting
  const accessToken = integration.credentials.access_token

  const tweetData: any = {
    text: content.text,
  }

  if (content.media_ids) {
    tweetData.media = { media_ids: content.media_ids }
  }

  const response = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tweetData),
  })

  return response.json()
}

async function sendWhatsAppMessage(integration: any, content: any) {
  const accessToken = integration.credentials.access_token
  const phoneNumberId = integration.config.phone_number_id

  const messageData = {
    messaging_product: "whatsapp",
    to: content.recipient,
    type: "text",
    text: { body: content.text },
  }

  const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  })

  return response.json()
}
