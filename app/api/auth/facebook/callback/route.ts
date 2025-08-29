import { type NextRequest, NextResponse } from "next/server"
import { socialMediaConfig } from "@/lib/integrations/social-media-config"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state") // restaurant_id
    const error = searchParams.get("error")

    if (error) {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
      return NextResponse.redirect(`${baseUrl}/integrations?error=${error}`)
    }

    if (!code || !state) {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
      return NextResponse.redirect(`${baseUrl}/integrations?error=missing_params`)
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: socialMediaConfig.facebook.clientId,
        client_secret: socialMediaConfig.facebook.clientSecret,
        redirect_uri: socialMediaConfig.facebook.redirectUri,
        code: code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
      return NextResponse.redirect(`${baseUrl}/integrations?error=token_exchange_failed`)
    }

    // Get user's Facebook pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`,
    )
    const pagesData = await pagesResponse.json()

    // Store integration in database
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    if (supabase) {
      await supabase.from("restaurant_integrations").upsert({
        restaurant_id: state,
        provider_name: "facebook-business",
        status: "connected",
        config: {
          pages: pagesData.data || [],
          scopes: socialMediaConfig.facebook.scopes,
        },
        credentials: {
          access_token: tokenData.access_token,
          expires_in: tokenData.expires_in,
        },
        last_sync_at: new Date().toISOString(),
      })
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"
    return NextResponse.redirect(`${baseUrl}/integrations?success=facebook_connected`)
  } catch (error) {
    console.error("Facebook callback error:", error)
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"
    return NextResponse.redirect(`${baseUrl}/integrations?error=callback_failed`)
  }
}
