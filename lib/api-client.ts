class ApiClient {
  private baseUrl = "/api"

  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`)
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
    return response.json()
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
    return response.json()
  }

  async put(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
    return response.json()
  }

  async delete(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
    return response.json()
  }

  // Restaurant methods
  async getRestaurant(id: string) {
    return this.get(`/restaurants/${id}`)
  }

  async createRestaurant(data: any) {
    return this.post("/restaurants", data)
  }

  async updateRestaurant(id: string, data: any) {
    return this.put(`/restaurants/${id}`, data)
  }

  // Category methods
  async getCategories(restaurantId?: string) {
    const params = restaurantId ? `?restaurant_id=${restaurantId}` : ""
    return this.get(`/categories${params}`)
  }

  async createCategory(data: any) {
    return this.post("/categories", data)
  }

  async updateCategory(id: string, data: any) {
    return this.put(`/categories/${id}`, data)
  }

  async deleteCategory(id: string) {
    return this.delete(`/categories/${id}`)
  }

  // Menu item methods
  async getMenuItems(restaurantId?: string, categoryId?: string) {
    const params = new URLSearchParams()
    if (restaurantId) params.append("restaurant_id", restaurantId)
    if (categoryId) params.append("category_id", categoryId)

    return this.get(`/menu-items?${params.toString()}`)
  }

  async createMenuItem(data: any) {
    return this.post("/menu-items", data)
  }

  async updateMenuItem(id: string, data: any) {
    return this.put(`/menu-items/${id}`, data)
  }

  async deleteMenuItem(id: string) {
    return this.delete(`/menu-items/${id}`)
  }
}

export { ApiClient }
export const apiClient = new ApiClient()

// Default export as static instance for convenience
export default apiClient
