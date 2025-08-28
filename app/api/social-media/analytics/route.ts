import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurant_id")
    const platform = searchParams.get("platform")

    if (!restaurantId || !platform) {
      return NextResponse.json({ error: "Restaurant ID and platform required" }, { status: 400 })
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
      return NextResponse.json({ error: `${platform} integration not found` }, { status: 404 })
    }

    let analytics
    switch (platform) {
      case "facebook":
        analytics = await getFacebookAnalytics(integration)
        break
      case "instagram":
        analytics = await getInstagramAnalytics(integration)
        break
      case "twitter":
        analytics = await getTwitterAnalytics(integration)
        break
      case "whatsapp":
        analytics = await getWhatsAppAnalytics(integration)
        break
      default:
        return NextResponse.json({ error: "Unsupported platform" }, { status: 400 })
    }

    return NextResponse.json({ success: true, analytics })
  } catch (error) {
    console.error("Social media analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

async function getFacebookAnalytics(integration: any) {
  const accessToken = integration.credentials.access_token
  const pageId = integration.config.pages[0]?.id

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}/insights?metric=page_impressions,page_reach,page_engaged_users&access_token=${accessToken}`,
  )

  return response.json()
}

async function getInstagramAnalytics(integration: any) {
  const accessToken = integration.credentials.access_token
  const pageId = integration.config.pages[0]?.id

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}/insights?metric=impressions,reach,profile_views&access_token=${accessToken}`,
  )

  return response.json()
}

async function getTwitterAnalytics(integration: any) {
  // Twitter analytics would require additional API calls
  return { message: "Twitter analytics integration pending" }
}

async function getWhatsAppAnalytics(integration: any) {
  // WhatsApp analytics would require business API access
  return { message: "WhatsApp analytics integration pending" }
}
