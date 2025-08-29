import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// Demo data for Phase 0 testing
const DEMO_DATA = {
  "google-my-business": {
    restaurant_info: {
      name: "Demo Restaurant",
      address: "123 Main St, Demo City",
      phone: "(555) 123-4567",
      rating: 4.5,
      total_reviews: 127,
    },
    reviews: [
      {
        id: "demo-review-1",
        author: "John D.",
        rating: 5,
        text: "Amazing food and great service! Highly recommend the pasta.",
        date: "2024-01-15",
      },
      {
        id: "demo-review-2",
        author: "Sarah M.",
        rating: 4,
        text: "Good atmosphere and friendly staff. The pizza was delicious.",
        date: "2024-01-10",
      },
    ],
  },
  "square-pos": {
    menu_items: [
      {
        id: "demo-item-1",
        name: "Margherita Pizza",
        price: 18.99,
        category: "Pizza",
        description: "Fresh mozzarella, tomato sauce, basil",
      },
      {
        id: "demo-item-2",
        name: "Caesar Salad",
        price: 12.99,
        category: "Salads",
        description: "Romaine lettuce, parmesan, croutons, caesar dressing",
      },
    ],
    orders: [
      {
        id: "demo-order-1",
        total: 31.98,
        items: ["Margherita Pizza", "Caesar Salad"],
        date: "2024-01-20",
        status: "completed",
      },
    ],
  },
  mailchimp: {
    campaigns: [
      {
        id: "demo-campaign-1",
        name: "Weekly Newsletter",
        sent_date: "2024-01-15",
        recipients: 245,
        open_rate: 24.5,
        click_rate: 3.2,
      },
    ],
    subscribers: 245,
  },
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const provider = searchParams.get("provider")

    if (!provider) {
      return NextResponse.json({ error: "Provider parameter required" }, { status: 400 })
    }

    const demoData = DEMO_DATA[provider as keyof typeof DEMO_DATA]
    if (!demoData) {
      return NextResponse.json({ error: "Demo data not available for this provider" }, { status: 404 })
    }

    return NextResponse.json({ data: demoData })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
