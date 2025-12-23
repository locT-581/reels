/**
 * useVortexApiClient - Hook to get VortexApiClient instance from context
 *
 * Creates and memoizes a VortexApiClient using the config from VortexProvider
 */

'use client'

import { useMemo } from 'react'
import { useVortexConfig } from './vortex-provider'
import { VortexApiClient } from './vortex-api-client'
import type { VortexConfig } from '@vortex/types'

/**
 * Get a memoized VortexApiClient instance
 *
 * @throws Error if used outside VortexProvider or in manual mode
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const apiClient = useVortexApiClient()
 *   const videos = await apiClient.fetchVideos()
 * }
 * ```
 */
export function useVortexApiClient(): VortexApiClient {
  const { config, isApiMode } = useVortexConfig()

  const apiClient = useMemo(() => {
    if (!isApiMode || !config) {
      // Return a dummy client that throws on use
      // This allows the hook to be called unconditionally
      return null
    }
    return new VortexApiClient(config)
  }, [config, isApiMode])

  if (!apiClient) {
    throw new Error(
      '[Vortex] useVortexApiClient requires API mode. ' +
      'Wrap your app with <VortexProvider config={{...}}>'
    )
  }

  return apiClient
}

/**
 * Get VortexApiClient or null if not in API mode
 * Useful for hooks that support both API and manual mode
 */
export function useVortexApiClientOptional(): VortexApiClient | null {
  const { config, isApiMode } = useVortexConfig()

  return useMemo(() => {
    if (!isApiMode || !config) {
      return null
    }
    return new VortexApiClient(config)
  }, [config, isApiMode])
}

/**
 * Create VortexApiClient from config (for non-hook usage)
 */
export function createApiClientFromConfig(config: VortexConfig): VortexApiClient {
  return new VortexApiClient(config)
}

