"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Wand2,
  Eye,
  Download,
  FileText,
  Smartphone,
  Monitor,
  Printer,
  Sparkles,
  ImageIcon,
  Type,
  Layout,
  CodeIcon as Color,
  CheckCircle,
  Star,
  Palette,
} from "lucide-react"
import Link from "next/link"

const useToast = () => {
  const toast = (options: any) => {
    console.log("Toast:", options)
  }
  return { toast }
}

export default function MenuDesignPage() {
  const [showAIPromptDialog, setShowAIPromptDialog] = useState(false)
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("templates")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDesigns, setGeneratedDesigns] = useState<any[]>([])
  const [aiPrompt, setAiPrompt] = useState({
    style: "",
    colors: "",
    layout: "",
    target: "",
  })
  const { toast } = useToast()

  const designTemplates = [
    {
      id: 1,
      name: "Modern Minimalist",
      description: "Clean, simple design with plenty of white space",
      style: "minimalist",
      colors: ["#000000", "#FFFFFF", "#F5F5F5"],
      preview: "/placeholder.svg?height=200&width=300&text=Modern+Minimalist",
      category: "modern",
      rating: 4.8,
      downloads: 1250,
      features: ["Clean typography", "Minimal colors", "Grid layout", "Mobile-first"],
      previewContent: {
        backgroundColor: "#FFFFFF",
        textColor: "#000000",
        accentColor: "#F5F5F5",
        fontFamily: "Inter",
        layout: "grid",
      },
    },
    {
      id: 2,
      name: "Rustic Charm",
      description: "Warm, cozy design with natural textures",
      style: "rustic",
      colors: ["#8B4513", "#DEB887", "#F5DEB3"],
      preview: "/placeholder.svg?height=200&width=300&text=Rustic+Charm",
      category: "traditional",
      rating: 4.6,
      downloads: 980,
      features: ["Wood textures", "Warm colors", "Script fonts", "Vintage elements"],
      previewContent: {
        backgroundColor: "#F5DEB3",
        textColor: "#8B4513",
        accentColor: "#DEB887",
        fontFamily: "Georgia",
        layout: "card",
      },
    },
    {
      id: 3,
      name: "Elegant Fine Dining",
      description: "Sophisticated design for upscale restaurants",
      style: "elegant",
      colors: ["#1C1C1C", "#D4AF37", "#FFFFFF"],
      preview: "/placeholder.svg?height=200&width=300&text=Elegant+Fine+Dining",
      category: "luxury",
      rating: 4.9,
      downloads: 750,
      features: ["Gold accents", "Serif fonts", "Premium layout", "High contrast"],
      previewContent: {
        backgroundColor: "#1C1C1C",
        textColor: "#FFFFFF",
        accentColor: "#D4AF37",
        fontFamily: "Playfair Display",
        layout: "list",
      },
    },
    {
      id: 4,
      name: "Vibrant Street Food",
      description: "Bold, colorful design for casual dining",
      style: "vibrant",
      colors: ["#FF6B35", "#F7931E", "#FFD23F"],
      preview: "/placeholder.svg?height=200&width=300&text=Vibrant+Street+Food",
      category: "casual",
      rating: 4.5,
      downloads: 1100,
      features: ["Bright colors", "Bold fonts", "Playful layout", "Food photography"],
      previewContent: {
        backgroundColor: "#FFD23F",
        textColor: "#FF6B35",
        accentColor: "#F7931E",
        fontFamily: "Montserrat",
        layout: "card",
      },
    },
    {
      id: 5,
      name: "Health & Wellness",
      description: "Fresh, green design for healthy restaurants",
      style: "healthy",
      colors: ["#4CAF50", "#8BC34A", "#CDDC39"],
      preview: "/placeholder.svg?height=200&width=300&text=Health+Wellness",
      category: "health",
      rating: 4.7,
      downloads: 650,
      features: ["Green palette", "Natural imagery", "Clean fonts", "Organic feel"],
      previewContent: {
        backgroundColor: "#F0FFF0",
        textColor: "#4CAF50",
        accentColor: "#8BC34A",
        fontFamily: "Inter",
        layout: "grid",
      },
    },
    {
      id: 6,
      name: "Classic Diner",
      description: "Retro American diner style",
      style: "retro",
      colors: ["#FF0000", "#FFFFFF", "#000000"],
      preview: "/placeholder.svg?height=200&width=300&text=Classic+Diner",
      category: "retro",
      rating: 4.4,
      downloads: 820,
      features: ["Retro colors", "Vintage fonts", "Checkered patterns", "Neon accents"],
      previewContent: {
        backgroundColor: "#FFFFFF",
        textColor: "#FF0000",
        accentColor: "#000000",
        fontFamily: "Arial",
        layout: "list",
      },
    },
  ]

  const customizationOptions = {
    fonts: [
      { name: "Inter", category: "Modern" },
      { name: "Playfair Display", category: "Elegant" },
      { name: "Roboto", category: "Clean" },
      { name: "Merriweather", category: "Traditional" },
      { name: "Montserrat", category: "Bold" },
    ],
    colorSchemes: [
      { name: "Monochrome", colors: ["#000000", "#FFFFFF", "#808080"] },
      { name: "Warm Earth", colors: ["#8B4513", "#DEB887", "#F5DEB3"] },
      { name: "Ocean Blue", colors: ["#0077BE", "#87CEEB", "#E0F6FF"] },
      { name: "Forest Green", colors: ["#228B22", "#90EE90", "#F0FFF0"] },
      { name: "Sunset Orange", colors: ["#FF4500", "#FFA500", "#FFE4B5"] },
    ],
    layouts: [
      { name: "Grid", description: "Organized in columns and rows" },
      { name: "List", description: "Vertical list format" },
      { name: "Card", description: "Individual item cards" },
      { name: "Magazine", description: "Editorial-style layout" },
    ],
  }

  const handleGenerateAIDesign = async () => {
    if (!aiPrompt.style.trim()) {
      toast({ title: "Please describe the design style you want" })
      return
    }

    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      const newDesigns = [
        {
          id: Date.now(),
          name: "AI Custom Design 1",
          description: "Generated based on your preferences",
          style: "ai-generated",
          colors: ["#2C3E50", "#E74C3C", "#ECF0F1"],
          preview: "/placeholder.svg?height=200&width=300&text=AI+Custom+1",
          category: "ai-generated",
          features: ["Custom colors", "Tailored layout", "Brand-specific", "Optimized"],
          previewContent: {
            backgroundColor: "#ECF0F1",
            textColor: "#2C3E50",
            accentColor: "#E74C3C",
            fontFamily: "Inter",
            layout: "card",
          },
        },
        {
          id: Date.now() + 1,
          name: "AI Custom Design 2",
          description: "Alternative AI-generated option",
          style: "ai-generated",
          colors: ["#8E44AD", "#3498DB", "#F8F9FA"],
          preview: "/placeholder.svg?height=200&width=300&text=AI+Custom+2",
          category: "ai-generated",
          features: ["Modern approach", "Unique style", "Brand colors", "Mobile-ready"],
          previewContent: {
            backgroundColor: "#F8F9FA",
            textColor: "#8E44AD",
            accentColor: "#3498DB",
            fontFamily: "Roboto",
            layout: "grid",
          },
        },
      ]

      setGeneratedDesigns(newDesigns)
      setIsGenerating(false)
      toast({ title: "AI designs generated!", description: "New design options created based on your preferences" })
      setShowAIPromptDialog(false)
      setActiveTab("ai-generated")
    }, 3000)
  }

  const applyTemplate = (template: any) => {
    const designChanges = {
      template: template.name,
      colors: template.colors,
      fonts: template.fonts,
      layout: template.layout,
      appliedAt: Date.now(),
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("appliedMenuDesign", JSON.stringify(designChanges))
    }

    // Open preview in new tab
    window.open("/menu/preview", "_blank")
    toast({ title: "Opening preview with template applied..." })
  }

  const handleCustomizeTemplate = (template: any) => {
    setSelectedTemplate(template)
    setShowCustomizeDialog(true)
  }

  // Enhanced preview functionality
  const handlePreviewTemplate = (template: any) => {
    // Store template temporarily for preview
    const designChanges = {
      colors: [
        { type: "color", property: "Primary Color", value: template.colors[0] },
        { type: "color", property: "Secondary Color", value: template.colors[1] || template.colors[0] },
        {
          type: "color",
          property: "Accent Color",
          value: template.colors[2] || template.colors[1] || template.colors[0],
        },
      ],
      fonts: [
        { type: "font", property: "Heading Font", value: template.previewContent.fontFamily },
        { type: "font", property: "Body Font", value: template.previewContent.fontFamily },
        { type: "font", property: "Price Font", value: template.previewContent.fontFamily },
      ],
      appliedAt: Date.now(),
    }

    localStorage.setItem("appliedMenuDesign", JSON.stringify(designChanges))

    // Open preview in new tab
    window.open("/menu/preview", "_blank")
    toast({ title: "Opening preview with template applied..." })
  }

  const handleExport = (format: string, device: string) => {
    toast({
      title: `Exporting for ${device}...`,
      description: `${format.toUpperCase()} download will start shortly`,
    })
    setShowExportDialog(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "modern":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "traditional":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "luxury":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "casual":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "health":
        return "bg-green-50 text-green-700 border-green-200"
      case "retro":
        return "bg-pink-50 text-pink-700 border-pink-200"
      case "ai-generated":
        return "bg-indigo-50 text-indigo-700 border-indigo-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Enhanced component to render design preview
  const DesignPreview = ({ template }: { template: any }) => {
    const { previewContent } = template

    return (
      <div
        className="aspect-video rounded-lg overflow-hidden border"
        style={{
          backgroundColor: previewContent.backgroundColor,
          fontFamily: previewContent.fontFamily,
        }}
      >
        <div className="p-3 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-3">
            <h3 className="text-sm font-bold" style={{ color: previewContent.textColor }}>
              Restaurant Menu
            </h3>
          </div>

          {/* Sample Menu Item */}
          <div
            className="flex-1 p-2 rounded border"
            style={{
              backgroundColor: template.style === "elegant" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)",
              borderColor: previewContent.accentColor,
            }}
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1">
                <h4 className="text-xs font-semibold" style={{ color: previewContent.textColor }}>
                  Sample Dish
                </h4>
                <p className="text-xs opacity-75 line-clamp-2" style={{ color: previewContent.textColor }}>
                  Delicious description of the menu item
                </p>
              </div>
              <span className="text-xs font-bold ml-2" style={{ color: previewContent.accentColor }}>
                $12.99
              </span>
            </div>

            {/* Tags */}
            <div className="flex gap-1 mt-1">
              <div
                className="text-xs px-1 py-0.5 rounded"
                style={{
                  backgroundColor: previewContent.accentColor + "20",
                  color: previewContent.accentColor,
                }}
              >
                Popular
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-2">
            <div className="text-xs" style={{ color: previewContent.textColor, opacity: 0.7 }}>
              {template.name} Style
            </div>
          </div>
        </div>
      </div>
    )
  }

  const applyCustomDesign = () => {
    const designChanges = {
      colors: [],
      fonts: [],
      appliedAt: Date.now(),
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("appliedMenuDesign", JSON.stringify(designChanges))
    }

    // Open preview in new tab
    window.open("/menu/preview", "_blank")
    toast({ title: "Opening preview with template applied..." })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/menu">
              <Button variant="ghost" size="sm" className="p-1 sm:px-3">
                <ArrowLeft className="h-4 w-4 mr-0 sm:mr-1" />
                <span className="hidden sm:inline">Back to Menu</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900">AI Menu Designer</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Create beautiful menu designs with AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs px-2 sm:px-3 bg-transparent">
                  <Download className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Export Menu Design</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Export Format</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        onClick={() => handleExport("pdf", "print")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button
                        onClick={() => handleExport("png", "digital")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        PNG
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Device Type</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Button
                        onClick={() => handleExport("pdf", "mobile")}
                        className="w-full justify-start text-xs"
                        variant="outline"
                      >
                        <Smartphone className="h-3 w-3 mr-1" />
                        Mobile
                      </Button>
                      <Button
                        onClick={() => handleExport("pdf", "desktop")}
                        className="w-full justify-start text-xs"
                        variant="outline"
                      >
                        <Monitor className="h-3 w-3 mr-1" />
                        Desktop
                      </Button>
                      <Button
                        onClick={() => handleExport("pdf", "print")}
                        className="w-full justify-start text-xs"
                        variant="outline"
                      >
                        <Printer className="h-3 w-3 mr-1" />
                        Print
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showAIPromptDialog} onOpenChange={setShowAIPromptDialog}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800 h-8 px-2 sm:px-3 text-xs">
                  <Wand2 className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">AI Design</span>
                  <span className="sm:hidden">AI</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>AI Menu Design Generator</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Describe your desired style</Label>
                    <Textarea
                      value={aiPrompt.style}
                      onChange={(e) => setAiPrompt({ ...aiPrompt, style: e.target.value })}
                      placeholder="e.g., modern and clean for a tech startup cafe, warm and rustic for a family restaurant..."
                      className="min-h-[80px] text-sm"
                    />
                  </div>
                  <div>
                    <Label>Color preferences</Label>
                    <Input
                      value={aiPrompt.colors}
                      onChange={(e) => setAiPrompt({ ...aiPrompt, colors: e.target.value })}
                      placeholder="e.g., blue and white, earth tones, vibrant colors"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label>Layout preference</Label>
                    <Select
                      value={aiPrompt.layout}
                      onValueChange={(value) => setAiPrompt({ ...aiPrompt, layout: value })}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select layout style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid Layout</SelectItem>
                        <SelectItem value="list">List Layout</SelectItem>
                        <SelectItem value="card">Card Layout</SelectItem>
                        <SelectItem value="magazine">Magazine Style</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Target audience</Label>
                    <Input
                      value={aiPrompt.target}
                      onChange={(e) => setAiPrompt({ ...aiPrompt, target: e.target.value })}
                      placeholder="e.g., young professionals, families, fine dining customers"
                      className="text-sm"
                    />
                  </div>
                  <Button onClick={handleGenerateAIDesign} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Generating Design...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate AI Design
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-semibold text-gray-900">
                  {designTemplates.length + generatedDesigns.length}
                </div>
                <div className="text-xs text-gray-500">Design Templates</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-semibold text-gray-900">6</div>
                <div className="text-xs text-gray-500">Style Categories</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-semibold text-blue-600">AI</div>
                <div className="text-xs text-gray-500">Custom Generation</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-semibold text-green-600">4.7</div>
                <div className="text-xs text-gray-500">Avg Rating</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Design Impact Visualization */}
        <Card className="border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">How AI Design Changes Work</h3>
                <p className="text-sm text-gray-600">See exactly what changes when you apply design enhancements</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <Palette className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Color Scheme</h4>
                <p className="text-xs text-gray-600">
                  Changes menu background, text colors, price highlights, and button colors
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Type className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Typography</h4>
                <p className="text-xs text-gray-600">
                  Updates fonts for menu titles, item descriptions, and price displays
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Live Preview</h4>
                <p className="text-xs text-gray-600">See changes instantly in menu preview with real menu items</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full flex-shrink-0"></div>
                <p className="text-sm text-yellow-800">
                  <strong>Tip:</strong> Click "Preview" on any template to see how it looks with your actual menu items
                  before applying
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Tabs */}
        <div className="bg-white border border-gray-100 rounded-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
              <TabsTrigger value="templates">Design Templates</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="ai-generated" className="relative">
                AI Generated
                {generatedDesigns.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Templates Tab */}
            <TabsContent value="templates" className="m-0">
              <div className="p-4 space-y-4">
                <div className="text-sm text-gray-600 mb-4">Choose from professionally designed menu templates</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {designTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="border border-gray-100 bg-white hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {/* Enhanced Design Preview */}
                          <DesignPreview template={template} />

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                              <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                                {template.category}
                              </Badge>
                            </div>

                            <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                  {template.rating}
                                </div>
                                <div className="flex items-center">
                                  <Download className="h-3 w-3 mr-1" />
                                  {template.downloads}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {template.features.slice(0, 2).map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {template.features.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{template.features.length - 2} more
                                </Badge>
                              )}
                            </div>

                            <div className="flex space-x-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs bg-transparent"
                                onClick={() => handlePreviewTemplate(template)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                              <Button
                                onClick={() => applyTemplate(template)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                size="sm"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Apply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Enhanced Customize Tab */}
            <TabsContent value="customize" className="m-0">
              <div className="p-4 space-y-6">
                <div className="text-sm text-gray-600 mb-4">
                  Customize your menu design with fonts, colors, and layouts
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Typography */}
                  <Card className="border border-gray-100 bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center text-base">
                        <Type className="h-4 w-4 mr-2" />
                        Typography
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {customizationOptions.fonts.map((font) => (
                        <div
                          key={font.name}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div>
                            <div className="font-medium text-sm" style={{ fontFamily: font.name }}>
                              {font.name}
                            </div>
                            <div className="text-xs text-gray-500">{font.category}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs bg-transparent"
                            onClick={() => {
                              const designChanges = {
                                colors: [],
                                fonts: [
                                  { type: "font", property: "Heading Font", value: font.name },
                                  { type: "font", property: "Body Font", value: font.name },
                                  { type: "font", property: "Price Font", value: font.name },
                                ],
                                appliedAt: Date.now(),
                              }
                              if (typeof window !== "undefined") {
                                localStorage.setItem("appliedMenuDesign", JSON.stringify(designChanges))
                              }
                              toast({ title: "Font applied!", description: `${font.name} font has been applied` })
                            }}
                          >
                            Apply
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Color Schemes */}
                  <Card className="border border-gray-100 bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center text-base">
                        <Color className="h-4 w-4 mr-2" />
                        Color Schemes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {customizationOptions.colorSchemes.map((scheme) => (
                        <div
                          key={scheme.name}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                              {scheme.colors.map((color, index) => (
                                <div
                                  key={index}
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{scheme.name}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs bg-transparent"
                            onClick={() => {
                              const designChanges = {
                                colors: [
                                  { type: "color", property: "Primary Color", value: scheme.colors[0] },
                                  {
                                    type: "color",
                                    property: "Secondary Color",
                                    value: scheme.colors[1] || scheme.colors[0],
                                  },
                                  {
                                    type: "color",
                                    property: "Accent Color",
                                    value: scheme.colors[2] || scheme.colors[1] || scheme.colors[0],
                                  },
                                ],
                                fonts: [],
                                appliedAt: Date.now(),
                              }
                              if (typeof window !== "undefined") {
                                localStorage.setItem("appliedMenuDesign", JSON.stringify(designChanges))
                              }
                              toast({
                                title: "Colors applied!",
                                description: `${scheme.name} color scheme has been applied`,
                              })
                            }}
                          >
                            Apply
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Layout Options */}
                  <Card className="border border-gray-100 bg-white lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center text-base">
                        <Layout className="h-4 w-4 mr-2" />
                        Layout Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {customizationOptions.layouts.map((layout) => (
                          <div
                            key={layout.name}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              toast({ title: "Layout applied!", description: `${layout.name} layout has been applied` })
                            }}
                          >
                            <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center">
                              <Layout className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="text-sm font-medium mb-1">{layout.name}</div>
                            <div className="text-xs text-gray-500">{layout.description}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Enhanced AI Generated Tab */}
            <TabsContent value="ai-generated" className="m-0">
              <div className="p-4 space-y-4">
                {generatedDesigns.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wand2 className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No AI Generated Designs Yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                      Use the AI Design button to create custom menu designs based on your specific requirements and
                      brand.
                    </p>
                    <Button
                      onClick={() => setShowAIPromptDialog(true)}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate AI Design
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Custom AI-generated designs based on your specific requirements
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAIPromptDialog(true)}
                        className="text-xs bg-transparent"
                      >
                        <Wand2 className="h-3 w-3 mr-1" />
                        Generate More
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {generatedDesigns.map((design) => (
                        <Card
                          key={design.id}
                          className="border border-gray-100 bg-white hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <DesignPreview template={design} />

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-gray-900 text-sm">{design.name}</h3>
                                  <Badge className={`text-xs ${getCategoryColor(design.category)}`}>AI Generated</Badge>
                                </div>

                                <p className="text-xs text-gray-600 line-clamp-2">{design.description}</p>

                                <div className="flex flex-wrap gap-1">
                                  {design.features.map((feature: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>

                                <div className="flex space-x-2 pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs bg-transparent"
                                    onClick={() => handlePreviewTemplate(design)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Preview
                                  </Button>
                                  <Button
                                    onClick={() => applyTemplate(design)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                    size="sm"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Apply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Current Design Status Indicator */}
      {(() => {
        if (typeof window === "undefined") return null

        const appliedDesign = localStorage.getItem("appliedMenuDesign")
        const appliedTemplate = localStorage.getItem("appliedMenuTemplate")

        if (appliedDesign && appliedTemplate) {
          const design = JSON.parse(appliedDesign)
          const template = JSON.parse(appliedTemplate)

          return (
            <div className="fixed bottom-6 right-6 z-50">
              <Card className="border border-green-200 bg-green-50 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-green-900 text-sm">Design Active</div>
                      <div className="text-xs text-green-700">{template.name}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open("/menu/preview", "_blank")}
                      className="text-xs bg-white"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        }
        return null
      })()}
    </div>
  )
}
