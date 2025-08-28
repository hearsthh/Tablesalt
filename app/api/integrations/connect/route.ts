import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { provider, credentials, restaurantId } = await request.json()

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate the integration credentials
    const isValid = await validateIntegrationCredentials(provider, credentials)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }

    // Store the integration in the database
    const { data, error } = await supabase
      .from("restaurant_integrations")
      .upsert({
        restaurant_id: restaurantId,
        provider_name: provider,
        credentials: credentials, // In production, encrypt these
        status: "active",
        connected_at: new Date().toISOString(),
        last_sync: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save integration" }, { status: 500 })
    }

    // Trigger initial data sync
    await triggerDataSync(provider, restaurantId, credentials)

    return NextResponse.json({
      success: true,
      integration: data,
      message: `${provider} integration connected successfully`,
    })
  } catch (error) {
    console.error("Integration connection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function validateIntegrationCredentials(provider: string, credentials: any): Promise<boolean> {
  try {
    switch (provider) {
      case "doordash":
        const ddResponse = await fetch(`https://openapi.doordash.com/developer/v1/stores/${credentials.storeId}`, {
          headers: { Authorization: `Bearer ${credentials.apiKey}` },
        })
        return ddResponse.ok

      case "ubereats":
        const ueResponse = await fetch(`https://api.uber.com/v1/eats/stores/${credentials.storeId}`, {
          headers: { Authorization: `Bearer ${credentials.apiKey}` },
        })
        return ueResponse.ok

      case "grubhub":
        const ghResponse = await fetch(`https://api-gtm.grubhub.com/restaurants/${credentials.restaurantId}`, {
          headers: { Authorization: `Bearer ${credentials.apiKey}` },
        })
        return ghResponse.ok

      case "opentable":
        const otResponse = await fetch(
          `https://platform.opentable.com/sync/v2/restaurants/${credentials.restaurantId}`,
          {
            headers: { Authorization: `Bearer ${credentials.apiKey}` },
          },
        )
        return otResponse.ok

      case "resy":
        const resyResponse = await fetch(`https://api.resy.com/3/venue/${credentials.venueId}`, {
          headers: { Authorization: `ResyAPI api_key="${credentials.apiKey}"` },
        })
        return resyResponse.ok

      case "toast":
        const toastResponse = await fetch("https://ws-api.toasttab.com/restaurants/v1/restaurants", {
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
            "Toast-Restaurant-External-ID": credentials.restaurantId,
          },
        })
        return toastResponse.ok

      case "clover":
        const cloverResponse = await fetch(`https://api.clover.com/v3/merchants/${credentials.merchantId}`, {
          headers: { Authorization: `Bearer ${credentials.apiKey}` },
        })
        return cloverResponse.ok

      default:
        return false
    }
  } catch (error) {
    console.error(`Validation error for ${provider}:`, error)
    return false
  }
}

async function triggerDataSync(provider: string, restaurantId: string, credentials: any): Promise<void> {
  try {
    // Trigger background sync job
    await fetch("/api/integrations/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, restaurantId, credentials }),
    })
  } catch (error) {
    console.error("Sync trigger error:", error)
  }
}
