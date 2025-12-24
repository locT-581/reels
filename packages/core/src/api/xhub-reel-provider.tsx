/**
 * XHubReelProvider - React Context Provider for API configuration
 *
 * Usage:
 * ```tsx
 * // API Mode - fetch videos from your backend
 * <XHubReelProvider config={{
 *   baseUrl: 'https://api.yoursite.com/v1',
 *   auth: { accessToken: 'xxx' },
 * }}>
 *   <App />
 * </XHubReelProvider>
 *
 * // Manual Mode - pass videos directly to components
 * <XHubReelProvider>
 *   <VideoFeed videos={myVideos} />
 * </XHubReelProvider>
 * ```
 */

'use client'

import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { XHubReelConfig, XHubReelContextValue, XHubReelProviderProps } from '@xhub-reel/types'

// =============================================================================
// CONTEXT
// =============================================================================

const XHubReelContext = createContext<XHubReelContextValue | null>(null)

// =============================================================================
// PROVIDER
// =============================================================================

/**
 * XHubReelProvider - Wrap your app to enable API integration
 *
 * @example
 * ```tsx
 * // With API configuration
 * <XHubReelProvider
 *   config={{
 *     baseUrl: 'https://api.example.com',
 *     auth: {
 *       accessToken: userToken,
 *       onTokenExpired: async () => {
 *         const newToken = await refreshToken()
 *         return { accessToken: newToken }
 *       },
 *     },
 *     endpoints: {
 *       videos: '/feed/videos',
 *       likeVideo: '/interactions/like/:id',
 *     },
 *   }}
 * >
 *   <App />
 * </XHubReelProvider>
 *
 * // Without config (manual mode)
 * <XHubReelProvider>
 *   <VideoFeed videos={localVideos} />
 * </XHubReelProvider>
 * ```
 */
export function XHubReelProvider({ config, children }: XHubReelProviderProps) {
  const [currentConfig, setCurrentConfig] = useState<XHubReelConfig | null>(config ?? null)

  // Update config at runtime
  const updateConfig = useCallback((newConfig: Partial<XHubReelConfig>) => {
    setCurrentConfig((prev) => {
      if (!prev) {
        // If no previous config, newConfig must include baseUrl
        if (!newConfig.baseUrl) {
          console.warn('[XHubReel] Cannot update config without baseUrl')
          return prev
        }
        return newConfig as XHubReelConfig
      }
      return { ...prev, ...newConfig }
    })
  }, [])

  // Update access token at runtime
  const setAccessToken = useCallback((token: string | undefined) => {
    setCurrentConfig((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        auth: {
          ...prev.auth,
          accessToken: token,
        },
      }
    })
  }, [])

  // Context value
  const value = useMemo<XHubReelContextValue>(
    () => ({
      config: currentConfig,
      isApiMode: currentConfig !== null,
      updateConfig,
      setAccessToken,
    }),
    [currentConfig, updateConfig, setAccessToken]
  )

  return (
    <XHubReelContext.Provider value={value}>
      {children}
    </XHubReelContext.Provider>
  )
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * useXHubReelConfig - Access XHubReel configuration
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { config, isApiMode, setAccessToken } = useXHubReelConfig()
 *
 *   if (!isApiMode) {
 *     return <div>API mode not enabled</div>
 *   }
 *
 *   return <div>Connected to: {config?.baseUrl}</div>
 * }
 * ```
 */
export function useXHubReelConfig(): XHubReelContextValue {
  const context = useContext(XHubReelContext)

  if (!context) {
    // Return default value when used outside provider (manual mode)
    return {
      config: null,
      isApiMode: false,
      updateConfig: () => {
        console.warn('[XHubReel] useXHubReelConfig called outside XHubReelProvider')
      },
      setAccessToken: () => {
        console.warn('[XHubReel] useXHubReelConfig called outside XHubReelProvider')
      },
    }
  }

  return context
}

/**
 * useXHubReelApiMode - Check if API mode is enabled
 *
 * @example
 * ```tsx
 * function VideoFeedWrapper() {
 *   const isApiMode = useXHubReelApiMode()
 *
 *   if (isApiMode) {
 *     return <VideoFeed /> // Will fetch from API
 *   }
 *
 *   return <VideoFeed videos={localVideos} /> // Manual mode
 * }
 * ```
 */
export function useXHubReelApiMode(): boolean {
  const { isApiMode } = useXHubReelConfig()
  return isApiMode
}

// =============================================================================
// UTILITY
// =============================================================================

/**
 * Get config or throw if not in API mode
 * Used internally by API hooks
 */
export function useRequireConfig(): XHubReelConfig {
  const { config, isApiMode } = useXHubReelConfig()

  if (!isApiMode || !config) {
    throw new Error(
      '[XHubReel] This hook requires API mode. ' +
      'Wrap your app with <XHubReelProvider config={{...}}>'
    )
  }

  return config
}

// Export context for advanced use cases
export { XHubReelContext }

