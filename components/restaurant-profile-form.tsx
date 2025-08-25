"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Upload,
  MapPin,
  Clock,
  Phone,
  Globe,
  Camera,
  Palette,
  Users,
  Star,
  Sparkles,
  Save,
  Loader2,
} from "lucide-react"

interface RestaurantProfileFormProps {
  onSave?: (data: any) => Promise<void>
  saving?: boolean
}

interface MultiSelectFieldProps {
  label: string
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  allowCustom?: boolean
  placeholder?: string
}

interface ImageGalleryProps {
  label: string
  images: string[]
  maxImages: number
  onImagesChange: (images: string[]) => void
}

function MultiSelectField({ label, options, value, onChange, allowCustom = true, placeholder }: MultiSelectFieldProps) {
  const [customValue, setCustomValue] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleToggle = (option: string) => {
    const newValue = value.includes(option) ? value.filter((v) => v !== option) : [...value, option]
    onChange(newValue)
  }

  const handleAddCustom = () => {
    if (customValue.trim() && !value.includes(customValue.trim())) {
      onChange([...value, customValue.trim()])
      setCustomValue("")
      setShowCustomInput(false)
    }
  }

  const handleRemove = (option: string) => {
    onChange(value.filter((v) => v !== option))
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>

      {/* Selected items */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <Badge key={item} variant="secondary" className="px-2 py-1">
              {item}
              <button onClick={() => handleRemove(item)} className="ml-1 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Options grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${label}-${option}`}
              checked={value.includes(option)}
              onCheckedChange={() => handleToggle(option)}
            />
            <Label htmlFor={`${label}-${option}`} className="text-sm cursor-pointer">
              {option}
            </Label>
          </div>
        ))}
      </div>

      {/* Custom input */}
      {allowCustom && (
        <div className="space-y-2">
          {!showCustomInput ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCustomInput(true)}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Custom Option
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Input
                placeholder={placeholder || "Enter custom option"}
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleAddCustom()}
              />
              <Button type="button" size="sm" onClick={handleAddCustom}>
                Add
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowCustomInput(false)
                  setCustomValue("")
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ImageGallery({ label, images, maxImages, onImagesChange }: ImageGalleryProps) {
  const handleImageUpload = () => {
    // Simulate image upload
    const newImage = `/placeholder.svg?height=200&width=300&text=${label}`
    if (images.length < maxImages) {
      onImagesChange([...images, newImage])
    }
  }

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-xs text-gray-500">
          {images.length}/{maxImages}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image || "/placeholder.svg"}
              alt={`${label} ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            onClick={handleImageUpload}
            className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
          >
            <div className="text-center">
              <Camera className="h-6 w-6 mx-auto text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Add Photo</span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

export function RestaurantProfileForm({ onSave, saving = false }: RestaurantProfileFormProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    location: false,
    hours: false,
    contact: false,
    details: false,
    amenities: false,
    services: false,
    quality: false,
    technology: false,
    content: false,
    branding: false,
    gallery: false,
    chef: false,
  })

  const [formData, setFormData] = useState({
    // Basic Information
    restaurant_name: "",
    business_type: "",
    cuisine_type: [] as string[],
    establishment_year: "",
    chain_or_independent: "",

    // Location & Contact
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    coordinates: { lat: 0, lng: 0 },
    phone_number: "",
    email: "",
    website: "",

    // Operating Hours
    monday_hours: "",
    tuesday_hours: "",
    wednesday_hours: "",
    thursday_hours: "",
    friday_hours: "",
    saturday_hours: "",
    sunday_hours: "",
    holiday_hours: "",

    // Restaurant Details
    seating_capacity: "",
    private_dining_capacity: "",
    dress_code: "",
    price_range: "",
    average_meal_cost: "",

    // Amenities & Features
    dining_features: [] as string[],
    dietary_accommodations: [] as string[],
    ambiance_tags: [] as string[],
    music_entertainment: [] as string[],
    parking_options: [] as string[],
    payment_methods: [] as string[],

    // Services
    special_services: [] as string[],
    catering_services: [] as string[],
    delivery_options: [] as string[],
    reservation_policy: "",
    cancellation_policy: "",

    // Quality & Recognition
    sustainability_practices: [] as string[],
    awards_certifications: [] as string[],
    health_safety_measures: [] as string[],
    accessibility_features: [] as string[],

    // Technology & Innovation
    technology_features: [] as string[],
    online_ordering: false,
    mobile_app: false,
    loyalty_program: false,

    // Content & Marketing
    brand_story: "",
    chef_specialties: "",
    signature_dishes: [] as string[],
    wine_beer_program: "",
    happy_hour_details: "",
    community_involvement: "",

    // Social Media & Digital Presence
    facebook_handle: "",
    instagram_handle: "",
    twitter_handle: "",
    tiktok_handle: "",
    linkedin_handle: "",
    youtube_channel: "",
    google_business_profile: "",

    // Brand Assets
    logo_url: "",
    brand_colors: {
      primary: "#000000",
      secondary: "#666666",
      accent: "#ff6b35",
    },
    brand_assets: [] as string[],

    // Photo Galleries
    interior_photos: [] as string[],
    exterior_photos: [] as string[],
    food_photos: [] as string[],
    team_photos: [] as string[],

    // Chef Information
    chef_name: "",
    chef_photo: "",
    chef_bio: "",
    chef_specialties_detailed: "",
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const updateFormField = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    if (onSave) {
      await onSave(formData)
    }
  }

  const generateAIContent = async (field: string) => {
    // Simulate AI content generation
    const aiContent = {
      brand_story:
        "Our restaurant was founded with a passion for bringing authentic flavors and exceptional dining experiences to our community. We believe in using fresh, locally-sourced ingredients to create memorable meals that bring people together.",
      chef_bio:
        "Chef John Smith brings over 15 years of culinary experience to our kitchen. Trained in classical French techniques and inspired by global flavors, Chef Smith creates innovative dishes that celebrate both tradition and creativity.",
      chef_specialties_detailed:
        "Specializing in modern American cuisine with Mediterranean influences, featuring house-made pasta, wood-fired proteins, and seasonal vegetable preparations.",
    }

    updateFormField(field, aiContent[field as keyof typeof aiContent] || "")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Restaurant Profile Setup</h2>
          <p className="text-gray-600">Complete your restaurant's profile information</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-black text-white hover:bg-gray-800">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <Collapsible open={expandedSections.basic} onOpenChange={() => toggleSection("basic")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Basic Information
                  </div>
                  {expandedSections.basic ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Restaurant Name</Label>
                    <Input
                      placeholder="Enter restaurant name"
                      value={formData.restaurant_name}
                      onChange={(e) => updateFormField("restaurant_name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Business Type</Label>
                    <Select
                      value={formData.business_type}
                      onValueChange={(value) => updateFormField("business_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="cafe">Cafe</SelectItem>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="fast-food">Fast Food</SelectItem>
                        <SelectItem value="food-truck">Food Truck</SelectItem>
                        <SelectItem value="catering">Catering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Establishment Year</Label>
                    <Input
                      placeholder="e.g., 2020"
                      value={formData.establishment_year}
                      onChange={(e) => updateFormField("establishment_year", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Chain or Independent</Label>
                    <Select
                      value={formData.chain_or_independent}
                      onValueChange={(value) => updateFormField("chain_or_independent", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="independent">Independent</SelectItem>
                        <SelectItem value="chain">Chain</SelectItem>
                        <SelectItem value="franchise">Franchise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <MultiSelectField
                  label="Cuisine Type"
                  options={[
                    "American",
                    "Italian",
                    "Mexican",
                    "Chinese",
                    "Japanese",
                    "Indian",
                    "French",
                    "Mediterranean",
                    "Thai",
                    "Korean",
                    "Vietnamese",
                    "Greek",
                  ]}
                  value={formData.cuisine_type}
                  onChange={(value) => updateFormField("cuisine_type", value)}
                  placeholder="Enter cuisine type"
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Location & Map */}
        <Card>
          <Collapsible open={expandedSections.location} onOpenChange={() => toggleSection("location")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location & Map
                  </div>
                  {expandedSections.location ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter full address"
                          value={formData.address}
                          onChange={(e) => updateFormField("address", e.target.value)}
                        />
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => updateFormField("city", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input
                          placeholder="State"
                          value={formData.state}
                          onChange={(e) => updateFormField("state", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>ZIP Code</Label>
                        <Input
                          placeholder="ZIP"
                          value={formData.zip_code}
                          onChange={(e) => updateFormField("zip_code", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Input
                          placeholder="Country"
                          value={formData.country}
                          onChange={(e) => updateFormField("country", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Map Preview</Label>
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border">
                        <div className="text-center">
                          <MapPin className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Map will appear here</p>
                          {formData.coordinates.lat !== 0 && (
                            <p className="text-xs text-gray-400 mt-1">
                              {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Brand Assets */}
        <Card>
          <Collapsible open={expandedSections.branding} onOpenChange={() => toggleSection("branding")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Brand Assets
                  </div>
                  {expandedSections.branding ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Logo</Label>
                      <div className="flex items-center space-x-4">
                        {formData.logo_url ? (
                          <div className="relative">
                            <img
                              src={formData.logo_url || "/placeholder.svg"}
                              alt="Restaurant Logo"
                              className="w-16 h-16 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => updateFormField("logo_url", "")}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            <Camera className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => updateFormField("logo_url", "/placeholder.svg?height=64&width=64&text=Logo")}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Brand Colors</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Label className="w-20 text-sm">Primary</Label>
                          <input
                            type="color"
                            value={formData.brand_colors.primary}
                            onChange={(e) => updateNestedField("brand_colors", "primary", e.target.value)}
                            className="w-12 h-8 rounded border"
                          />
                          <span className="text-sm text-gray-600">{formData.brand_colors.primary}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Label className="w-20 text-sm">Secondary</Label>
                          <input
                            type="color"
                            value={formData.brand_colors.secondary}
                            onChange={(e) => updateNestedField("brand_colors", "secondary", e.target.value)}
                            className="w-12 h-8 rounded border"
                          />
                          <span className="text-sm text-gray-600">{formData.brand_colors.secondary}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Label className="w-20 text-sm">Accent</Label>
                          <input
                            type="color"
                            value={formData.brand_colors.accent}
                            onChange={(e) => updateNestedField("brand_colors", "accent", e.target.value)}
                            className="w-12 h-8 rounded border"
                          />
                          <span className="text-sm text-gray-600">{formData.brand_colors.accent}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ImageGallery
                      label="Brand Assets"
                      images={formData.brand_assets}
                      maxImages={6}
                      onImagesChange={(images) => updateFormField("brand_assets", images)}
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Chef Introduction */}
        <Card>
          <Collapsible open={expandedSections.chef} onOpenChange={() => toggleSection("chef")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Chef Introduction
                  </div>
                  {expandedSections.chef ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Chef Name</Label>
                      <Input
                        placeholder="Enter chef's name"
                        value={formData.chef_name}
                        onChange={(e) => updateFormField("chef_name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Chef Photo</Label>
                      <div className="flex items-center space-x-4">
                        {formData.chef_photo ? (
                          <div className="relative">
                            <img
                              src={formData.chef_photo || "/placeholder.svg"}
                              alt="Chef Photo"
                              className="w-20 h-20 object-cover rounded-full border"
                            />
                            <button
                              onClick={() => updateFormField("chef_photo", "")}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                            <Camera className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => updateFormField("chef_photo", "/placeholder.svg?height=80&width=80&text=Chef")}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Chef Biography</Label>
                        <Button variant="outline" size="sm" onClick={() => generateAIContent("chef_bio")}>
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Generate
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Tell us about the chef's background and experience..."
                        value={formData.chef_bio}
                        onChange={(e) => updateFormField("chef_bio", e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Chef Specialties</Label>
                      <Textarea
                        placeholder="What are the chef's signature dishes and specialties?"
                        value={formData.chef_specialties_detailed}
                        onChange={(e) => updateFormField("chef_specialties_detailed", e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Photo Galleries */}
        <Card>
          <Collapsible open={expandedSections.gallery} onOpenChange={() => toggleSection("gallery")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Photo Galleries
                  </div>
                  {expandedSections.gallery ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ImageGallery
                    label="Interior Photos"
                    images={formData.interior_photos}
                    maxImages={8}
                    onImagesChange={(images) => updateFormField("interior_photos", images)}
                  />

                  <ImageGallery
                    label="Exterior Photos"
                    images={formData.exterior_photos}
                    maxImages={5}
                    onImagesChange={(images) => updateFormField("exterior_photos", images)}
                  />

                  <ImageGallery
                    label="Food Photos"
                    images={formData.food_photos}
                    maxImages={12}
                    onImagesChange={(images) => updateFormField("food_photos", images)}
                  />

                  <ImageGallery
                    label="Team Photos"
                    images={formData.team_photos}
                    maxImages={6}
                    onImagesChange={(images) => updateFormField("team_photos", images)}
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Contact Information */}
        <Card>
          <Collapsible open={expandedSections.contact} onOpenChange={() => toggleSection("contact")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </div>
                  {expandedSections.contact ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      placeholder="(555) 123-4567"
                      value={formData.phone_number}
                      onChange={(e) => updateFormField("phone_number", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="info@restaurant.com"
                      value={formData.email}
                      onChange={(e) => updateFormField("email", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      placeholder="https://restaurant.com"
                      value={formData.website}
                      onChange={(e) => updateFormField("website", e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-medium">Social Media Handles</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Instagram</Label>
                      <Input
                        placeholder="@restaurant"
                        value={formData.instagram_handle}
                        onChange={(e) => updateFormField("instagram_handle", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Facebook</Label>
                      <Input
                        placeholder="restaurant"
                        value={formData.facebook_handle}
                        onChange={(e) => updateFormField("facebook_handle", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Twitter</Label>
                      <Input
                        placeholder="@restaurant"
                        value={formData.twitter_handle}
                        onChange={(e) => updateFormField("twitter_handle", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>TikTok</Label>
                      <Input
                        placeholder="@restaurant"
                        value={formData.tiktok_handle}
                        onChange={(e) => updateFormField("tiktok_handle", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Operating Hours */}
        <Card>
          <Collapsible open={expandedSections.hours} onOpenChange={() => toggleSection("hours")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Operating Hours
                  </div>
                  {expandedSections.hours ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {[
                  { day: "Monday", field: "monday_hours" },
                  { day: "Tuesday", field: "tuesday_hours" },
                  { day: "Wednesday", field: "wednesday_hours" },
                  { day: "Thursday", field: "thursday_hours" },
                  { day: "Friday", field: "friday_hours" },
                  { day: "Saturday", field: "saturday_hours" },
                  { day: "Sunday", field: "sunday_hours" },
                ].map(({ day, field }) => (
                  <div key={day} className="flex items-center space-x-4">
                    <Label className="w-24">{day}</Label>
                    <Input
                      placeholder="e.g., 9:00 AM - 10:00 PM or Closed"
                      value={formData[field as keyof typeof formData] as string}
                      onChange={(e) => updateFormField(field, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ))}

                <div className="flex items-center space-x-4 pt-4 border-t">
                  <Label className="w-24">Holiday Hours</Label>
                  <Input
                    placeholder="Special holiday hours or closures"
                    value={formData.holiday_hours}
                    onChange={(e) => updateFormField("holiday_hours", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Restaurant Details */}
        <Card>
          <Collapsible open={expandedSections.details} onOpenChange={() => toggleSection("details")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Restaurant Details
                  </div>
                  {expandedSections.details ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Seating Capacity</Label>
                    <Input
                      placeholder="e.g., 50"
                      value={formData.seating_capacity}
                      onChange={(e) => updateFormField("seating_capacity", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Private Dining Capacity</Label>
                    <Input
                      placeholder="e.g., 20"
                      value={formData.private_dining_capacity}
                      onChange={(e) => updateFormField("private_dining_capacity", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dress Code</Label>
                    <Select value={formData.dress_code} onValueChange={(value) => updateFormField("dress_code", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dress code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="smart-casual">Smart Casual</SelectItem>
                        <SelectItem value="business-casual">Business Casual</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="no-dress-code">No Dress Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Price Range</Label>
                    <Select
                      value={formData.price_range}
                      onValueChange={(value) => updateFormField("price_range", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="$">$ (Under $15)</SelectItem>
                        <SelectItem value="$$">$$ ($15-30)</SelectItem>
                        <SelectItem value="$$$">$$$ ($30-60)</SelectItem>
                        <SelectItem value="$$$$">$$$$ ($60+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Average Meal Cost</Label>
                  <Input
                    placeholder="e.g., $25 per person"
                    value={formData.average_meal_cost}
                    onChange={(e) => updateFormField("average_meal_cost", e.target.value)}
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Amenities & Features */}
        <Card>
          <Collapsible open={expandedSections.amenities} onOpenChange={() => toggleSection("amenities")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Amenities & Features
                  </div>
                  {expandedSections.amenities ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <MultiSelectField
                  label="Dining Features"
                  options={[
                    "Outdoor Seating",
                    "Private Dining",
                    "Bar Seating",
                    "Counter Seating",
                    "Booth Seating",
                    "Family Style",
                    "Communal Tables",
                  ]}
                  value={formData.dining_features}
                  onChange={(value) => updateFormField("dining_features", value)}
                />

                <MultiSelectField
                  label="Dietary Accommodations"
                  options={[
                    "Vegetarian",
                    "Vegan",
                    "Gluten-Free",
                    "Dairy-Free",
                    "Nut-Free",
                    "Keto",
                    "Paleo",
                    "Halal",
                    "Kosher",
                  ]}
                  value={formData.dietary_accommodations}
                  onChange={(value) => updateFormField("dietary_accommodations", value)}
                />

                <MultiSelectField
                  label="Ambiance Tags"
                  options={[
                    "Romantic",
                    "Family-Friendly",
                    "Business Dining",
                    "Casual",
                    "Upscale",
                    "Trendy",
                    "Cozy",
                    "Lively",
                    "Quiet",
                  ]}
                  value={formData.ambiance_tags}
                  onChange={(value) => updateFormField("ambiance_tags", value)}
                />

                <MultiSelectField
                  label="Music & Entertainment"
                  options={[
                    "Live Music",
                    "DJ",
                    "Karaoke",
                    "Sports TV",
                    "Background Music",
                    "Piano Bar",
                    "Jazz",
                    "Acoustic",
                  ]}
                  value={formData.music_entertainment}
                  onChange={(value) => updateFormField("music_entertainment", value)}
                />

                <MultiSelectField
                  label="Parking Options"
                  options={[
                    "Street Parking",
                    "Parking Lot",
                    "Valet Parking",
                    "Garage Parking",
                    "Free Parking",
                    "Paid Parking",
                  ]}
                  value={formData.parking_options}
                  onChange={(value) => updateFormField("parking_options", value)}
                />

                <MultiSelectField
                  label="Payment Methods"
                  options={[
                    "Cash",
                    "Credit Cards",
                    "Debit Cards",
                    "Mobile Payments",
                    "Apple Pay",
                    "Google Pay",
                    "Contactless",
                  ]}
                  value={formData.payment_methods}
                  onChange={(value) => updateFormField("payment_methods", value)}
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Content & Marketing */}
        <Card>
          <Collapsible open={expandedSections.content} onOpenChange={() => toggleSection("content")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Content & Marketing
                  </div>
                  {expandedSections.content ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Brand Story</Label>
                    <Button variant="outline" size="sm" onClick={() => generateAIContent("brand_story")}>
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Generate
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Tell the story of your restaurant..."
                    value={formData.brand_story}
                    onChange={(e) => updateFormField("brand_story", e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <MultiSelectField
                  label="Signature Dishes"
                  options={[
                    "House Special",
                    "Chef's Recommendation",
                    "Customer Favorite",
                    "Award Winner",
                    "Seasonal Special",
                  ]}
                  value={formData.signature_dishes}
                  onChange={(value) => updateFormField("signature_dishes", value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Wine & Beer Program</Label>
                    <Textarea
                      placeholder="Describe your wine and beer offerings..."
                      value={formData.wine_beer_program}
                      onChange={(e) => updateFormField("wine_beer_program", e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Happy Hour Details</Label>
                    <Textarea
                      placeholder="Happy hour times, specials, and offerings..."
                      value={formData.happy_hour_details}
                      onChange={(e) => updateFormField("happy_hour_details", e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Community Involvement</Label>
                  <Textarea
                    placeholder="How does your restaurant engage with the local community?"
                    value={formData.community_involvement}
                    onChange={(e) => updateFormField("community_involvement", e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Reservation Policy</Label>
                    <Textarea
                      placeholder="Reservation requirements and policies..."
                      value={formData.reservation_policy}
                      onChange={(e) => updateFormField("reservation_policy", e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cancellation Policy</Label>
                    <Textarea
                      placeholder="Cancellation terms and conditions..."
                      value={formData.cancellation_policy}
                      onChange={(e) => updateFormField("cancellation_policy", e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  )
}
