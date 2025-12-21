/**
 * TanStack Query Client Configuration
 */

import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'

export interface QueryClientConfig {
  /** Default stale time in ms */
  staleTime?: number
  /** Default cache time (gcTime) in ms */
  gcTime?: number
  /** Max retry attempts */
  retryCount?: number
  /** Retry delay in ms */
  retryDelay?: number
  /** Error handler */
  onError?: (error: Error) => void
}

const DEFAULT_CONFIG: QueryClientConfig = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 30, // 30 minutes
  retryCount: 3,
  retryDelay: 1000,
}

/**
 * Create a configured QueryClient for VortexStream
 */
export function createQueryClient(config: QueryClientConfig = {}): QueryClient {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        console.error('[VortexQuery] Query error:', error)
        mergedConfig.onError?.(error as Error)
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        console.error('[VortexQuery] Mutation error:', error)
        mergedConfig.onError?.(error as Error)
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: mergedConfig.staleTime,
        gcTime: mergedConfig.gcTime,
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
            return false
          }
          return failureCount < (mergedConfig.retryCount || 3)
        },
        retryDelay: (attemptIndex) =>
          Math.min(
            (mergedConfig.retryDelay || 1000) * 2 ** attemptIndex,
            30000
          ),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
        retryDelay: mergedConfig.retryDelay,
      },
    },
  })
}

/**
 * API Error class for typed error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static fromResponse(response: Response, body?: unknown): ApiError {
    const message =
      (body as { message?: string })?.message ||
      `HTTP ${response.status}: ${response.statusText}`
    const code = (body as { code?: string })?.code
    const details = body as Record<string, unknown>

    return new ApiError(message, response.status, code, details)
  }
}

// Query Keys factory
export const queryKeys = {
  // Videos
  videos: {
    all: ['videos'] as const,
    lists: () => [...queryKeys.videos.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.videos.lists(), filters] as const,
    details: () => [...queryKeys.videos.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.videos.details(), id] as const,
  },

  // Comments
  comments: {
    all: ['comments'] as const,
    lists: () => [...queryKeys.comments.all, 'list'] as const,
    list: (videoId: string) => [...queryKeys.comments.lists(), videoId] as const,
    replies: (commentId: string) =>
      [...queryKeys.comments.all, 'replies', commentId] as const,
  },

  // User
  user: {
    all: ['user'] as const,
    profile: (userId: string) => [...queryKeys.user.all, 'profile', userId] as const,
    preferences: () => [...queryKeys.user.all, 'preferences'] as const,
    watchHistory: () => [...queryKeys.user.all, 'watchHistory'] as const,
  },
} as const

