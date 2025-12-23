/**
 * VortexApiClient - Enhanced API client with authentication support
 *
 * Features:
 * - Token-based authentication
 * - Automatic token refresh on 401
 * - Request/Response interceptors
 * - Response transformers
 * - Configurable endpoints
 */

import { ApiError } from './query-client'
import type {
  VortexConfig,
  VortexApiEndpoints,
  VideoListResponse,
  CommentsListResponse,
  VideoFetchParams,
  TokenRefreshResult,
  Video,
  VideoMetadata,
  Comment,
} from '@vortex/types'
import { DEFAULT_API_ENDPOINTS } from '@vortex/types'

// =============================================================================
// TYPES
// =============================================================================

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | string[] | undefined>
  skipAuth?: boolean
  timeout?: number
}

// =============================================================================
// VORTEX API CLIENT CLASS
// =============================================================================

/**
 * VortexApiClient - API client configured for VortexStream
 */
export class VortexApiClient {
  private config: VortexConfig
  private isRefreshing = false
  private refreshPromise: Promise<TokenRefreshResult | null> | null = null

  constructor(config: VortexConfig) {
    this.config = config
  }

  // ===========================================================================
  // CONFIG HELPERS
  // ===========================================================================

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<VortexConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | undefined {
    return this.config.auth?.accessToken
  }

  /**
   * Set access token
   */
  setAccessToken(token: string | undefined): void {
    if (this.config.auth) {
      this.config.auth.accessToken = token
    } else {
      this.config.auth = { accessToken: token }
    }
  }

