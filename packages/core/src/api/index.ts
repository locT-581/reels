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

// Queries
export * from './queries/videos'
export * from './queries/comments'

// Mutations
export * from './mutations/videos'
export * from './mutations/comments'

