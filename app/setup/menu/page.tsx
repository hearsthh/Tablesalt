"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MenuDataForm } from "@/components/menu-data-form"

interface MenuData {
  id?: string
  input_method: "upload" | "scan" | "manual" | "import" | ""
  raw_menu_text: string
  raw_menu_images: string[]
  parsed_categories: any[]
  parsed_items: any[]
  pricing_data: any
  input_status: "incomplete" | "processing" | "complete" | "error"
  processing_notes: string
}

export default function MenuSetupPage() {
  const [saving, setSaving] = useState(false)

  const handleSave = useCallback(async (data: any) => {
    setSaving(true)
    try {
      // Simulate API call to save to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In real app, save to Supabase menu_data table
      console.log("Saving menu data:", data)

      // Show success message
      console.log("Menu data saved successfully!")
    } catch (error) {
      console.error("Error saving menu data:", error)
    } finally {
      setSaving(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/setup">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">Menu Setup</h1>
              <p className="text-xs text-gray-600">Configure your menu data and pricing</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <MenuDataForm onSave={handleSave} saving={saving} />
      </div>
    </div>
  )
}