  /**
   * Get endpoint URL with placeholder replacement
   */
  private getEndpoint(
    key: keyof VortexApiEndpoints,
    params?: Record<string, string>
  ): string {
    const endpoints = {
      ...DEFAULT_API_ENDPOINTS,
      ...this.config.endpoints,
    }

    let endpoint = endpoints[key] || ''

    // Replace placeholders (:id, :videoId, etc.)
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        endpoint = endpoint.replace(`:${paramKey}`, paramValue)
      })
    }

    return endpoint
  }

  // ===========================================================================
  // CORE FETCH
  // ===========================================================================

  /**
   * Build full URL with query params
   */
  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | string[] | undefined>
  ): string {
    const baseUrl = this.config.baseUrl.replace(/\/$/, '')
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const url = new URL(`${baseUrl}${cleanPath}`)

    // Add api_key if configured
    if (this.config.apiKey) {
      url.searchParams.set('api_key', this.config.apiKey)
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Handle array params (e.g., tags[]=a&tags[]=b)
          if (Array.isArray(value)) {
            value.forEach((v) => url.searchParams.append(key, v))
          } else {
            url.searchParams.set(key, String(value))
          }
        }
      })
    }

    return url.toString()
  }

  /**
   * Get auth headers
   */
  private getAuthHeaders(): Record<string, string> {
    const { auth } = this.config

    if (!auth?.accessToken) {
      return {}
    }

    const tokenType = auth.tokenType || 'Bearer'
    const headerName = auth.headerName || 'Authorization'

    return {
      [headerName]: `${tokenType} ${auth.accessToken}`,
    }
  }

  /**
   * Check if response indicates token expired
   */
  private isTokenExpiredResponse(response: Response, body?: unknown): boolean {
    const { auth } = this.config

    if (auth?.isTokenExpired) {
      return auth.isTokenExpired(response, body)
    }

    // Default: 401 status means token expired
    return response.status === 401
  }

  /**
   * Handle token refresh
   */
  private async handleTokenRefresh(): Promise<TokenRefreshResult | null> {
    const { auth } = this.config

    if (!auth?.onTokenExpired) {
      return null
    }

    // Prevent multiple simultaneous refresh calls
    if (this.isRefreshing) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = auth.onTokenExpired()

    try {
      const result = await this.refreshPromise

      if (result) {
        this.setAccessToken(result.accessToken)

        if (this.config.debug) {
          console.log('[VortexApi] Token refreshed successfully')
        }
      }

      return result
    } catch (error) {
      auth.onAuthError?.(error as Error)
      return null
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  /**
   * Main fetch method
   */
  async fetch<T>(
    path: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { params, skipAuth, timeout = this.config.timeout || 30000, ...fetchOptions } = options

    const url = this.buildUrl(path, params)

    // Build headers
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...(fetchOptions.headers as Record<string, string>),
    }

    // Add auth headers
    if (!skipAuth) {
      headers = { ...headers, ...this.getAuthHeaders() }
    }

    // Apply request interceptor
    let finalConfig: RequestInit = {
      ...fetchOptions,
      headers,
    }

    if (this.config.interceptors?.onRequest) {
      finalConfig = await this.config.interceptors.onRequest(finalConfig)
    }

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      if (this.config.debug) {
        console.log('[VortexApi] Request:', fetchOptions.method || 'GET', url)
      }

      const response = await fetch(url, {
        ...finalConfig,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Parse response body
      let body: unknown
      const contentType = response.headers.get('content-type')

      if (contentType?.includes('application/json')) {
        try {
          body = await response.json()
        } catch {
          body = null
        }
      } else if (response.status !== 204) {
        body = await response.text()
      }

      // Handle token expired
      if (!skipAuth && this.isTokenExpiredResponse(response, body)) {
        const refreshResult = await this.handleTokenRefresh()

        if (refreshResult) {
          // Retry request with new token
          return this.fetch<T>(path, { ...options, skipAuth: false })
        }

        throw new ApiError('Authentication required', 401, 'UNAUTHORIZED')
      }

      // Handle error responses
      if (!response.ok) {
        throw ApiError.fromResponse(response, body)
      }

      // Apply response interceptor
      if (this.config.interceptors?.onResponse) {
        await this.config.interceptors.onResponse(response, body)
      }

      if (this.config.debug) {
        console.log('[VortexApi] Response:', response.status, body)
      }

      return body as T
    } catch (error) {
      clearTimeout(timeoutId)

      // Apply error interceptor
      if (this.config.interceptors?.onError) {
        const transformedError = await this.config.interceptors.onError(error as Error)
        if (transformedError) {
          throw transformedError
        }
      }

      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'TIMEOUT')
      }

      if (error instanceof TypeError) {
        throw new ApiError('Network error', 0, 'NETWORK_ERROR')
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        500,
        'UNKNOWN_ERROR'
      )
    }
  }

  // ===========================================================================
  // HTTP METHODS
  // ===========================================================================

  async get<T>(path: string, params?: Record<string, string | number | boolean | string[] | undefined>): Promise<T> {
    return this.fetch<T>(path, { method: 'GET', params })
  }

  async post<T>(path: string, data?: unknown, params?: Record<string, string | number | boolean | string[] | undefined>): Promise<T> {
    return this.fetch<T>(path, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      params,
    })
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    return this.fetch<T>(path, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(path: string, data?: unknown): Promise<T> {
    return this.fetch<T>(path, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(path: string): Promise<T> {
    return this.fetch<T>(path, { method: 'DELETE' })
  }

  // ===========================================================================
  // VIDEO API METHODS
  // ===========================================================================

  /**
   * Fetch videos list with pagination
   */
  async fetchVideos(params: VideoFetchParams = {}): Promise<VideoListResponse> {
    const endpoint = this.getEndpoint('videos')
    const mergedParams = { ...this.config.defaultFetchParams, ...params }

    const response = await this.get<unknown>(endpoint, mergedParams)

    // Apply transformer if provided
    if (this.config.transformers?.transformVideoList) {
      return this.config.transformers.transformVideoList(response)
    }

    // Default: expect response in VideoListResponse format
    return response as VideoListResponse
  }

  /**
   * Fetch single video by ID
   */
  async fetchVideo(videoId: string): Promise<Video> {
    const endpoint = this.getEndpoint('videoDetail', { id: videoId })
    const response = await this.get<unknown>(endpoint)

    if (this.config.transformers?.transformVideo) {
      return this.config.transformers.transformVideo(response)
    }

    // Handle both { video: Video } and Video response formats
    const data = response as { video?: Video } | Video
    return 'video' in data && data.video ? data.video : (data as Video)
  }

  /**
   * Fetch video metadata
   */
  async fetchVideoMetadata(videoId: string): Promise<VideoMetadata> {
    const endpoint = this.getEndpoint('videoMetadata', { id: videoId })
    return this.get<VideoMetadata>(endpoint)
  }

  /**
   * Like a video
   */
  async likeVideo(videoId: string): Promise<void> {
    const endpoint = this.getEndpoint('likeVideo', { id: videoId })
    await this.post(endpoint)
  }

  /**
   * Unlike a video
   */
  async unlikeVideo(videoId: string): Promise<void> {
    const endpoint = this.getEndpoint('unlikeVideo', { id: videoId })
    await this.delete(endpoint)
  }

  /**
   * Save/bookmark a video
   */
  async saveVideo(videoId: string): Promise<void> {
    const endpoint = this.getEndpoint('saveVideo', { id: videoId })
    await this.post(endpoint)
  }

  /**
   * Unsave a video
   */
  async unsaveVideo(videoId: string): Promise<void> {
    const endpoint = this.getEndpoint('unsaveVideo', { id: videoId })
    await this.delete(endpoint)
  }

  /**
   * Track share
   */
  async shareVideo(videoId: string, platform?: string): Promise<void> {
    const endpoint = this.getEndpoint('shareVideo', { id: videoId })
    await this.post(endpoint, { platform })
  }

  /**
   * Fetch comments for a video
   */
  async fetchComments(
    videoId: string,
    params?: { cursor?: string; limit?: number }
  ): Promise<CommentsListResponse> {
    const endpoint = this.getEndpoint('comments', { videoId })
    const response = await this.get<unknown>(endpoint, params)

    if (this.config.transformers?.transformComments) {
      return this.config.transformers.transformComments(response)
    }

    return response as CommentsListResponse
  }

  /**
   * Post a comment
   */
  async postComment(
    videoId: string,
    content: string,
    replyToId?: string
  ): Promise<Comment> {
    const endpoint = this.getEndpoint('postComment', { videoId })
    return this.post<Comment>(endpoint, { content, replyToId })
  }

  /**
   * Like a comment
   */
  async likeComment(commentId: string): Promise<void> {
    const endpoint = this.getEndpoint('likeComment', { commentId })
    await this.post(endpoint)
  }

  /**
   * Report a video
   */
  async reportVideo(videoId: string, reason: string, details?: string): Promise<void> {
    const endpoint = this.getEndpoint('reportVideo', { id: videoId })
    await this.post(endpoint, { reason, details })
  }

  /**
   * Mark video as not interested
   */
  async markNotInterested(videoId: string): Promise<void> {
    const endpoint = this.getEndpoint('notInterested', { id: videoId })
    await this.post(endpoint)
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a VortexApiClient instance
 *
 * @example
 * ```typescript
 * const client = createVortexApiClient({
 *   baseUrl: 'https://api.example.com',
 *   auth: {
 *     accessToken: 'xxx',
 *     onTokenExpired: async () => {
 *       const newToken = await refreshToken()
 *       return { accessToken: newToken }
 *     },
 *   },
 * })
 *
 * const { videos, hasMore } = await client.fetchVideos()
 * ```
 */
export function createVortexApiClient(config: VortexConfig): VortexApiClient {
  return new VortexApiClient(config)
}

