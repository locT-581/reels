/**
 * useXHubReelApiClient - Hook to get XHubReelApiClient instance from context
 *
 * Creates and memoizes a XHubReelApiClient using the config from XHubReelProvider
 */

'use client'

import { useMemo } from 'react'
import { useXHubReelConfig } from './xhub-reel-provider'
import { XHubReelApiClient } from './xhub-reel-api-client'
import type { XHubReelConfig } from '@xhub-reel/types'

/**
 * Get a memoized XHubReelApiClient instance
 *
 * @throws Error if used outside XHubReelProvider or in manual mode
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const apiClient = useXHubReelApiClient()
 *   const videos = await apiClient.fetchVideos()
 * }
 * ```
 */
export function useXHubReelApiClient(): XHubReelApiClient {
  const { config, isApiMode } = useXHubReelConfig()

  const apiClient = useMemo(() => {
    if (!isApiMode || !config) {
      // Return a dummy client that throws on use
      // This allows the hook to be called unconditionally
      return null
    }
    return new XHubReelApiClient(config)
  }, [config, isApiMode])

  if (!apiClient) {
    throw new Error(
      '[XHubReel] useXHubReelApiClient requires API mode. ' +
      'Wrap your app with <XHubReelProvider config={{...}}>'
    )
  }

  return apiClient
}

/**
 * Get XHubReelApiClient or null if not in API mode
 * Useful for hooks that support both API and manual mode
 */
export function useXHubReelApiClientOptional(): XHubReelApiClient | null {
  const { config, isApiMode } = useXHubReelConfig()

  return useMemo(() => {
    if (!isApiMode || !config) {
      return null
    }
    return new XHubReelApiClient(config)
  }, [config, isApiMode])
}

/**
 * Create XHubReelApiClient from config (for non-hook usage)
 */
export function createApiClientFromConfig(config: XHubReelConfig): XHubReelApiClient {
  return new XHubReelApiClient(config)
}

