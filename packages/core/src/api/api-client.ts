/**
 * API Client - Base fetch wrapper with error handling
 */

import { ApiError } from './query-client'

export interface RequestConfig extends RequestInit {
  /** Base URL override */
  baseUrl?: string
  /** URL params */
  params?: Record<string, string | number | boolean | undefined>
  /** Request timeout in ms */
  timeout?: number
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    page?: number
    limit?: number
    total?: number
    hasMore?: boolean
  }
}

// Default configuration
let defaultBaseUrl = '/api'
let defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
}

/**
 * Configure the API client
 */
export function configureApiClient(config: {
  baseUrl?: string
  headers?: Record<string, string>
}) {
  if (config.baseUrl) defaultBaseUrl = config.baseUrl
  if (config.headers) defaultHeaders = { ...defaultHeaders, ...config.headers }
}

/**
 * Build URL with params
 */
function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(path, defaultBaseUrl)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}

/**
 * Main fetch function with error handling
 */
async function apiFetch<T>(
  path: string,
  config: RequestConfig = {}
): Promise<T> {
  const { baseUrl, params, timeout = 30000, ...fetchConfig } = config

  const url = buildUrl(path, params)

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers: {
        ...defaultHeaders,
        ...fetchConfig.headers,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Handle non-OK responses
    if (!response.ok) {
      let body: unknown
      try {
        body = await response.json()
      } catch {
        body = null
      }
      throw ApiError.fromResponse(response, body)
    }

    // Handle empty responses
    if (response.status === 204) {
      return null as T
    }

    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)

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

/**
 * API Client methods
 */
export const apiClient = {
  /**
   * GET request
   */
  get: <T>(path: string, config?: RequestConfig): Promise<T> =>
    apiFetch<T>(path, { ...config, method: 'GET' }),

  /**
   * POST request
   */
  post: <T>(path: string, data?: unknown, config?: RequestConfig): Promise<T> =>
    apiFetch<T>(path, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PUT request
   */
  put: <T>(path: string, data?: unknown, config?: RequestConfig): Promise<T> =>
    apiFetch<T>(path, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PATCH request
   */
  patch: <T>(path: string, data?: unknown, config?: RequestConfig): Promise<T> =>
    apiFetch<T>(path, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * DELETE request
   */
  delete: <T>(path: string, config?: RequestConfig): Promise<T> =>
    apiFetch<T>(path, { ...config, method: 'DELETE' }),
}

