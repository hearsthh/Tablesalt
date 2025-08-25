"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-provider"
import { createClient } from "@/lib/supabase/client"

export default function DataExportPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [exportStatus, setExportStatus] = useState<string | null>(null)
  const supabase = createClient()

  const exportData = async (dataType: string) => {
    if (!user) return

    setLoading(true)
    setExportStatus("Preparing your data export...")

    try {
      let data: any = null

      switch (dataType) {
        case "profile":
          const { data: profile } = await supabase.from("restaurants").select("*").eq("owner_id", user.id)
          data = profile
          break

        case "marketing":
          const { data: marketing } = await supabase
            .from("marketing_strategies")
            .select(`
              *,
              marketing_campaigns(*),
              marketing_activities(*)
            `)
            .eq("restaurant_id", user.id)
          data = marketing
          break

        case "all":
          const { data: allData } = await supabase
            .from("restaurants")
            .select(`
              *,
              marketing_strategies(*),
              marketing_campaigns(*),
              marketing_activities(*)
            `)
            .eq("owner_id", user.id)
          data = allData
          break
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tablesalt-${dataType}-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportStatus("Export completed successfully!")
    } catch (error) {
      console.error("Export error:", error)
      setExportStatus("Export failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (!user) return

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.",
    )

    if (!confirmed) return

    setLoading(true)

    try {
      // Delete user data (cascading deletes will handle related data)
      await supabase.from("restaurants").delete().eq("owner_id", user.id)

      // Delete user account
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      if (error) throw error

      setExportStatus("Account deleted successfully. You will be redirected shortly.")

      setTimeout(() => {
        window.location.href = "/"
      }, 3000)
    } catch (error) {
      console.error("Delete error:", error)
      setExportStatus("Account deletion failed. Please contact support.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
          <p className="text-gray-600">Export your data or manage your account</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Your Data</h2>
            <p className="text-sm text-gray-600 mb-6">
              Download your data in JSON format. This includes all information associated with your account.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => exportData("profile")}
                disabled={loading}
                className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-gray-900">Profile Data</div>
                <div className="text-sm text-gray-600">Restaurant information and settings</div>
              </button>

              <button
                onClick={() => exportData("marketing")}
                disabled={loading}
                className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-gray-900">Marketing Data</div>
                <div className="text-sm text-gray-600">Strategies, campaigns, and activities</div>
              </button>

              <button
                onClick={() => exportData("all")}
                disabled={loading}
                className="w-full px-4 py-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <div className="font-medium text-blue-900">Complete Export</div>
                <div className="text-sm text-blue-600">All your data in one file</div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Warning</h3>
                  <p className="text-sm text-red-700 mt-1">
                    This will permanently delete all your restaurants, marketing data, and account information.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={deleteAccount}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Delete My Account
            </button>
          </div>
        </div>

        {exportStatus && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">{exportStatus}</p>
          </div>
        )}
      </div>
    </div>
  )
}
