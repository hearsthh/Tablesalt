"use client"

import { useState } from "react"

export default function TestSupabasePage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/test-supabase")
      const testResult = await response.json()

      console.log("[v0] Test result:", testResult)
      setResult(testResult)
    } catch (error) {
      console.error("[v0] Error during test:", error)
      setResult({
        success: false,
        error: "Test failed with error",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>

      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          <strong>GitHub Connection Issue:</strong> If your Supabase project is tied to GitHub and this v0 project isn't
          connected to the same GitHub account, the environment variables might not have proper access.
        </p>
      </div>

      <button
        onClick={handleTest}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Connection"}
      </button>

      {result && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="font-semibold mb-2">Test Result:</h2>
          <div className={`p-2 rounded text-sm ${result.success ? "bg-green-100" : "bg-red-100"}`}>
            <p>
              <strong>Status:</strong> {result.success ? "✅ Connected" : "❌ Failed"}
            </p>
            {result.error && (
              <p>
                <strong>Error:</strong> {result.error}
              </p>
            )}
            {result.details && (
              <p>
                <strong>Details:</strong> {result.details}
              </p>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>Direct Environment Check:</strong>
          </p>
          <p>NEXT_PUBLIC_SUPABASE_URL: {result.envVars?.hasUrl ? "✅ Found" : "❌ Missing"}</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {result.envVars?.hasKey ? "✅ Found" : "❌ Missing"}</p>
          <p className="mt-2 text-xs text-gray-500">
            Debug: URL length: {result.envVars?.urlLength || 0}, Key length: {result.envVars?.keyLength || 0}
          </p>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-sm">
        <p>
          <strong>Environment Variable Issue:</strong>
        </p>
        <p className="mt-2 text-red-600 font-medium">
          The environment variables you added (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are not being
          loaded into the application runtime.
        </p>
        <p>
          <strong>Possible Solutions:</strong>
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Try refreshing the v0 preview or restarting the development server</li>
          <li>Check if the environment variables are properly saved in v0 Settings → Environment Variables</li>
          <li>Verify the variable names exactly match: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          <li>Create a new Supabase project directly (not through GitHub integration)</li>
        </ul>
      </div>
    </div>
  )
}
