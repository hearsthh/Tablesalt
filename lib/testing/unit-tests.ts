import { describe, it, expect, mock, testFramework } from "./test-framework"
import { InputSanitizer } from "../security/validation"
import { businessAnalytics } from "../analytics/business-analytics"
import { useRestaurantStore } from "../store/restaurant-store"

// Unit tests for security validation
describe("Input Sanitization", () => {
  it("should remove HTML tags from input", () => {
    const input = "<script>alert('xss')</script>Hello World"
    const result = InputSanitizer.sanitizeHtml(input)
    expect(result).toBe("Hello World")
  })

  it("should remove SQL injection attempts", () => {
    const input = "'; DROP TABLE users; --"
    const result = InputSanitizer.sanitizeSql(input)
    expect(result).toBe(" TABLE users ")
  })

  it("should sanitize file names", () => {
    const input = "../../../etc/passwd"
    const result = InputSanitizer.sanitizeFileName(input)
    expect(result).toBe("___etc_passwd")
  })

  it("should sanitize phone numbers", () => {
    const input = "+1 (555) 123-4567 ext. 890"
    const result = InputSanitizer.sanitizePhone(input)
    expect(result).toBe("+1 (555) 123-4567")
  })

  it("should limit text length", () => {
    const input = "a".repeat(2000)
    const result = InputSanitizer.sanitizeText(input, 100)
    expect(result.length).toBe(100)
  })
})

// Unit tests for business analytics
describe("Business Analytics", () => {
  it("should calculate KPIs correctly", () => {
    const kpis = businessAnalytics.calculateKPIs(7)

    expect(kpis.totalRevenue).toBeGreaterThan(0)
    expect(kpis.totalOrders).toBeGreaterThan(0)
    expect(kpis.avgOrderValue).toBeGreaterThan(0)
    expect(kpis.customerRetentionRate).toBeGreaterThan(0)
    expect(kpis.customerRetentionRate).toBeLessThan(1)
  })

  it("should record sales correctly", () => {
    const initialKPIs = businessAnalytics.calculateKPIs(1)

    businessAnalytics.recordSale({
      itemId: "test-item",
      itemName: "Test Item",
      category: "Test Category",
      price: 25.99,
      cost: 10.0,
      customerId: "test-customer",
      isNewCustomer: true,
    })

    const updatedKPIs = businessAnalytics.calculateKPIs(1)
    expect(updatedKPIs.totalRevenue).toBeGreaterThan(initialKPIs.totalRevenue)
  })

  it("should generate revenue forecast", () => {
    const forecast = businessAnalytics.forecastRevenue(7)

    expect(forecast.length).toBe(7)
    forecast.forEach((day) => {
      expect(day.predictedRevenue).toBeGreaterThan(0)
      expect(day.confidence).toBeGreaterThan(0)
      expect(day.confidence).toBeLessThan(1)
      expect(day.date).toBeTruthy()
    })
  })

  it("should get business insights", () => {
    const insights = businessAnalytics.getBusinessInsights(10)

    expect(Array.isArray(insights)).toBeTruthy()
    insights.forEach((insight) => {
      expect(insight.id).toBeTruthy()
      expect(insight.title).toBeTruthy()
      expect(insight.description).toBeTruthy()
      expect(["opportunity", "warning", "trend", "recommendation"]).toContain(insight.type)
      expect(["high", "medium", "low"]).toContain(insight.impact)
    })
  })
})

// Unit tests for restaurant store
describe("Restaurant Store", () => {
  it("should add menu items optimistically", async () => {
    const store = useRestaurantStore.getState()
    const initialCount = store.menuItems.length

    const newItem = {
      name: "Test Item",
      description: "Test Description",
      price: 19.99,
      category_id: "cat-1",
      dietary_tags: ["vegetarian"],
      allergens: [],
      is_available: true,
      popularity_score: 0,
    }

    await store.addMenuItem(newItem)

    const updatedStore = useRestaurantStore.getState()
    expect(updatedStore.menuItems.length).toBe(initialCount + 1)

    const addedItem = updatedStore.menuItems.find((item) => item.name === "Test Item")
    expect(addedItem).toBeTruthy()
    expect(addedItem?.price).toBe(19.99)
  })

  it("should update menu items optimistically", async () => {
    const store = useRestaurantStore.getState()
    const firstItem = store.menuItems[0]

    if (firstItem) {
      const updatedItem = await store.updateMenuItem(firstItem.id, {
        price: 99.99,
        name: "Updated Item Name",
      })

      expect(updatedItem.price).toBe(99.99)
      expect(updatedItem.name).toBe("Updated Item Name")

      const storeItem = useRestaurantStore.getState().menuItems.find((item) => item.id === firstItem.id)
      expect(storeItem?.price).toBe(99.99)
    }
  })

  it("should handle connection status", () => {
    const store = useRestaurantStore.getState()

    expect(["connecting", "connected", "disconnected", "error"]).toContain(store.connectionStatus)
    expect(typeof store.isConnected).toBe("boolean")
  })
})

// Mock API tests
describe("API Mocking", () => {
  it("should mock function calls", () => {
    const mockFn = mock<(x: number, y: number) => number>()
    mockFn.mockReturnValue(42)

    const result = mockFn(1, 2)

    expect(result).toBe(42)
    expect(mockFn.calls.length).toBe(1)
    expect(mockFn.calls[0]).toEqual([1, 2])
  })

  it("should mock async functions", async () => {
    const mockAsyncFn = mock<() => Promise<string>>()
    mockAsyncFn.mockResolvedValue("success")

    const result = await mockAsyncFn()

    expect(result).toBe("success")
    expect(mockAsyncFn.calls.length).toBe(1)
  })

  it("should mock rejected promises", async () => {
    const mockAsyncFn = mock<() => Promise<string>>()
    mockAsyncFn.mockRejectedValue(new Error("Test error"))

    try {
      await mockAsyncFn()
      expect(false).toBeTruthy() // Should not reach here
    } catch (error) {
      expect(error.message).toBe("Test error")
    }
  })
})

// Utility function tests
describe("Utility Functions", () => {
  it("should format currency correctly", () => {
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`

    expect(formatCurrency(19.99)).toBe("$19.99")
    expect(formatCurrency(0)).toBe("$0.00")
    expect(formatCurrency(1000.5)).toBe("$1000.50")
  })

  it("should validate email addresses", () => {
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    expect(isValidEmail("test@example.com")).toBeTruthy()
    expect(isValidEmail("invalid-email")).toBeFalsy()
    expect(isValidEmail("test@")).toBeFalsy()
    expect(isValidEmail("@example.com")).toBeFalsy()
  })

  it("should calculate percentage correctly", () => {
    const calculatePercentage = (value: number, total: number) => (total > 0 ? (value / total) * 100 : 0)

    expect(calculatePercentage(25, 100)).toBe(25)
    expect(calculatePercentage(0, 100)).toBe(0)
    expect(calculatePercentage(50, 0)).toBe(0)
  })
})

// Run all unit tests
export function runUnitTests(): void {
  console.log("[v0] Running unit tests...")
  // Tests are automatically executed when this module is imported
  setTimeout(() => {
    testFramework.printSummary()
  }, 1000)
}
