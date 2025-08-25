import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/client"

type Strategy = Database["public"]["Tables"]["marketing_strategies"]["Row"]
type Campaign = Database["public"]["Tables"]["marketing_campaigns"]["Row"]
type Activity = Database["public"]["Tables"]["marketing_activities"]["Row"]

export class MarketingService {
  private supabase = createClient()

  // Strategies
  async getStrategies(restaurantId: string) {
    const { data, error } = await this.supabase
      .from("marketing_strategies")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async createStrategy(strategy: Database["public"]["Tables"]["marketing_strategies"]["Insert"]) {
    const { data, error } = await this.supabase.from("marketing_strategies").insert(strategy).select().single()

    if (error) throw error
    return data
  }

  async updateStrategy(id: string, updates: Database["public"]["Tables"]["marketing_strategies"]["Update"]) {
    const { data, error } = await this.supabase
      .from("marketing_strategies")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Campaigns
  async getCampaigns(restaurantId: string, strategyId?: string) {
    let query = this.supabase.from("marketing_campaigns").select("*").eq("restaurant_id", restaurantId)

    if (strategyId) {
      query = query.eq("strategy_id", strategyId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async createCampaign(campaign: Database["public"]["Tables"]["marketing_campaigns"]["Insert"]) {
    const { data, error } = await this.supabase.from("marketing_campaigns").insert(campaign).select().single()

    if (error) throw error
    return data
  }

  async updateCampaign(id: string, updates: Database["public"]["Tables"]["marketing_campaigns"]["Update"]) {
    const { data, error } = await this.supabase
      .from("marketing_campaigns")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Activities
  async getActivities(restaurantId: string, campaignId?: string) {
    let query = this.supabase.from("marketing_activities").select("*").eq("restaurant_id", restaurantId)

    if (campaignId) {
      query = query.eq("campaign_id", campaignId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async createActivity(activity: Database["public"]["Tables"]["marketing_activities"]["Insert"]) {
    const { data, error } = await this.supabase.from("marketing_activities").insert(activity).select().single()

    if (error) throw error
    return data
  }

  async updateActivity(id: string, updates: Database["public"]["Tables"]["marketing_activities"]["Update"]) {
    const { data, error } = await this.supabase
      .from("marketing_activities")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export const marketingService = new MarketingService()
