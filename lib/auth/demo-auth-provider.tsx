"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface DemoUser {
  id: string
  email: string
  name: string
  role: string
  restaurant_id: string
}

interface DemoAuthContextType {
  user: DemoUser | null
  session: any
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updateProfile: (updates: any) => Promise<{ error: any }>
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined)

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    try {
      // Check for existing demo session
      if (typeof window !== "undefined") {
        const demoSession = localStorage.getItem("demo_session")
        if (demoSession) {
          const userData = JSON.parse(demoSession)
          setUser(userData)
          setSession({ user: userData })
        }
      }
    } catch (error) {
      console.error("[v0] Error loading demo session:", error)
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Demo mode - accept any email/password combination
      const demoUser: DemoUser = {
        id: "demo_user_001",
        email: email,
        name: email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        role: "owner",
        restaurant_id: "rest_001",
      }

      // Store demo session
      if (typeof window !== "undefined") {
        localStorage.setItem("demo_session", JSON.stringify(demoUser))
      }

      setUser(demoUser)
      setSession({ user: demoUser })

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)

      return { error: null }
    } catch (error) {
      console.error("[v0] Error signing in:", error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    // Demo mode - same as sign in
    return await signIn(email, password)
  }

  const signOut = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("demo_session")
      }
      setUser(null)
      setSession(null)
      router.push("/")
    } catch (error) {
      console.error("[v0] Error signing out:", error)
    }
  }

  const resetPassword = async (email: string) => {
    // Demo mode - always successful
    return { error: null }
  }

  const updateProfile = async (updates: any) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...updates }
        if (typeof window !== "undefined") {
          localStorage.setItem("demo_session", JSON.stringify(updatedUser))
        }
        setUser(updatedUser)
        setSession({ user: updatedUser })
      }
      return { error: null }
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
      return { error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  }

  if (!mounted) {
    return <div className="min-h-screen bg-white" />
  }

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>
}

export const useDemoAuth = () => {
  const context = useContext(DemoAuthContext)
  if (context === undefined) {
    throw new Error("useDemoAuth must be used within a DemoAuthProvider")
  }
  return context
}
