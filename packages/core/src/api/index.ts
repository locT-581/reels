/**
 * @vortex/core - API Layer
 */

export {
  createQueryClient,
  ApiError,
  queryKeys,
  type QueryClientConfig,
} from './query-client'

export {
  apiClient,
  configureApiClient,
  type RequestConfig,
  type ApiResponse,
} from './api-client'

// Vortex Provider (for API integration)
export {
  VortexProvider,
  useVortexConfig,
  useVortexApiMode,
  useRequireConfig,
  VortexContext,
} from './vortex-provider'

// Vortex API Client (for custom implementations)
export {
  VortexApiClient,
  createVortexApiClient,
} from './vortex-api-client'

// Vortex API Client Hook (for use in components)
export {
  useVortexApiClient,
  useVortexApiClientOptional,
  createApiClientFromConfig,
} from './useVortexApiClient'

// Queries
export * from './queries/videos'
export * from './queries/comments'

// Mutations
export * from './mutations/videos'
export * from './mutations/comments'

