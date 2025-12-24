/**
 * @xhub-reel/core - API Layer
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

// XHubReel Provider (for API integration)
export {
  XHubReelProvider,
  useXHubReelConfig,
  useXHubReelApiMode,
  useRequireConfig,
  XHubReelContext,
} from './xhub-reel-provider'

// XHubReel API Client (for custom implementations)
export {
  XHubReelApiClient,
  createXHubReelApiClient,
} from './xhub-reel-api-client'

// XHubReel API Client Hook (for use in components)
export {
  useXHubReelApiClient,
  useXHubReelApiClientOptional,
  createApiClientFromConfig,
} from './useXHubReelApiClient'

// Queries
export * from './queries/videos'
export * from './queries/comments'

// Mutations
export * from './mutations/videos'
export * from './mutations/comments'

