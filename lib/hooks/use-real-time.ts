"use client"

import { useEffect, useRef } from "react"
import { useRestaurantStore } from "../store/restaurant-store"

export const useRealTimeUpdates = () => {
  const { isConnected, connectionStatus, connect, disconnect } = useRestaurantStore()
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Auto-connect on mount
    connect()

    // Auto-reconnect on disconnect
    const unsubscribe = useRestaurantStore.subscribe(
      (state) => state.connectionStatus,
      (status) => {
        if (status === "disconnected" || status === "error") {
          // Attempt reconnection after 5 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("[v0] Attempting to reconnect...")
            connect()
          }, 5000)
        } else if (status === "connected") {
          // Clear reconnection timeout if connected
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
          }
        }
      },
    )

    return () => {
      unsubscribe()
      disconnect()
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connect, disconnect])

  return {
    isConnected,
    connectionStatus,
  }
}

export const useOptimisticUpdates = () => {
  const {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    updateCategory,
    deleteCategory,
    error,
    clearError,
  } = useRestaurantStore()

  return {
    // Menu item operations with optimistic updates
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,

    // Category operations with optimistic updates
    addCategory,
    updateCategory,
    deleteCategory,

    // Error handling
    error,
    clearError,
  }
}
