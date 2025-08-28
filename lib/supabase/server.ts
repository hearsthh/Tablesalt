import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "" && supabaseAnonKey !== "")
}

function createMockServerClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: new Error("Supabase not configured") }),
      getSession: async () => ({ data: { session: null }, error: new Error("Supabase not configured") }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error("Supabase not configured") }),
          order: () => ({
            limit: async () => ({ data: [], error: new Error("Supabase not configured") }),
          }),
        }),
        gte: () => ({
          order: async () => ({ data: [], error: new Error("Supabase not configured") }),
          lt: async () => ({ data: [], error: new Error("Supabase not configured") }),
        }),
        order: async () => ({ data: [], error: new Error("Supabase not configured") }),
      }),
    }),
  } as any
}

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  if (!isSupabaseConfigured()) {
    console.log("[v0] Supabase not configured, returning mock server client")
    return createMockServerClient()
  }

  try {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    return createSupabaseServerClient(supabaseUrl!, supabaseAnonKey!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    })
  } catch (error) {
    console.log("[v0] Error creating Supabase server client, returning mock client:", error)
    return createMockServerClient()
  }
}

export const createServerClient = createClient
export { createSupabaseServerClient }
export { isSupabaseConfigured }
