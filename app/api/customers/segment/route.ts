import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: customers, error: customersError } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)

    if (customersError) {
      console.error("Customers fetch error:", customersError)
      return NextResponse.json({ error: "Failed to fetch customer data" }, { status: 500 })
    }

    if (!customers || customers.length === 0) {
      return NextResponse.json({
        summary: "No customer data found",
        insights: [],
        ctas: ["Import customer data to enable segmentation"],
        segments: [],
      })
    }

    const customerData = customers.map((customer) => ({
      total_spent: customer.total_spent,
      total_orders: customer.total_orders,
      avg_order_value: customer.avg_order_value,
      last_order_date: customer.last_order_date,
      loyalty_points: customer.loyalty_points,
      customer_segment: customer.customer_segment,
      preferences: customer.preferences,
      dietary_restrictions: customer.dietary_restrictions,
    }))

    const { text } = await generateText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: `Analyze this customer data and create meaningful segments:

Customer Data: ${JSON.stringify(customerData.slice(0, 50), null, 2)}
Total Customers: ${customers.length}

Create customer segments based on:
1. Spending behavior and frequency
2. Order patterns and preferences
3. Loyalty and engagement levels
4. Churn risk assessment
5. Growth opportunities

For each segment, provide:
- Segment name and description
- Key characteristics
- Size and value
- Marketing strategies
- Retention tactics

Format as JSON with: summary, insights (array of {title, description, impact, segment}), ctas (array of strings), segments (array of {name, description, size, characteristics, strategies})`,
      system:
        "You are a customer analytics expert specializing in restaurant customer segmentation and retention strategies. Provide actionable insights for targeted marketing.",
    })

    const aiResponse = JSON.parse(text)

    return NextResponse.json({
      summary: aiResponse.summary,
      insights: aiResponse.insights || [],
      ctas: aiResponse.ctas || [],
      segments: aiResponse.segments || [],
      metadata: {
        totalCustomers: customers.length,
        avgSpent: customers.reduce((sum, c) => sum + (c.total_spent || 0), 0) / customers.length,
        avgOrders: customers.reduce((sum, c) => sum + (c.total_orders || 0), 0) / customers.length,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Customer segmentation error:", error)
    return NextResponse.json({ error: "Failed to generate customer segments" }, { status: 500 })
  }
}
