"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface DatabaseSetupStatus {
  isInitialized: boolean
  isInitializing: boolean
  error: string | null
}

export function useDatabaseSetup() {
  const [status, setStatus] = useState<DatabaseSetupStatus>({
    isInitialized: false,
    isInitializing: false,
    error: null,
  })

  const supabase = createClient()

  const checkDatabaseStatus = async () => {
    try {
      // Check if restaurants table exists by trying to query it
      const { data, error } = await supabase.from("restaurants").select("id").limit(1)

      if (error && error.code === "PGRST116") {
        // Table doesn't exist, needs initialization
        return false
      }

      return true
    } catch (error) {
      console.log("[v0] Database check failed:", error)
      return false
    }
  }

  const initializeDatabase = async () => {
    setStatus((prev) => ({ ...prev, isInitializing: true, error: null }))

    try {
      // Create the database schema
      const schemaResponse = await fetch("/api/setup-database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create-schema" }),
      })

      if (!schemaResponse.ok) {
        throw new Error("Failed to create database schema")
      }

      // Add sample data
      const seedResponse = await fetch("/api/setup-database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed-data" }),
      })

      if (!seedResponse.ok) {
        throw new Error("Failed to seed database")
      }

      setStatus({
        isInitialized: true,
        isInitializing: false,
        error: null,
      })
    } catch (error) {
      console.error("[v0] Database initialization failed:", error)
      setStatus((prev) => ({
        ...prev,
        isInitializing: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }))
    }
  }

  useEffect(() => {
    const checkAndInitialize = async () => {
      const isInitialized = await checkDatabaseStatus()

      if (isInitialized) {
        setStatus((prev) => ({ ...prev, isInitialized: true }))
      } else {
        // Automatically initialize the database
        await initializeDatabase()
      }
    }

    checkAndInitialize()
  }, [])

  return {
    ...status,
    initializeDatabase,
  }
}
