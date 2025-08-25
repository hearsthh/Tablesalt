import type { IntegrationCredentials } from "./types"

export class AuthHandler {
  // OAuth2 flow handler
  static async handleOAuth2(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    authUrl: string,
    tokenUrl: string,
    scopes: string[] = [],
  ): Promise<IntegrationCredentials> {
    // Generate authorization URL
    const authParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes.join(" "),
      state: crypto.randomUUID(), // CSRF protection
    })

    const authorizationUrl = `${authUrl}?${authParams.toString()}`

    // In a real implementation, you would redirect the user to authorizationUrl
    // and handle the callback to exchange the code for tokens

    return {
      clientId,
      clientSecret,
      // These would be obtained from the OAuth callback
      accessToken: "",
      refreshToken: "",
    }
  }

  // API Key authentication
  static async handleApiKey(apiKey: string): Promise<IntegrationCredentials> {
    return { apiKey }
  }

  // Basic authentication
  static async handleBasicAuth(username: string, password: string): Promise<IntegrationCredentials> {
    const encoded = btoa(`${username}:${password}`)
    return {
      apiKey: encoded,
      username,
      password,
    }
  }

  // Refresh OAuth2 token
  static async refreshOAuth2Token(
    refreshToken: string,
    clientId: string,
    clientSecret: string,
    tokenUrl: string,
  ): Promise<IntegrationCredentials> {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    const data = await response.json()
    return {
      clientId,
      clientSecret,
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
    }
  }
}
