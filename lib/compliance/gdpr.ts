import { createClient } from "@/lib/supabase/client"

export class GDPRService {
  private supabase = createClient()

  async requestDataExport(userId: string, dataTypes: string[]) {
    const exportData: any = {}

    try {
      if (dataTypes.includes("profile")) {
        const { data: restaurants } = await this.supabase.from("restaurants").select("*").eq("owner_id", userId)
        exportData.restaurants = restaurants
      }

      if (dataTypes.includes("marketing")) {
        const { data: strategies } = await this.supabase
          .from("marketing_strategies")
          .select(`
            *,
            marketing_campaigns(*),
            marketing_activities(*)
          `)
          .eq("restaurant_id", userId)
        exportData.marketing = strategies
      }

      if (dataTypes.includes("billing")) {
        const { data: subscriptions } = await this.supabase.from("user_subscriptions").select("*").eq("user_id", userId)

        const { data: invoices } = await this.supabase.from("invoices").select("*").eq("user_id", userId)

        exportData.billing = { subscriptions, invoices }
      }

      return exportData
    } catch (error) {
      console.error("Data export error:", error)
      throw new Error("Failed to export data")
    }
  }

  async deleteUserData(userId: string) {
    try {
      // Delete in correct order due to foreign key constraints
      await this.supabase.from("marketing_activities").delete().eq("restaurant_id", userId)
      await this.supabase.from("marketing_campaigns").delete().eq("restaurant_id", userId)
      await this.supabase.from("marketing_strategies").delete().eq("restaurant_id", userId)
      await this.supabase.from("usage_tracking").delete().eq("user_id", userId)
      await this.supabase.from("invoices").delete().eq("user_id", userId)
      await this.supabase.from("user_subscriptions").delete().eq("user_id", userId)
      await this.supabase.from("restaurants").delete().eq("owner_id", userId)

      return { success: true }
    } catch (error) {
      console.error("Data deletion error:", error)
      throw new Error("Failed to delete user data")
    }
  }

  async logDataProcessingActivity(userId: string, activity: string, purpose: string) {
    try {
      await this.supabase.from("data_processing_log").insert({
        user_id: userId,
        activity,
        purpose,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Logging error:", error)
    }
  }
}

export const gdprService = new GDPRService()
