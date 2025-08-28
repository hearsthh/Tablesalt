import { type NextRequest, NextResponse } from "next/server"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { groq } from "@ai-sdk/groq"
import { deepinfra } from "@ai-sdk/deepinfra"
import * as fal from "@fal-ai/serverless-client"

export async function POST(request: NextRequest) {
  try {
    const { suiteName, testName, restaurantId } = await request.json()

    console.log(`[v0] Running test: ${suiteName} - ${testName} for restaurant ${restaurantId}`)

    let result: any = {}

    if (suiteName === "Database Operations") {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase not configured - real database connection required")
      }

      const supabase = await createClient()

      switch (testName) {
        case "Load Restaurant Data":
          const { data: restaurant, error: restaurantError } = await supabase
            .from("restaurants")
            .select("*")
            .eq("id", restaurantId)
            .single()

          if (restaurantError) throw new Error(`Database query failed: ${restaurantError.message}`)
          result = { restaurant, recordCount: 1 }
          break

        case "Load Menu Items":
          const { data: menuItems, error: menuError } = await supabase
            .from("menu_items")
            .select("*, menu_categories(*)")
            .eq("restaurant_id", restaurantId)

          if (menuError) throw new Error(`Database query failed: ${menuError.message}`)
          result = { menuItems, recordCount: menuItems?.length || 0 }
          break

        case "Load Customer Data":
          const { data: customers, error: customerError } = await supabase
            .from("customers")
            .select("*")
            .eq("restaurant_id", restaurantId)
            .limit(10)

          if (customerError) throw new Error(`Database query failed: ${customerError.message}`)
          result = { customers, recordCount: customers?.length || 0 }
          break

        case "Load Orders & Analytics":
          const { data: orders, error: orderError } = await supabase
            .from("orders")
            .select("*, order_items(*)")
            .eq("restaurant_id", restaurantId)
            .limit(10)

          if (orderError) throw new Error(`Database query failed: ${orderError.message}`)
          result = { orders, recordCount: orders?.length || 0 }
          break

        case "Load Reviews & Insights":
          const { data: reviews, error: reviewError } = await supabase
            .from("reviews")
            .select("*")
            .eq("restaurant_id", restaurantId)
            .limit(10)

          if (reviewError) throw new Error(`Database query failed: ${reviewError.message}`)
          result = { reviews, recordCount: reviews?.length || 0 }
          break
      }
    } else if (suiteName === "AI Generation Features") {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase not configured - real restaurant data required for AI generation")
      }

      const supabase = await createClient()

      const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .select("name, cuisine_type, description")
        .eq("id", restaurantId)
        .single()

      if (restaurantError) throw new Error(`Failed to load restaurant data: ${restaurantError.message}`)

      const { data: menuItems, error: menuError } = await supabase
        .from("menu_items")
        .select("name, description, price")
        .eq("restaurant_id", restaurantId)
        .limit(3)

      if (menuError) throw new Error(`Failed to load menu data: ${menuError.message}`)

      switch (testName) {
        case "Menu Descriptions (Grok)":
          if (!process.env.XAI_API_KEY) {
            throw new Error("XAI_API_KEY not configured - real Grok API connection required")
          }

          const { text: menuDescription } = await generateText({
            model: xai("grok-4"),
            prompt: `Create an appetizing menu description for ${menuItems[0]?.name} at ${restaurant.name}, a ${restaurant.cuisine_type} restaurant. Make it engaging and mouth-watering.`,
          })
          result = { aiProvider: "Grok", generatedText: menuDescription, inputContext: restaurant }
          break

        case "Social Media Posts (Groq)":
          if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY not configured - real Groq API connection required")
          }

          const { text: socialPost } = await generateText({
            model: groq("llama-3.1-70b-versatile"),
            prompt: `Create an engaging Instagram post for ${restaurant.name}, a ${restaurant.cuisine_type} restaurant. Include relevant hashtags and call-to-action.`,
          })
          result = { aiProvider: "Groq", generatedText: socialPost, inputContext: restaurant }
          break

        case "Business Insights (Deep Infra)":
          if (!process.env.DEEPINFRA_API_KEY) {
            throw new Error("DEEPINFRA_API_KEY not configured - real Deep Infra API connection required")
          }

          const { text: insights } = await generateText({
            model: deepinfra("meta-llama/Meta-Llama-3.1-70B-Instruct"),
            prompt: `Analyze the business performance for ${restaurant.name}. Provide 3 key insights and recommendations for a ${restaurant.cuisine_type} restaurant.`,
          })
          result = { aiProvider: "Deep Infra", generatedText: insights, inputContext: restaurant }
          break

        case "Image Generation (fal)":
          if (!process.env.FAL_KEY) {
            throw new Error("FAL_KEY not configured - real fal API connection required")
          }

          const imageResult = await fal.subscribe("fal-ai/flux/schnell", {
            input: {
              prompt: `Professional food photography of ${menuItems[0]?.name} from ${restaurant.name}, ${restaurant.cuisine_type} cuisine, high quality, appetizing`,
              image_size: "square_hd",
            },
          })
          result = { aiProvider: "fal", imageUrl: imageResult.data.images[0]?.url, inputContext: restaurant }
          break

        case "Review Responses (Grok)":
          if (!process.env.XAI_API_KEY) {
            throw new Error("XAI_API_KEY not configured - real Grok API connection required")
          }

          const { text: reviewResponse } = await generateText({
            model: xai("grok-4"),
            prompt: `Write a professional response to a 5-star review for ${restaurant.name}. Thank the customer and encourage them to visit again.`,
          })
          result = { aiProvider: "Grok", generatedText: reviewResponse, inputContext: restaurant }
          break
      }
    } else if (suiteName === "Feature Integration") {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase not configured - real database connection required for feature integration")
      }

      const supabase = await createClient()

      switch (testName) {
        case "Dashboard Analytics":
          const analyticsResult = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/v1/dashboard/stats`,
            {
              method: "GET",
              headers: { Cookie: request.headers.get("cookie") || "" },
            },
          )

          if (!analyticsResult.ok) {
            throw new Error(`Dashboard API failed with status: ${analyticsResult.status}`)
          }

          const analyticsData = await analyticsResult.json()
          result = { status: analyticsResult.status, data: analyticsData }
          break

        case "Menu Management":
          const { data: menuData, error: menuMgmtError } = await supabase
            .from("menu_items")
            .select("*, menu_categories(*)")
            .eq("restaurant_id", restaurantId)

          if (menuMgmtError) throw new Error(`Menu management query failed: ${menuMgmtError.message}`)

          result = {
            menuItems: menuData,
            categories: menuData?.map((item) => item.menu_categories).filter(Boolean),
          }
          break

        case "Customer Intelligence":
          const { data: customerData, error: customerError } = await supabase
            .from("customers")
            .select("*")
            .eq("restaurant_id", restaurantId)

          if (customerError) throw new Error(`Customer intelligence query failed: ${customerError.message}`)

          const totalCustomers = customerData?.length || 0
          const avgOrderValue =
            customerData?.reduce((sum, c) => sum + (c.avg_order_value || 0), 0) / totalCustomers || 0

          result = { totalCustomers, avgOrderValue, customerSegments: customerData?.map((c) => c.customer_segment) }
          break

        case "Marketing Campaigns":
          const { data: campaigns, error: campaignError } = await supabase
            .from("marketing_campaigns")
            .select("*")
            .eq("restaurant_id", restaurantId)

          if (campaignError) throw new Error(`Marketing campaigns query failed: ${campaignError.message}`)

          result = { campaigns, campaignCount: campaigns?.length || 0 }
          break

        case "Review Management":
          const { data: reviewData, error: reviewMgmtError } = await supabase
            .from("reviews")
            .select("*")
            .eq("restaurant_id", restaurantId)

          if (reviewMgmtError) throw new Error(`Review management query failed: ${reviewMgmtError.message}`)

          const avgRating = reviewData?.reduce((sum, r) => sum + r.rating, 0) / (reviewData?.length || 1) || 0

          result = { reviews: reviewData, avgRating, totalReviews: reviewData?.length || 0 }
          break
      }
    }

    console.log(`[v0] Test completed successfully: ${suiteName} - ${testName}`)

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
      testInfo: { suiteName, testName, restaurantId },
    })
  } catch (error) {
    console.error(`[v0] Test failed with real API connections:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
