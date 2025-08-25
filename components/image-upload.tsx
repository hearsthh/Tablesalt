"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImageService, type ImageUploadResult } from "@/lib/image-utils"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  onUpload: (result: ImageUploadResult) => void
  currentImage?: string
  folder?: string
  className?: string
}

export function ImageUpload({ onUpload, currentImage, folder = "menu-items", className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    const validation = ImageService.validateImageFile(file)
    if (!validation.valid) {
      onUpload({ success: false, error: validation.error })
      return
    }

    let processedFile = file
    if (file.size > 1024 * 1024) {
      // Compress files larger than 1MB
      try {
        processedFile = await ImageService.compressImage(file)
      } catch (error) {
        console.warn("Image compression failed, using original file:", error)
      }
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(processedFile)

    // Upload file
    setUploading(true)
    try {
      const result = await ImageService.uploadImage(processedFile, folder)
      onUpload(result)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUpload({ success: true, url: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {preview ? (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">Click to upload an image</p>
          <p className="text-xs text-gray-500">JPEG, PNG, WebP up to 5MB</p>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? "Uploading..." : "Choose Image"}
      </Button>
    </div>
  )
}
