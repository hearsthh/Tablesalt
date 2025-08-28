import { type NextRequest, NextResponse } from "next/server"
import { socialMediaConfig } from "@/lib/integrations/social-media-config"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurant_id")

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 })
    }

    // Build Instagram OAuth URL (uses Facebook OAuth)
    const authUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth")
    authUrl.searchParams.set("client_id", socialMediaConfig.instagram.clientId)
    authUrl.searchParams.set("redirect_uri", socialMediaConfig.instagram.redirectUri)
    authUrl.searchParams.set("scope", socialMediaConfig.instagram.scopes.join(","))
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("state", `instagram_${restaurantId}`)

    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error("Instagram auth error:", error)
    return NextResponse.json({ error: "Failed to initiate Instagram authentication" }, { status: 500 })
  }
}
