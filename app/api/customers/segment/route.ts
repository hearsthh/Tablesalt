import { type NextRequest, NextResponse } from "next/server"
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

    const avgSpent = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0) / customers.length
    const avgOrders = customers.reduce((sum, c) => sum + (c.total_orders || 0), 0) / customers.length

    const highValue = customers.filter((c) => (c.total_spent || 0) > avgSpent * 1.5)
    const frequent = customers.filter((c) => (c.total_orders || 0) > avgOrders * 1.5)
    const recent = customers.filter((c) => {
      const lastOrder = new Date(c.last_order_date || 0)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return lastOrder > thirtyDaysAgo
    })

    const segments = [
      {
        name: "High Value Customers",
        description: "Customers who spend significantly above average",
        size: highValue.length,
        characteristics: [
          `Average spend: $${(highValue.reduce((sum, c) => sum + (c.total_spent || 0), 0) / highValue.length || 0).toFixed(2)}`,
        ],
        strategies: ["VIP treatment", "Exclusive offers", "Personal outreach"],
      },
      {
        name: "Frequent Visitors",
        description: "Customers with high order frequency",
        size: frequent.length,
        characteristics: [
          `Average orders: ${(frequent.reduce((sum, c) => sum + (c.total_orders || 0), 0) / frequent.length || 0).toFixed(1)}`,
        ],
        strategies: ["Loyalty rewards", "Bulk discounts", "Early access to new items"],
      },
      {
        name: "Recent Customers",
        description: "Customers who ordered within the last 30 days",
        size: recent.length,
        characteristics: ["Active within 30 days"],
        strategies: ["Retention campaigns", "Feedback collection", "Cross-selling"],
      },
    ]

    const insights = [
      {
        title: "Customer Value Distribution",
        description: `${highValue.length} high-value customers generate significant revenue`,
        impact: "high",
        segment: "high_value",
      },
      {
        title: "Order Frequency Patterns",
        description: `${frequent.length} customers show strong loyalty with frequent orders`,
        impact: "medium",
        segment: "frequent",
      },
      {
        title: "Customer Activity",
        description: `${recent.length} customers remain active in the last 30 days`,
        impact: "medium",
        segment: "recent",
      },
    ]

    return NextResponse.json({
      summary: `Customer segmentation analysis of ${customers.length} customers reveals key behavioral patterns`,
      insights,
      ctas: [
        "Develop targeted campaigns for each segment",
        "Implement loyalty program for frequent customers",
        "Create win-back campaigns for inactive customers",
      ],
      segments,
      metadata: {
        totalCustomers: customers.length,
        avgSpent,
        avgOrders,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Customer segmentation error:", error)
    return NextResponse.json({ error: "Failed to generate customer segments" }, { status: 500 })
  }
}
