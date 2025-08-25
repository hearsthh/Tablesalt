import { z } from "zod"

// Common validation schemas
export const emailSchema = z.string().email("Invalid email address")
export const phoneSchema = z.string().regex(/^\+?[\d\s\-$$$$]+$/, "Invalid phone number")
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number")

// Restaurant validation schemas
export const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  cuisine_type: z.string().min(1, "Cuisine type is required"),
  phone: phoneSchema,
  email: emailSchema,
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
})

// Menu item validation schemas
export const menuItemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  price: z.number().min(0.01, "Price must be greater than 0").max(999.99, "Price too high"),
  cost_price: z.number().min(0, "Cost price cannot be negative").max(999.99, "Cost price too high").optional(),
  category_id: z.string().uuid("Invalid category ID"),
  image_url: z.string().url("Invalid image URL").optional(),
  dietary_tags: z.array(z.string()).max(10, "Too many dietary tags"),
  allergens: z.array(z.string()).max(15, "Too many allergens"),
  spice_level: z.number().min(0).max(5, "Spice level must be 0-5").optional(),
  preparation_time: z
    .number()
    .min(1, "Preparation time must be at least 1 minute")
    .max(180, "Preparation time too long")
    .optional(),
  calories: z.number().min(0).max(5000, "Calories value too high").optional(),
  protein: z.number().min(0).max(200, "Protein value too high").optional(),
  carbs: z.number().min(0).max(500, "Carbs value too high").optional(),
  fat: z.number().min(0).max(200, "Fat value too high").optional(),
  fiber: z.number().min(0).max(100, "Fiber value too high").optional(),
  is_available: z.boolean(),
})

// Category validation schema
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name too long"),
  description: z.string().max(200, "Description too long").optional(),
  display_order: z.number().min(0, "Display order cannot be negative"),
  is_active: z.boolean(),
})

// User validation schemas
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  role: z.enum(["owner", "manager", "staff"]).default("staff"),
})

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

// Input sanitization utilities
export class InputSanitizer {
  // Remove HTML tags and dangerous characters
  static sanitizeHtml(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
      .replace(/<[^>]*>/g, "") // Remove all HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, "") // Remove event handlers
      .trim()
  }

  // Sanitize SQL input (basic protection)
  static sanitizeSql(input: string): string {
    return input
      .replace(/['";\\]/g, "") // Remove dangerous SQL characters
      .replace(/\b(DROP|DELETE|INSERT|UPDATE|CREATE|ALTER|EXEC|EXECUTE)\b/gi, "") // Remove SQL keywords
      .trim()
  }

  // Sanitize file names
  static sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace special characters with underscore
      .replace(/\.{2,}/g, ".") // Replace multiple dots with single dot
      .replace(/^\.+|\.+$/g, "") // Remove leading/trailing dots
      .toLowerCase()
  }

  // Sanitize phone numbers
  static sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+\-\s$$$$]/g, "").trim()
  }

  // General text sanitization
  static sanitizeText(text: string, maxLength = 1000): string {
    return this.sanitizeHtml(text).substring(0, maxLength).trim()
  }
}

// Validation middleware for API routes
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return (handler: (req: Request, validatedData: T) => Promise<Response>) => {
    return async (req: Request): Promise<Response> => {
      try {
        const body = await req.json()

        // Sanitize input data
        const sanitizedBody = sanitizeObject(body)

        // Validate against schema
        const validatedData = schema.parse(sanitizedBody)

        return handler(req, validatedData)
      } catch (error) {
        if (error instanceof z.ZodError) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Validation failed",
              details: error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message,
              })),
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          )
        }

        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid request data",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        )
      }
    }
  }
}

// Recursive object sanitization
function sanitizeObject(obj: any): any {
  if (typeof obj === "string") {
    return InputSanitizer.sanitizeText(obj)
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }

  if (obj && typeof obj === "object") {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value)
    }
    return sanitized
  }

  return obj
}

// File upload validation
export const fileUploadSchema = z.object({
  file: z.object({
    name: z.string().min(1, "File name is required"),
    size: z.number().max(5 * 1024 * 1024, "File size must be less than 5MB"),
    type: z
      .string()
      .refine(
        (type) => ["image/jpeg", "image/png", "image/webp"].includes(type),
        "Only JPEG, PNG, and WebP images are allowed",
      ),
  }),
})

export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  try {
    fileUploadSchema.parse({
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    })
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        error: error.errors[0]?.message || "Invalid file",
      }
    }
    return { valid: false, error: "File validation failed" }
  }
}
