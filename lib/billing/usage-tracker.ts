import { createServerClient } from "@/lib/supabase/server"

export type UsageType = "ai_generations" | "campaigns" | "menu_items" | "api_calls" | "social_posts"

export class UsageTracker {
  private async getSupabaseClient() {
    return await createServerClient()
  }

  async trackUsage(userId: string, resourceType: UsageType, count = 1): Promise<void> {
    const supabase = await this.getSupabaseClient()

    if (!supabase) {
      console.warn("Usage tracking unavailable - database connection failed")
      return
    }

    try {
      const currentPeriod = this.getCurrentBillingPeriod()

      // Get or create usage record for current period
      const { data: existingUsage } = await supabase
        .from("usage_tracking")
        .select("*")
        .eq("user_id", userId)
        .eq("resource_type", resourceType)
        .eq("period_start", currentPeriod.start.toISOString())
        .single()

      if (existingUsage) {
        // Update existing usage
        await supabase
          .from("usage_tracking")
          .update({
            usage_count: existingUsage.usage_count + count,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingUsage.id)
      } else {
        // Create new usage record
        await supabase.from("usage_tracking").insert({
          user_id: userId,
          resource_type: resourceType,
          usage_count: count,
          period_start: currentPeriod.start.toISOString(),
          period_end: currentPeriod.end.toISOString(),
        })
      }
    } catch (error) {
      console.error("Usage tracking error:", error)
    }
  }

  async getUserUsage(userId: string, resourceType?: UsageType): Promise<any[]> {
    const supabase = await this.getSupabaseClient()

    if (!supabase) {
      return []
    }

    try {
      let query = supabase.from("usage_tracking").select("*").eq("user_id", userId)

      if (resourceType) {
        query = query.eq("resource_type", resourceType)
      }

      const { data, error } = await query.order("period_start", { ascending: false })

      if (error) {
        console.error("Error fetching usage:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Usage fetch error:", error)
      return []
    }
  }

  async checkUsageLimit(userId: string, resourceType: UsageType, limit: number): Promise<boolean> {
    if (limit === -1) return true // Unlimited

    const currentPeriod = this.getCurrentBillingPeriod()
    const usage = await this.getUserUsage(userId, resourceType)

    const currentUsage = usage.find(
      (u) => u.period_start === currentPeriod.start.toISOString() && u.resource_type === resourceType,
    )

    return (currentUsage?.usage_count || 0) < limit
  }

  private getCurrentBillingPeriod(): { start: Date; end: Date } {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1) // First day of current month
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0) // Last day of current month

    return { start, end }
  }
}

export const usageTracker = new UsageTracker()
