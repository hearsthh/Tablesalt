"use client"

import { useEffect } from "react"
import { useRestaurantStore } from "../store/restaurant-store"
import { initializeMockData } from "../store/restaurant-store"

export const useMenuData = () => {
  const { restaurant, categories, menuItems, isLoading, error, lastUpdated, setLoading } = useRestaurantStore()

  useEffect(() => {
    // Initialize with mock data if not already loaded
    if (!restaurant && categories.length === 0) {
      setLoading(true)

      // Simulate loading delay
      setTimeout(() => {
        initializeMockData()
        setLoading(false)
      }, 1000)
    }
  }, [restaurant, categories.length, setLoading])

  return {
    restaurant,
    categories,
    menuItems,
    isLoading,
    error,
    lastUpdated,
  }
}
