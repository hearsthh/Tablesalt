import { type NextRequest, NextResponse } from "next/server"
import { socialMediaConfig } from "@/lib/integrations/social-media-config"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurant_id")

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 })
    }

    // Build Facebook OAuth URL
    const authUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth")
    authUrl.searchParams.set("client_id", socialMediaConfig.facebook.clientId)
    authUrl.searchParams.set("redirect_uri", socialMediaConfig.facebook.redirectUri)
    authUrl.searchParams.set("scope", socialMediaConfig.facebook.scopes.join(","))
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("state", restaurantId) // Pass restaurant ID in state

    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error("Facebook auth error:", error)
    return NextResponse.json({ error: "Failed to initiate Facebook authentication" }, { status: 500 })
  }
}
