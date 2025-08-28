"use client"

import { CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  availability: boolean
}

interface Category {
  id: string
  name: string
  items: MenuItem[]
}

export default function MenuPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        // Simple demo data instead of complex API calls
        setCategories([
          {
            id: "1",
            name: "Appetizers",
            items: [
              {
                id: "1",
                name: "Bruschetta",
                description: "Fresh tomatoes and basil",
                price: 12.99,
                category: "Appetizers",
                availability: true,
              },
              {
                id: "2",
                name: "Calamari",
                description: "Crispy fried squid",
                price: 14.99,
                category: "Appetizers",
                availability: true,
              },
            ],
          },
          {
            id: "2",
            name: "Main Courses",
            items: [
              {
                id: "3",
                name: "Margherita Pizza",
                description: "Classic tomato and mozzarella",
                price: 18.99,
                category: "Main Courses",
                availability: true,
              },
              {
                id: "4",
                name: "Pasta Carbonara",
                description: "Creamy pasta with pancetta",
                price: 22.99,
                category: "Main Courses",
                availability: true,
              },
            ],
          },
        ])
        setLoading(false)
      } catch (error) {
        console.error("Failed to load menu:", error)
        setLoading(false)
      }
    }

    loadMenuData()
  }, [])

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length > 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-600">Manage your restaurant menu items</p>
          </div>
          <Button onClick={() => router.push("/menu/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {category.name}
                  <Badge variant="outline">{category.items.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <Badge
                            className={item.availability ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                          >
                            {item.availability ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">${item.price}</span>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
