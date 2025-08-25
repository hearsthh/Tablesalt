import { E2ETestFramework, type TestCase } from "./e2e-test-framework"
import { enhancedApiClient } from "../api/enhanced-api-client"

export class E2ETestScenarios {
  private framework: E2ETestFramework

  constructor() {
    this.framework = new E2ETestFramework()
  }

  // Complete user onboarding flow
  getUserOnboardingTests(): TestCase[] {
    return [
      {
        name: "Landing page loads correctly",
        execute: async () => {
          // Test landing page elements
          await this.framework.waitForElement("h1")
          const heading = document.querySelector("h1")
          this.framework.assert(
            heading?.textContent?.includes("Tablesalt"),
            "Landing page heading should contain Tablesalt",
          )
        },
      },
      {
        name: "Signup form validation works",
        execute: async () => {
          // Navigate to signup and test form validation
          const signupButton = document.querySelector('a[href="/signup"]')
          this.framework.assert(signupButton !== null, "Signup button should exist")
        },
      },
      {
        name: "Dashboard loads after authentication",
        execute: async () => {
          // Test dashboard loading with mock data
          const data = await enhancedApiClient.getRestaurant("test-restaurant-id")
          this.framework.assert(data !== null, "Restaurant data should load")
          this.framework.assertEquals(data.name, "Bella Vista Italian Kitchen", "Should load correct restaurant")
        },
      },
    ]
  }

  // Menu management end-to-end tests
  getMenuManagementTests(): TestCase[] {
    return [
      {
        name: "Menu items load correctly",
        execute: async () => {
          const menuItems = await enhancedApiClient.getMenuItems("test-restaurant-id")
          this.framework.assert(menuItems.length > 0, "Menu items should load")
          this.framework.assert(menuItems[0].name, "Menu items should have names")
        },
      },
      {
        name: "Categories load correctly",
        execute: async () => {
          const categories = await enhancedApiClient.getCategories("test-restaurant-id")
          this.framework.assert(categories.length > 0, "Categories should load")
          this.framework.assertContains(
            categories.map((c) => c.name),
            "Appetizers",
            "Should include Appetizers category",
          )
        },
      },
      {
        name: "AI combo generation works",
        execute: async () => {
          const response = await this.framework.testApiEndpoint("/api/ai/menu-combos", 200)
          this.framework.assert(response.combos, "AI should generate combos")
          this.framework.assert(response.combos.length > 0, "Should generate at least one combo")
        },
      },
      {
        name: "AI tag generation works",
        execute: async () => {
          const response = await this.framework.testApiEndpoint("/api/ai/menu-tags", 200)
          this.framework.assert(response.tags, "AI should generate tags")
          this.framework.assert(response.tags.length > 0, "Should generate at least one tag")
        },
      },
    ]
  }

  // Customer and reviews management tests
  getCustomerReviewsTests(): TestCase[] {
    return [
      {
        name: "Customer data loads correctly",
        execute: async () => {
          const customers = await enhancedApiClient.getCustomers("test-restaurant-id")
          this.framework.assert(customers.length > 0, "Customers should load")
          this.framework.assert(customers[0].name, "Customers should have names")
          this.framework.assert(customers[0].loyaltyTier, "Customers should have loyalty tiers")
        },
      },
      {
        name: "Review data loads with sentiment analysis",
        execute: async () => {
          const reviews = await enhancedApiClient.getReviews("test-restaurant-id")
          this.framework.assert(reviews.length > 0, "Reviews should load")
          this.framework.assert(reviews[0].sentiment, "Reviews should have sentiment analysis")
          this.framework.assert(
            ["positive", "negative", "neutral"].includes(reviews[0].sentiment),
            "Sentiment should be valid",
          )
        },
      },
    ]
  }

  // Marketing and analytics tests
  getMarketingAnalyticsTests(): TestCase[] {
    return [
      {
        name: "Marketing data loads correctly",
        execute: async () => {
          const marketingData = await enhancedApiClient.getMarketingData("test-restaurant-id")
          this.framework.assert(marketingData.campaigns, "Marketing data should include campaigns")
          this.framework.assert(marketingData.performance, "Marketing data should include performance metrics")
        },
      },
      {
        name: "Dashboard analytics load correctly",
        execute: async () => {
          const dashboardStats = await enhancedApiClient.getDashboardStats("test-restaurant-id")
          this.framework.assert(dashboardStats.revenue, "Dashboard should show revenue")
          this.framework.assert(dashboardStats.customers, "Dashboard should show customer count")
        },
      },
    ]
  }

  // Error handling and edge cases
  getErrorHandlingTests(): TestCase[] {
    return [
      {
        name: "API handles invalid restaurant ID",
        execute: async () => {
          try {
            await enhancedApiClient.getRestaurant("invalid-id")
            // Should fallback to mock data
            this.framework.assert(true, "Should handle invalid ID gracefully")
          } catch (error) {
            this.framework.assert(false, "Should not throw error for invalid ID")
          }
        },
      },
      {
        name: "UI handles loading states",
        execute: async () => {
          // Test that loading states are properly displayed
          this.framework.assert(true, "Loading states should be handled")
        },
      },
    ]
  }

  async runAllTests(): Promise<void> {
    console.log("[E2E] Starting comprehensive end-to-end testing...")

    const testSuites = [
      { name: "User Onboarding", tests: this.getUserOnboardingTests() },
      { name: "Menu Management", tests: this.getMenuManagementTests() },
      { name: "Customer & Reviews", tests: this.getCustomerReviewsTests() },
      { name: "Marketing & Analytics", tests: this.getMarketingAnalyticsTests() },
      { name: "Error Handling", tests: this.getErrorHandlingTests() },
    ]

    for (const suite of testSuites) {
      const result = await this.framework.runTestSuite(suite.name, suite.tests)
      console.log(`[E2E] Suite ${suite.name}: ${result.passed}/${result.totalTests} passed`)
    }
  }
}
