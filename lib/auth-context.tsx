"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "owner" | "manager" | "staff"
  restaurantId: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (email: string, password: string, name: string, restaurantName: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for existing session
      const savedUser = localStorage.getItem("tablesalt_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user data - in production, this would come from your API
    const mockUser: User = {
      id: "1",
      email,
      name: email.split("@")[0],
      role: "owner",
      restaurantId: "rest_1",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
    }

    setUser(mockUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("tablesalt_user", JSON.stringify(mockUser))
    }
    setIsLoading(false)
    return true
  }

  const signup = async (email: string, password: string, name: string, restaurantName: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock user creation
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: "owner",
      restaurantId: `rest_${Date.now()}`,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
    }

    setUser(newUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("tablesalt_user", JSON.stringify(newUser))
    }
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("tablesalt_user")
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
