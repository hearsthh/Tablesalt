interface RateLimitRule {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  message?: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map()
  private rules: Map<string, RateLimitRule> = new Map()

  constructor() {
    this.setupDefaultRules()
    this.startCleanupInterval()
  }

  private setupDefaultRules() {
    // General API rate limit
    this.addRule("api", {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
      message: "Too many API requests, please try again later",
    })

    // Authentication rate limit
    this.addRule("auth", {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
      message: "Too many authentication attempts, please try again later",
      skipSuccessfulRequests: true,
    })

    // File upload rate limit
    this.addRule("upload", {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 20,
      message: "Too many file uploads, please try again later",
    })

    // Password reset rate limit
    this.addRule("password-reset", {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3,
      message: "Too many password reset attempts, please try again later",
    })

    // Menu update rate limit
    this.addRule("menu-update", {
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxRequests: 10,
      message: "Too many menu updates, please slow down",
    })
  }

  addRule(key: string, rule: RateLimitRule) {
    this.rules.set(key, rule)
  }

  private getClientKey(req: Request, ruleKey: string): string {
    // Try to get IP address from various headers
    const forwarded = req.headers.get("x-forwarded-for")
    const realIp = req.headers.get("x-real-ip")
    const ip = forwarded?.split(",")[0] || realIp || "unknown"

    return `${ruleKey}:${ip}`
  }

  async checkLimit(req: Request, ruleKey: string): Promise<{ allowed: boolean; message?: string; resetTime?: number }> {
    const rule = this.rules.get(ruleKey)
    if (!rule) {
      return { allowed: true }
    }

    const clientKey = this.getClientKey(req, ruleKey)
    const now = Date.now()
    const entry = this.store.get(clientKey)

    // If no entry exists, create one
    if (!entry) {
      this.store.set(clientKey, {
        count: 1,
        resetTime: now + rule.windowMs,
        blocked: false,
      })
      return { allowed: true }
    }

    // If the window has expired, reset the counter
    if (now > entry.resetTime) {
      entry.count = 1
      entry.resetTime = now + rule.windowMs
      entry.blocked = false
      return { allowed: true }
    }

    // Check if limit is exceeded
    if (entry.count >= rule.maxRequests) {
      entry.blocked = true
      return {
        allowed: false,
        message: rule.message || "Rate limit exceeded",
        resetTime: entry.resetTime,
      }
    }

    // Increment counter
    entry.count++
    return { allowed: true }
  }

  // Middleware function
  rateLimit(ruleKey: string) {
    return (handler: (req: Request) => Promise<Response>) => {
      return async (req: Request): Promise<Response> => {
        const result = await this.checkLimit(req, ruleKey)

        if (!result.allowed) {
          const resetTime = result.resetTime ? new Date(result.resetTime).toISOString() : undefined

          return new Response(
            JSON.stringify({
              success: false,
              error: result.message || "Rate limit exceeded",
              resetTime,
            }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "Retry-After": result.resetTime ? Math.ceil((result.resetTime - Date.now()) / 1000).toString() : "900",
                "X-RateLimit-Limit": this.rules.get(ruleKey)?.maxRequests.toString() || "100",
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": result.resetTime?.toString() || "",
              },
            },
          )
        }

        return handler(req)
      }
    }
  }

  // Cleanup expired entries
  private startCleanupInterval() {
    setInterval(
      () => {
        const now = Date.now()
        for (const [key, entry] of this.store.entries()) {
          if (now > entry.resetTime) {
            this.store.delete(key)
          }
        }
      },
      5 * 60 * 1000,
    ) // Cleanup every 5 minutes
  }

  // Get current stats
  getStats(): { totalEntries: number; blockedEntries: number } {
    let blockedEntries = 0
    for (const entry of this.store.values()) {
      if (entry.blocked) {
        blockedEntries++
      }
    }

    return {
      totalEntries: this.store.size,
      blockedEntries,
    }
  }

  // Reset limits for a specific client (admin function)
  resetClient(req: Request, ruleKey: string): boolean {
    const clientKey = this.getClientKey(req, ruleKey)
    return this.store.delete(clientKey)
  }

  // Clear all limits (admin function)
  clearAll(): void {
    this.store.clear()
  }
}

export const rateLimiter = new RateLimiter()
