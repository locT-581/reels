/**
 * VortexProvider - React Context Provider for API configuration
 *
 * Usage:
 * ```tsx
 * // API Mode - fetch videos from your backend
 * <VortexProvider config={{
 *   baseUrl: 'https://api.yoursite.com/v1',
 *   auth: { accessToken: 'xxx' },
 * }}>
 *   <App />
 * </VortexProvider>
 *
 * // Manual Mode - pass videos directly to components
 * <VortexProvider>
 *   <VideoFeed videos={myVideos} />
 * </VortexProvider>
 * ```
 */

'use client'

import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { VortexConfig, VortexContextValue, VortexProviderProps } from '@vortex/types'

// =============================================================================
// CONTEXT
// =============================================================================

const VortexContext = createContext<VortexContextValue | null>(null)

// =============================================================================
// PROVIDER
// =============================================================================

/**
 * VortexProvider - Wrap your app to enable API integration
 *
 * @example
 * ```tsx
 * // With API configuration
 * <VortexProvider
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
 * </VortexProvider>
 *
 * // Without config (manual mode)
 * <VortexProvider>
 *   <VideoFeed videos={localVideos} />
 * </VortexProvider>
 * ```
 */
export function VortexProvider({ config, children }: VortexProviderProps) {
  const [currentConfig, setCurrentConfig] = useState<VortexConfig | null>(config ?? null)

  // Update config at runtime
  const updateConfig = useCallback((newConfig: Partial<VortexConfig>) => {
    setCurrentConfig((prev) => {
      if (!prev) {
        // If no previous config, newConfig must include baseUrl
        if (!newConfig.baseUrl) {
          console.warn('[Vortex] Cannot update config without baseUrl')
          return prev
        }
        return newConfig as VortexConfig
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
  const value = useMemo<VortexContextValue>(
    () => ({
      config: currentConfig,
      isApiMode: currentConfig !== null,
      updateConfig,
      setAccessToken,
    }),
    [currentConfig, updateConfig, setAccessToken]
  )

  return (
    <VortexContext.Provider value={value}>
      {children}
    </VortexContext.Provider>
  )
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * useVortexConfig - Access VortexStream configuration
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { config, isApiMode, setAccessToken } = useVortexConfig()
 *
 *   if (!isApiMode) {
 *     return <div>API mode not enabled</div>
 *   }
 *
 *   return <div>Connected to: {config?.baseUrl}</div>
 * }
 * ```
 */
export function useVortexConfig(): VortexContextValue {
  const context = useContext(VortexContext)

  if (!context) {
    // Return default value when used outside provider (manual mode)
    return {
      config: null,
      isApiMode: false,
      updateConfig: () => {
        console.warn('[Vortex] useVortexConfig called outside VortexProvider')
      },
      setAccessToken: () => {
        console.warn('[Vortex] useVortexConfig called outside VortexProvider')
      },
    }
  }

  return context
}

/**
 * useVortexApiMode - Check if API mode is enabled
 *
 * @example
 * ```tsx
 * function VideoFeedWrapper() {
 *   const isApiMode = useVortexApiMode()
 *
 *   if (isApiMode) {
 *     return <VideoFeed /> // Will fetch from API
 *   }
 *
 *   return <VideoFeed videos={localVideos} /> // Manual mode
 * }
 * ```
 */
export function useVortexApiMode(): boolean {
  const { isApiMode } = useVortexConfig()
  return isApiMode
}

// =============================================================================
// UTILITY
// =============================================================================

/**
 * Get config or throw if not in API mode
 * Used internally by API hooks
 */
export function useRequireConfig(): VortexConfig {
  const { config, isApiMode } = useVortexConfig()

  if (!isApiMode || !config) {
    throw new Error(
      '[Vortex] This hook requires API mode. ' +
      'Wrap your app with <VortexProvider config={{...}}>'
    )
  }

  return config
}

// Export context for advanced use cases
export { VortexContext }

