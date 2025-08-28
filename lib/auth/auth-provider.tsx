"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updateProfile: (updates: any) => Promise<{ error: any }>
  isDemo: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo] = useState(true) // Always use demo mode for v0 preview
  const router = useRouter()

  console.log("[v0] AuthProvider initializing - isDemo:", isDemo, "isSupabaseConfigured:", isSupabaseConfigured())

  const createUserProfile = async (user: User) => {
    if (!isSupabaseConfigured()) return

    const { error } = await createClient()
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      })

    if (error) {
      console.error("Error creating user profile:", error)
    }
  }

  const createDefaultRestaurant = async (userId: string, userEmail: string) => {
    if (!isSupabaseConfigured()) return

    const { data: existingRestaurant } = await createClient()
      .from("restaurants")
      .select("id")
      .eq("owner_id", userId)
      .single()

    if (!existingRestaurant) {
      const { error } = await createClient()
        .from("restaurants")
        .insert({
          owner_id: userId,
          name: "My Restaurant",
          description: "Welcome to your restaurant! Update your details to get started.",
          email: userEmail,
          settings: {
            onboarding_completed: false,
            demo_data_loaded: true,
          },
        })

      if (error) {
        console.error("Error creating default restaurant:", error)
      }
    }
  }

  useEffect(() => {
    console.log("[v0] AuthProvider useEffect starting")

    const supabase = createClient()

    if (isDemo) {
      const mockUser = {
        id: "demo-user-id",
        email: "demo@tablesalt.ai",
        user_metadata: { full_name: "Demo Restaurant Owner" },
      } as User
      const mockSession = {
        user: mockUser,
        access_token: "demo-token",
      } as Session

      setUser(mockUser)
      setSession(mockSession)
      setLoading(false)
      return
    }

    // Get initial session
    const getSession = async () => {
      try {
        console.log("[v0] Getting initial session")
        const {
          data: { session },
        } = await supabase.auth.getSession()

        console.log("[v0] Initial session retrieved:", !!session)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        if (session?.user) {
          console.log("[v0] User found, creating profile and restaurant")
          await createUserProfile(session.user)
          await createDefaultRestaurant(session.user.id, session.user.email!)
        }
      } catch (error) {
        console.error("[v0] Error getting initial session:", error)
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state changed:", event, !!session)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === "SIGNED_IN" && session?.user) {
        await createUserProfile(session.user)
        await createDefaultRestaurant(session.user.id, session.user.email!)
        router.push("/dashboard")
      } else if (event === "SIGNED_OUT") {
        router.push("/")
      }
    })

    return () => subscription.unsubscribe()
  }, [router, isDemo])

  const signIn = async (email: string, password: string) => {
    const supabase = createClient()

    if (isDemo) {
      const mockUser = {
        id: "demo-user-id",
        email,
        user_metadata: { full_name: "Demo User" },
      } as User
      const mockSession = {
        user: mockUser,
        access_token: "demo-token",
      } as Session

      setUser(mockUser)
      setSession(mockSession)
      router.push("/dashboard")
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const supabase = createClient()

    if (isDemo) {
      return await signIn(email, password)
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  const signOut = async () => {
    const supabase = createClient()

    if (isDemo) {
      setUser(null)
      setSession(null)
      router.push("/")
      return
    }

    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const supabase = createClient()

    if (isDemo) {
      return { error: null }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  }

  const updateProfile = async (updates: any) => {
    const supabase = createClient()

    if (isDemo) {
      return { error: null }
    }

    const { error } = await supabase.auth.updateUser({
      data: updates,
    })
    return { error }
  }

  console.log("[v0] AuthProvider rendering - loading:", loading, "user:", !!user, "isDemo:", isDemo)

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    isDemo,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
