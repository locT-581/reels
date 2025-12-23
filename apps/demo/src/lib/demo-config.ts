/**
 * Demo Configuration Store
 *
 * Manages API configuration with localStorage persistence.
 * Allows users to switch between mock mode and API mode.
 */

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { VortexConfig } from '@vortex/core'

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
    videos: '/videos',
    comments: '/videos/:videoId/comments',
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
      name: 'vortex-demo-config',
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
 * Convert demo config to VortexConfig
 */
export function toVortexConfig(config: DemoConfigState): VortexConfig | null {
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
    if (Array.isArray(data) || (data && (Array.isArray(data.videos) || Array.isArray(data.data)))) {
      return { success: true }
    }

    return {
      success: false,
      error: 'Response does not match expected format (expected { videos: [...] } or array)',
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

