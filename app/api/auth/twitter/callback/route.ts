import { type NextRequest, NextResponse } from "next/server"
import { socialMediaConfig } from "@/lib/integrations/social-media-config"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"

    if (error) {
      return NextResponse.redirect(`${baseUrl}/integrations?error=${error}`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${baseUrl}/integrations?error=missing_params`)
    }

    // Exchange code for access token using Twitter OAuth 2.0
    const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${socialMediaConfig.twitter.clientId}:${socialMediaConfig.twitter.clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        code: code,
        grant_type: "authorization_code",
        client_id: socialMediaConfig.twitter.clientId,
        redirect_uri: socialMediaConfig.twitter.redirectUri,
        code_verifier: "challenge", // In production, this should be stored and retrieved
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${baseUrl}/integrations?error=token_exchange_failed`)
    }

    // Get user profile
    const profileResponse = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })
    const profileData = await profileResponse.json()

    // Store integration in database
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    if (supabase) {
      await supabase.from("restaurant_integrations").upsert({
        restaurant_id: state,
        provider_name: "twitter-business",
        status: "connected",
        config: {
          user_profile: profileData.data,
          scopes: socialMediaConfig.twitter.scopes,
        },
        credentials: {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_in: tokenData.expires_in,
        },
        last_sync_at: new Date().toISOString(),
      })
    }

    return NextResponse.redirect(`${baseUrl}/integrations?success=twitter_connected`)
  } catch (error) {
    console.error("Twitter callback error:", error)
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"
    return NextResponse.redirect(`${baseUrl}/integrations?error=callback_failed`)
  }
}
