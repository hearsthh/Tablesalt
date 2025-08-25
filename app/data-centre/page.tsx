"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DataCentrePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/integrations?view=data-map")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Redirecting to Integrations Hub...</h1>
        <p className="text-gray-600">Data management is now part of the Integrations Hub</p>
      </div>
    </div>
  )
}
