import { createBrowserClient } from "@supabase/ssr"

// Client-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_PROJECT_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY

export const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && url.trim() !== "" && key.trim() !== "")
}

const createMockClient = () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: new Error("Supabase not configured"),
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      resetPasswordForEmail: async () => ({ error: new Error("Supabase not configured") }),
      updateUser: async () => ({ error: new Error("Supabase not configured") }),
    },
    from: () => ({
      select: () => ({
        data: [],
        error: null,
        eq: () => ({ data: [], error: null, single: () => ({ data: null, error: null }) }),
        single: () => ({ data: null, error: null }),
      }),
      insert: () => ({ data: null, error: new Error("Supabase not configured") }),
      update: () => ({ data: null, error: new Error("Supabase not configured") }),
      delete: () => ({ data: null, error: new Error("Supabase not configured") }),
      upsert: () => ({ data: null, error: new Error("Supabase not configured") }),
    }),
  }
}

export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          email?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      restaurants: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          address: string | null
          phone: string | null
          email: string | null
          website: string | null
          cuisine_type: string | null
          price_range: string | null
          logo_url: string | null
          cover_image_url: string | null
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          cuisine_type?: string | null
          price_range?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          settings?: any
        }
        Update: {
          name?: string
          description?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          cuisine_type?: string | null
          price_range?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          settings?: any
        }
      }
      menu_categories: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          display_order?: number
          is_active?: boolean
        }
        Update: {
          name?: string
          description?: string | null
          display_order?: number
          is_active?: boolean
        }
      }
      menu_items: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          image_url: string | null
          ingredients: string[] | null
          allergens: string[] | null
          dietary_info: string[] | null
          calories: number | null
          prep_time: number | null
          is_available: boolean
          is_featured: boolean
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          ingredients?: string[] | null
          allergens?: string[] | null
          dietary_info?: string[] | null
          calories?: number | null
          prep_time?: number | null
          is_available?: boolean
          is_featured?: boolean
          tags?: string[] | null
        }
        Update: {
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          ingredients?: string[] | null
          allergens?: string[] | null
          dietary_info?: string[] | null
          calories?: number | null
          prep_time?: number | null
          is_available?: boolean
          is_featured?: boolean
          tags?: string[] | null
        }
      }
      customers: {
        Row: {
          id: string
          restaurant_id: string
          email: string | null
          phone: string | null
          first_name: string | null
          last_name: string | null
          date_of_birth: string | null
          preferences: any
          dietary_restrictions: string[] | null
          total_orders: number
          total_spent: number
          avg_order_value: number
          last_order_date: string | null
          customer_segment: string | null
          loyalty_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          email?: string | null
          phone?: string | null
          first_name?: string | null
          last_name?: string | null
          date_of_birth?: string | null
          preferences?: any
          dietary_restrictions?: string[] | null
          total_orders?: number
          total_spent?: number
          avg_order_value?: number
          last_order_date?: string | null
          customer_segment?: string | null
          loyalty_points?: number
        }
        Update: {
          email?: string | null
          phone?: string | null
          first_name?: string | null
          last_name?: string | null
          date_of_birth?: string | null
          preferences?: any
          dietary_restrictions?: string[] | null
          total_orders?: number
          total_spent?: number
          avg_order_value?: number
          last_order_date?: string | null
          customer_segment?: string | null
          loyalty_points?: number
        }
      }
      orders: {
        Row: {
          id: string
          restaurant_id: string
          customer_id: string | null
          order_number: string
          status: string
          order_type: string
          subtotal: number
          tax_amount: number
          tip_amount: number
          total_amount: number
          payment_method: string | null
          payment_status: string
          notes: string | null
          delivery_address: string | null
          estimated_ready_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          customer_id?: string | null
          order_number: string
          status: string
          order_type: string
          subtotal: number
          tax_amount?: number
          tip_amount?: number
          total_amount: number
          payment_method?: string | null
          payment_status: string
          notes?: string | null
          delivery_address?: string | null
          estimated_ready_time?: string | null
        }
        Update: {
          status?: string
          order_type?: string
          subtotal?: number
          tax_amount?: number
          tip_amount?: number
          total_amount?: number
          payment_method?: string | null
          payment_status?: string
          notes?: string | null
          delivery_address?: string | null
          estimated_ready_time?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          restaurant_id: string
          customer_id: string | null
          order_id: string | null
          platform: string
          platform_review_id: string | null
          rating: number
          title: string | null
          content: string | null
          reviewer_name: string | null
          reviewer_avatar: string | null
          sentiment_score: number | null
          sentiment_label: string | null
          keywords: string[] | null
          response_text: string | null
          response_date: string | null
          is_responded: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          customer_id?: string | null
          order_id?: string | null
          platform: string
          platform_review_id?: string | null
          rating: number
          title?: string | null
          content?: string | null
          reviewer_name?: string | null
          reviewer_avatar?: string | null
          sentiment_score?: number | null
          sentiment_label?: string | null
          keywords?: string[] | null
          response_text?: string | null
          response_date?: string | null
          is_responded?: boolean
          is_featured?: boolean
        }
        Update: {
          rating?: number
          title?: string | null
          content?: string | null
          reviewer_name?: string | null
          reviewer_avatar?: string | null
          sentiment_score?: number | null
          sentiment_label?: string | null
          keywords?: string[] | null
          response_text?: string | null
          response_date?: string | null
          is_responded?: boolean
          is_featured?: boolean
        }
      }
      marketing_campaigns: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          type: string
          status: string
          target_audience: any
          content: any
          scheduled_date: string | null
          sent_count: number
          opened_count: number
          clicked_count: number
          conversion_count: number
          budget: number | null
          spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          type: string
          status?: string
          target_audience?: any
          content: any
          scheduled_date?: string | null
          sent_count?: number
          opened_count?: number
          clicked_count?: number
          conversion_count?: number
          budget?: number | null
          spent?: number
        }
        Update: {
          name?: string
          type?: string
          status?: string
          target_audience?: any
          content?: any
          scheduled_date?: string | null
          sent_count?: number
          opened_count?: number
          clicked_count?: number
          conversion_count?: number
          budget?: number | null
          spent?: number
        }
      }
      ai_insights: {
        Row: {
          id: string
          restaurant_id: string
          insight_type: string
          title: string
          description: string | null
          data: any
          confidence_score: number | null
          is_read: boolean
          is_actionable: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          insight_type: string
          title: string
          description?: string | null
          data: any
          confidence_score?: number | null
          is_read?: boolean
          is_actionable?: boolean
        }
        Update: {
          insight_type?: string
          title?: string
          description?: string | null
          data?: any
          confidence_score?: number | null
          is_read?: boolean
          is_actionable?: boolean
        }
      }
    }
  }
}

export const getCurrentUserRestaurant = async () => {
  try {
    const client = createClient()
    const {
      data: { user },
    } = await client.auth.getUser()

    if (!user) return null

    const { data: restaurant } = await client.from("restaurants").select("*").eq("owner_id", user.id).single()

    return restaurant
  } catch (error) {
    console.error("[v0] Failed to get current user restaurant:", error)
    return null
  }
}
