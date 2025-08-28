import { type NextRequest, NextResponse } from "next/server"
import { socialMediaConfig } from "@/lib/integrations/social-media-config"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurant_id")

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID required" }, { status: 400 })
    }

    // Generate PKCE challenge for Twitter OAuth 2.0
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    // Store code verifier in session/database for callback
    // In production, store this securely with the restaurant_id

    // Build Twitter OAuth URL
    const authUrl = new URL("https://twitter.com/i/oauth2/authorize")
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("client_id", socialMediaConfig.twitter.clientId)
    authUrl.searchParams.set("redirect_uri", socialMediaConfig.twitter.redirectUri)
    authUrl.searchParams.set("scope", socialMediaConfig.twitter.scopes.join(" "))
    authUrl.searchParams.set("state", restaurantId)
    authUrl.searchParams.set("code_challenge", codeChallenge)
    authUrl.searchParams.set("code_challenge_method", "S256")

    return NextResponse.json({
      authUrl: authUrl.toString(),
      codeVerifier, // Return this to store on client side temporarily
    })
  } catch (error) {
    console.error("Twitter auth error:", error)
    return NextResponse.json({ error: "Failed to initiate Twitter authentication" }, { status: 500 })
  }
}

function generateCodeVerifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}
