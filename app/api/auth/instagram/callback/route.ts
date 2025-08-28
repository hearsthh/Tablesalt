import { type NextRequest, NextResponse } from "next/server"
import { socialMediaConfig } from "@/lib/integrations/social-media-config"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/integrations?error=${error}`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/integrations?error=missing_params`)
    }

    const restaurantId = state.replace("instagram_", "")

    // Exchange code for access token
    const tokenResponse = await fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: socialMediaConfig.instagram.clientId,
        client_secret: socialMediaConfig.instagram.clientSecret,
        redirect_uri: socialMediaConfig.instagram.redirectUri,
        code: code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/integrations?error=token_exchange_failed`)
    }

    // Get Instagram Business accounts
    const accountsResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=${tokenData.access_token}`,
    )
    const accountsData = await accountsResponse.json()

    // Store integration in database
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    if (supabase) {
      await supabase.from("restaurant_integrations").upsert({
        restaurant_id: restaurantId,
        provider_name: "instagram-business",
        status: "connected",
        config: {
          accounts: accountsData.data || [],
          scopes: socialMediaConfig.instagram.scopes,
        },
        credentials: {
          access_token: tokenData.access_token,
          expires_in: tokenData.expires_in,
        },
        last_sync_at: new Date().toISOString(),
      })
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/integrations?success=instagram_connected`)
  } catch (error) {
    console.error("Instagram callback error:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/integrations?error=callback_failed`)
  }
}
