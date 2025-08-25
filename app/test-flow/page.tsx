"use client"

import { UserFlowTestGuide } from "@/components/user-flow-test-guide"

export default function TestFlowPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tablesalt AI - Complete User Flow Test</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow this comprehensive test guide to experience all features of the restaurant management system. All
            functionality works with mock data for complete testing.
          </p>
        </div>
        <UserFlowTestGuide />
      </div>
    </div>
  )
}
