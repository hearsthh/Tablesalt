export interface ImageUploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

export class ImageService {
  static async uploadImage(file: File, folder = "menu-items"): Promise<ImageUploadResult> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Image upload error:", error)
      return { success: false, error: "Upload failed" }
    }
  }

  static async deleteImage(path: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/upload/image?path=${encodeURIComponent(path)}`, {
        method: "DELETE",
      })

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error("Image delete error:", error)
      return false
    }
  }

  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "Please select a valid image file (JPEG, PNG, WebP)" }
    }

    if (file.size > maxSize) {
      return { valid: false, error: "Image must be less than 5MB" }
    }

    return { valid: true }
  }

  static getOptimizedImageUrl(url: string, width?: number, height?: number): string {
    if (!url) return url

    // Handle Supabase Storage URLs
    if (url.includes("supabase")) {
      const params = new URLSearchParams()
      if (width) params.append("width", width.toString())
      if (height) params.append("height", height.toString())
      params.append("resize", "cover")
      params.append("quality", "80")

      return params.toString() ? `${url}?${params.toString()}` : url
    }

    // Handle placeholder URLs
    if (url.includes("placeholder.svg")) {
      return url
    }

    // For other URLs, return as-is
    return url
  }

  static generatePlaceholder(text: string, width = 300, height = 200): string {
    return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(text)}`
  }

  static async compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              resolve(file)
            }
          },
          file.type,
          quality,
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }
}

export const STORAGE_FOLDERS = {
  MENU_ITEMS: "menu-items",
  RESTAURANT_LOGOS: "restaurant-logos",
  CATEGORY_IMAGES: "category-images",
} as const
