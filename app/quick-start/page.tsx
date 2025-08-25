"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ChefHat, Globe, QrCode, Sparkles, ArrowRight, Plus, Upload, Eye } from 'lucide-react'

export default function QuickStartPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-900 mb-3">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Quick Start</h1>
          <p className="text-gray-600 mt-1">
            Three simple steps to get your restaurant live. No technical setup needed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Step 1 */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  1) Add your restaurant basics
                </CardTitle>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">1–2 min</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                Name, address, hours, and a logo. You can edit anytime.
              </p>
              <Link href="/setup/restaurant-info">
                <Button className="bg-gray-900 text-white hover:bg-gray-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Open Profile Setup
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  2) Add your first menu item
                </CardTitle>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">1–2 min</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                Start with one item. You can upload or import later.
              </p>
              <div className="flex gap-2">
                <Link href="/menu?openAdd=1">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Menu
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  3) Publish and share
                </CardTitle>
                <Badge className="bg-green-50 text-green-700 border-green-200">Go live</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                Publish your menu, share a link, or print a QR code for your tables.
              </p>
              <div className="flex gap-2">
                <Link href="/menu">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview/Publish
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button className="bg-black text-white hover:bg-gray-800">
                    <QrCode className="h-4 w-4 mr-2" />
                    Get QR Code
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-white border-gray-200">
            <CardContent className="py-4">
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  You can always come back here if you get stuck.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  Nothing is permanent. Edit, unpublish, or delete anytime.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  Want help? We can do this for you. Open support from the top-right of the app.
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => router.push("/menu")} variant="outline">
              Continue to Menu
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
