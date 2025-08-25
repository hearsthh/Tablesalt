import type { NextResponse } from "next/server"

export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline scripts for development
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  )

  // Prevent XSS attacks
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Prevent content type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff")

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY")

  // Force HTTPS
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Permissions policy
  response.headers.set(
    "Permissions-Policy",
    ["camera=()", "microphone=()", "geolocation=()", "interest-cohort=()"].join(", "),
  )

  // Remove server information
  response.headers.delete("Server")
  response.headers.delete("X-Powered-By")

  return response
}

// CORS configuration
export function configureCORS(response: NextResponse, origin?: string): NextResponse {
  const allowedOrigins = ["http://localhost:3000", "https://your-domain.com", "https://your-app.vercel.app"]

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
  } else {
    response.headers.set("Access-Control-Allow-Origin", "null")
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  response.headers.set("Access-Control-Max-Age", "86400")

  return response
}
