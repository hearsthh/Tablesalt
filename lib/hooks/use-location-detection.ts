"use client"

import { useState, useEffect } from "react"

interface LocationData {
  country: string
  city: string
  countryCode: string
  currency: string
  timezone: string
  detected: boolean
  loading: boolean
  error: string | null
}

export function useLocationDetection() {
  const [location, setLocation] = useState<LocationData>({
    country: "",
    city: "",
    countryCode: "",
    currency: "USD",
    timezone: "",
    detected: false,
    loading: true,
    error: null,
  })

  useEffect(() => {
    detectLocation()
  }, [])

  const detectLocation = async () => {
    try {
      setLocation((prev) => ({ ...prev, loading: true, error: null }))

      // Try geolocation first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords
              const locationData = await reverseGeocode(latitude, longitude)
              setLocation((prev) => ({
                ...prev,
                ...locationData,
                detected: true,
                loading: false,
              }))
            } catch (error) {
              console.error("[v0] Reverse geocoding failed:", error)
              await fallbackToIPLocation()
            }
          },
          async (error) => {
            console.error("[v0] Geolocation failed:", error)
            await fallbackToIPLocation()
          },
          { timeout: 10000, enableHighAccuracy: false },
        )
      } else {
        await fallbackToIPLocation()
      }
    } catch (error) {
      console.error("[v0] Location detection failed:", error)
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: "Unable to detect location. Please select manually.",
        // Default to US
        country: "United States",
        countryCode: "US",
        currency: "USD",
        city: "New York",
      }))
    }
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    // Using a free geocoding service (you can replace with your preferred service)
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
    )

    if (!response.ok) throw new Error("Geocoding failed")

    const data = await response.json()

    return {
      country: data.countryName || "United States",
      city: data.city || data.locality || "Unknown",
      countryCode: data.countryCode || "US",
      currency: getCurrencyForCountry(data.countryCode || "US"),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  }

  const fallbackToIPLocation = async () => {
    try {
      // Fallback to IP-based location
      const response = await fetch("https://ipapi.co/json/")
      if (!response.ok) throw new Error("IP location failed")

      const data = await response.json()

      setLocation((prev) => ({
        ...prev,
        country: data.country_name || "United States",
        city: data.city || "Unknown",
        countryCode: data.country_code || "US",
        currency: data.currency || "USD",
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        detected: true,
        loading: false,
      }))
    } catch (error) {
      console.error("[v0] IP location fallback failed:", error)
      // Final fallback to default US location
      setLocation((prev) => ({
        ...prev,
        country: "United States",
        city: "New York",
        countryCode: "US",
        currency: "USD",
        timezone: "America/New_York",
        detected: false,
        loading: false,
        error: "Location detection failed. Using default location.",
      }))
    }
  }

  const getCurrencyForCountry = (countryCode: string): string => {
    const currencyMap: Record<string, string> = {
      US: "USD",
      CA: "CAD",
      GB: "GBP",
      EU: "EUR",
      DE: "EUR",
      FR: "EUR",
      IT: "EUR",
      ES: "EUR",
      NL: "EUR",
      AU: "AUD",
      IN: "INR",
      CN: "CNY",
      JP: "JPY",
      KR: "KRW",
      SG: "SGD",
      MY: "MYR",
      TH: "THB",
      AE: "AED",
      SA: "SAR",
      ZA: "ZAR",
      BR: "BRL",
      MX: "MXN",
      AR: "ARS",
      SE: "SEK",
      TR: "TRY",
      IL: "ILS",
    }
    return currencyMap[countryCode] || "USD"
  }

  const updateLocation = (newLocation: Partial<LocationData>) => {
    setLocation((prev) => ({ ...prev, ...newLocation }))
  }

  return {
    location,
    detectLocation,
    updateLocation,
    isLoading: location.loading,
    hasError: !!location.error,
  }
}
