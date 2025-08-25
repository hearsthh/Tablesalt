import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export interface AuthUser {
  id: string
  email: string
  name: string
  role: "owner" | "manager" | "staff"
  restaurantId: string
}

export interface AuthRequest extends NextRequest {
  user?: AuthUser
}

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const JWT_EXPIRES_IN = "24h"

export class AuthService {
  // Generate JWT token
  static generateToken(user: AuthUser): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        restaurantId: user.restaurantId,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    )
  }

  // Verify JWT token
  static verifyToken(token: string): AuthUser | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      return {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        restaurantId: decoded.restaurantId,
      }
    } catch (error) {
      console.error("[v0] JWT verification failed:", error)
      return null
    }
  }

  // Extract token from request
  static extractToken(req: NextRequest): string | null {
    // Check Authorization header
    const authHeader = req.headers.get("authorization")
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7)
    }

    // Check cookie
    const tokenCookie = req.cookies.get("auth-token")
    if (tokenCookie) {
      return tokenCookie.value
    }

    return null
  }

  // Mock user authentication (replace with real database lookup)
  static async authenticateUser(email: string, password: string): Promise<AuthUser | null> {
    // Mock users for development
    const mockUsers: Record<string, { password: string; user: AuthUser }> = {
      "owner@restaurant.com": {
        password: "password123",
        user: {
          id: "user-1",
          email: "owner@restaurant.com",
          name: "Restaurant Owner",
          role: "owner",
          restaurantId: "rest-1",
        },
      },
      "manager@restaurant.com": {
        password: "password123",
        user: {
          id: "user-2",
          email: "manager@restaurant.com",
          name: "Restaurant Manager",
          role: "manager",
          restaurantId: "rest-1",
        },
      },
      "staff@restaurant.com": {
        password: "password123",
        user: {
          id: "user-3",
          email: "staff@restaurant.com",
          name: "Restaurant Staff",
          role: "staff",
          restaurantId: "rest-1",
        },
      },
    }

    const mockUser = mockUsers[email]
    if (mockUser && mockUser.password === password) {
      return mockUser.user
    }

    return null
  }

  // Create new user (mock implementation)
  static async createUser(userData: {
    email: string
    password: string
    name: string
    role: "owner" | "manager" | "staff"
  }): Promise<AuthUser> {
    // In production, this would hash the password and save to database
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      restaurantId: "rest-1", // Would be determined based on context
    }

    console.log("[v0] User created:", newUser.email)
    return newUser
  }
}

// Authentication middleware
export function requireAuth(requiredRoles?: ("owner" | "manager" | "staff")[]) {
  return (handler: (req: AuthRequest) => Promise<Response>) => {
    return async (req: AuthRequest): Promise<Response> => {
      const token = AuthService.extractToken(req)

      if (!token) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Authentication required",
          }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          },
        )
      }

      const user = AuthService.verifyToken(token)
      if (!user) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid or expired token",
          }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          },
        )
      }

      // Check role permissions
      if (requiredRoles && !requiredRoles.includes(user.role)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Insufficient permissions",
          }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          },
        )
      }

      // Add user to request
      req.user = user

      return handler(req)
    }
  }
}

// Role-based access control
export class RBAC {
  private static permissions = {
    owner: [
      "restaurant:read",
      "restaurant:write",
      "restaurant:delete",
      "menu:read",
      "menu:write",
      "menu:delete",
      "users:read",
      "users:write",
      "users:delete",
      "analytics:read",
      "settings:read",
      "settings:write",
    ],
    manager: [
      "restaurant:read",
      "restaurant:write",
      "menu:read",
      "menu:write",
      "users:read",
      "analytics:read",
      "settings:read",
    ],
    staff: ["restaurant:read", "menu:read", "analytics:read"],
  }

  static hasPermission(userRole: string, permission: string): boolean {
    const rolePermissions = this.permissions[userRole as keyof typeof this.permissions]
    return rolePermissions?.includes(permission) || false
  }

  static requirePermission(permission: string) {
    return (handler: (req: AuthRequest) => Promise<Response>) => {
      return requireAuth()(async (req: AuthRequest) => {
        if (!req.user || !this.hasPermission(req.user.role, permission)) {
          return new Response(
            JSON.stringify({
              success: false,
              error: `Permission denied: ${permission}`,
            }),
            {
              status: 403,
              headers: { "Content-Type": "application/json" },
            },
          )
        }

        return handler(req)
      })
    }
  }
}
