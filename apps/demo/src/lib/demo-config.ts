/**
 * Demo Configuration Store
 *
 * Manages API configuration with localStorage persistence.
 * Allows users to switch between mock mode and API mode.
 */

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { XHubReelConfig } from '@xhub-reel/core'
import {
  transformReelsResponse,
  transformSingleReelResponse,
  transformCommentsResponse,
} from '@xhub-reel/core'

// =============================================================================
// TYPES
// =============================================================================

export type DemoMode = 'mock' | 'api'

export interface DemoConfigState {
  // Mode
  mode: DemoMode

  // API Configuration
  baseUrl: string
  apiKey: string
  accessToken: string
  refreshToken: string

  // Custom endpoints (optional overrides)
  endpoints: {
    videos: string
    comments: string
  }

  // Debug
  debugMode: boolean

  // Connection status
  connectionStatus: 'idle' | 'testing' | 'success' | 'error'
  lastError: string | null

  // Actions
  setMode: (mode: DemoMode) => void
  setBaseUrl: (url: string) => void
  setApiKey: (apiKey: string) => void
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
  setEndpoints: (endpoints: Partial<DemoConfigState['endpoints']>) => void
  setDebugMode: (enabled: boolean) => void
  setConnectionStatus: (status: DemoConfigState['connectionStatus'], error?: string) => void
  resetConfig: () => void
}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

const DEFAULT_CONFIG: Omit<DemoConfigState, 'setMode' | 'setBaseUrl' | 'setApiKey' | 'setAccessToken' | 'setRefreshToken' | 'setEndpoints' | 'setDebugMode' | 'setConnectionStatus' | 'resetConfig'> = {
  mode: 'mock',
  baseUrl: '',
  apiKey: '',
  accessToken: '',
  refreshToken: '',
  endpoints: {
    // Default endpoint matching BE API structure
    // Response format: { code, data: { reels: [...], has_next, next_cursor }, success }
    videos: '/reels',
    comments: '/reels/:videoId/comments',
  },
  debugMode: false,
  connectionStatus: 'idle',
  lastError: null,
}

// =============================================================================
// STORE
// =============================================================================

export const useDemoConfig = create<DemoConfigState>()(
  persist(
    (set) => ({
      ...DEFAULT_CONFIG,

      setMode: (mode) => set({ mode }),

      setBaseUrl: (baseUrl) => set({ baseUrl, connectionStatus: 'idle', lastError: null }),

      setApiKey: (apiKey) => set({ apiKey }),

      setAccessToken: (accessToken) => set({ accessToken }),

      setRefreshToken: (refreshToken) => set({ refreshToken }),

      setEndpoints: (endpoints) =>
        set((state) => ({
          endpoints: { ...state.endpoints, ...endpoints },
        })),

      setDebugMode: (debugMode) => set({ debugMode }),

      setConnectionStatus: (connectionStatus, lastError) =>
        set({ connectionStatus, lastError: lastError ?? null }),

      resetConfig: () => set(DEFAULT_CONFIG),
    }),
    {
      name: 'xhub-reel-demo-config',
      partialize: (state) => ({
        mode: state.mode,
        baseUrl: state.baseUrl,
        apiKey: state.apiKey,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        endpoints: state.endpoints,
        debugMode: state.debugMode,
      }),
    }
  )
)

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Convert demo config to XHubReelConfig
 */
export function toXHubReelConfig(config: DemoConfigState): XHubReelConfig | null {
  if (config.mode === 'mock' || !config.baseUrl) {
    return null
  }

  return {
    baseUrl: config.baseUrl,
    apiKey: config.apiKey || undefined,
    auth: config.accessToken
      ? {
          accessToken: config.accessToken,
          refreshToken: config.refreshToken || undefined,
        }
      : undefined,
    endpoints: {
      videos: config.endpoints.videos,
      comments: config.endpoints.comments,
    },
    // Sử dụng pre-built transformers để chuyển đổi API response sang XHubReel format
    // BE response: { code, data: { reels: [...], has_next, next_cursor } }
    // -> XHubReel format: { videos: [...], hasMore, nextCursor }
    transformers: {
      transformVideoList: transformReelsResponse,
      transformVideo: transformSingleReelResponse,
      transformComments: transformCommentsResponse,
    },
    debug: config.debugMode,
  }
}

/**
 * Test API connection
 */
/**
 * Safely join base URL with endpoint path
 */
function joinUrl(baseUrl: string, endpoint: string): string {
  // Ensure baseUrl ends with /
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  // Remove leading / from endpoint
  const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${base}${path}`
}

export async function testConnection(config: DemoConfigState): Promise<{ success: boolean; error?: string }> {
  if (!config.baseUrl) {
    return { success: false, error: 'Base URL is required' }
  }

  try {
    const fullUrl = joinUrl(config.baseUrl, config.endpoints.videos)
    const url = new URL(fullUrl)

    // Add api_key if configured
    if (config.apiKey) {
      url.searchParams.set('api_key', config.apiKey)
    }

    url.searchParams.set('limit', '1')

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (config.accessToken) {
      headers['Authorization'] = `Bearer ${config.accessToken}`
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText.slice(0, 100)}`,
      }
    }

    // Try to parse JSON
    const data = await response.json()

    // Basic validation - check if it looks like a video list response
    // BE format: { code: 200, data: { reels: [...], has_next, next_cursor }, success: true }
    // Also support legacy formats
    const hasReelsFormat = data?.data?.reels && Array.isArray(data.data.reels)
    const hasVideosFormat = data?.videos && Array.isArray(data.videos)
    const hasLegacyDataFormat = data?.data && Array.isArray(data.data)
    const isArrayFormat = Array.isArray(data)

    if (hasReelsFormat || hasVideosFormat || hasLegacyDataFormat || isArrayFormat) {
      return { success: true }
    }

    return {
      success: false,
      error: 'Response does not match expected format (expected { data: { reels: [...] } } or { videos: [...] })',
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { success: false, error: 'Network error - check CORS or URL' }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

