/**
 * useVideoFeed - Hook for fetching videos from API with infinite scroll support
 *
 * Uses VortexProvider config to fetch videos. Falls back to manual mode if no config.
 *
 * @example
 * ```tsx
 * // API Mode (requires VortexProvider with config)
 * function FeedPage() {
 *   const {
 *     videos,
 *     isLoading,
 *     hasMore,
 *     fetchNextPage,
 *     error,
 *   } = useVideoFeed()
 *
 *   return <VideoFeed videos={videos} onLoadMore={fetchNextPage} />
 * }
 *
 * // Manual Mode (pass videos directly)
 * function FeedPage() {
 *   const localVideos = [...]
 *   return <VideoFeed videos={localVideos} />
 * }
 * ```
 */

'use client'

import type { VortexApiClient } from '@vortex/core/api'
import type { InfiniteData } from '@tanstack/react-query'
import type { VortexConfig, VideoFetchParams, VideoListResponse, Video } from '@vortex/core'

import { queryKeys, createVortexApiClient } from '@vortex/core/api'
import { useMemo, useCallback, useRef, useEffect } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'


// =============================================================================
// TYPES
// =============================================================================

export interface UseVideoFeedOptions {
  /**
   * VortexConfig - required for API mode
   * If not provided, the hook returns empty data (use manual mode)
   */
  config?: VortexConfig

  /**
   * Enable/disable the query (default: true)
   */
  enabled?: boolean

  /**
   * Initial videos to show while loading
   */
  initialVideos?: Video[]

  /**
   * Stale time in ms (default: 5 minutes)
   */
  staleTime?: number

  /**
   * Refetch on window focus (default: false)
   */
  refetchOnWindowFocus?: boolean

  /**
   * Callback when videos are fetched
   */
  onSuccess?: (videos: Video[]) => void

  /**
   * Callback on error
   */
  onError?: (error: Error) => void

  // Fetch parameters (from VideoFetchParams)
  /** User ID filter */
  userId?: string
  /** Tag/hashtag filter */
  tag?: string
  /** Search query */
  searchQuery?: string
  /** Number of videos per page */
  limit?: number
  /** Pagination cursor */
  cursor?: string
}

export interface UseVideoFeedReturn {
  /** Flattened array of all fetched videos */
  videos: Video[]

  /** Loading state for initial fetch */
  isLoading: boolean

  /** Loading state for fetching more */
  isFetchingMore: boolean

  /** Whether there are more videos to load */
  hasMore: boolean

  /** Fetch next page of videos */
  fetchNextPage: () => Promise<void>

  /** Refetch all videos */
  refetch: () => Promise<void>

  /** Error if any */
  error: Error | null

  /** Whether API mode is active */
  isApiMode: boolean

  /** Total count of videos (if provided by API) */
  totalCount?: number
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * useVideoFeed - Fetch videos with infinite scroll support
 */
export function useVideoFeed(options: UseVideoFeedOptions = {}): UseVideoFeedReturn {
  const {
    config,
    enabled = true,
    initialVideos = [],
    staleTime = 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus = false,
    onSuccess,
    onError,
    userId,
    tag,
    searchQuery,
    limit = 10,
    cursor,
  } = options

  // queryClient is available for cache invalidation if needed
  void useQueryClient()

  // Create API client ref to avoid recreating on every render
  const apiClientRef = useRef<VortexApiClient | null>(null)

  // ✅ Serialize config để so sánh stable - tránh re-create API client khi reference thay đổi nhưng content giống nhau
  const configKey = useMemo(() => {
    if (!config) return null
    return JSON.stringify({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      auth: config.auth?.accessToken,
      endpoints: config.endpoints,
    })
  }, [config])

  // Update API client when config actually changes (by content, not reference)
  useEffect(() => {
    if (config && configKey) {
      apiClientRef.current = createVortexApiClient(config)
    } else {
      apiClientRef.current = null
    }
  }, [configKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // Build fetch params for query key
  const fetchParams: VideoFetchParams = useMemo(
    () => ({
      userId,
      tag,
      searchQuery,
      limit,
      cursor,
    }),
    [userId, tag, searchQuery, limit, cursor]
  )

  // Query key
  const queryKey = useMemo(
    () => queryKeys.videos.list(fetchParams as Record<string, unknown>),
    [fetchParams]
  )

  // Fetch function
  const fetchVideos = useCallback(
    async ({ pageParam }: { pageParam?: string }): Promise<VideoListResponse> => {
      if (!apiClientRef.current) {
        throw new Error('[Vortex] API client not initialized. Provide config to useVideoFeed.')
      }

      return apiClientRef.current.fetchVideos({
        ...fetchParams,
        cursor: pageParam,
      })
    },
    [fetchParams]
  )

  // Use infinite query
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage: tanstackFetchNextPage,
    refetch: tanstackRefetch,
    error,
  } = useInfiniteQuery<VideoListResponse, Error, InfiniteData<VideoListResponse>, typeof queryKey, string | undefined>({
    queryKey,
    queryFn: fetchVideos,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    initialPageParam: undefined,
    enabled: enabled && !!config,
    staleTime,
    refetchOnWindowFocus,
  })

  // Handle success callback
  useEffect(() => {
    if (data && onSuccess) {
      const allVideos = data.pages.flatMap((page) => page.videos)
      onSuccess(allVideos)
    }
  }, [data, onSuccess])

  // Handle error callback
  useEffect(() => {
    if (error && onError) {
      onError(error)
    }
  }, [error, onError])

  // Flatten videos from all pages
  const videos = useMemo(() => {
    if (!data) {
      return initialVideos
    }
    return data.pages.flatMap((page) => page.videos)
  }, [data, initialVideos])

  // Get total count if available
  const totalCount = useMemo(() => {
    if (!data || data.pages.length === 0) return undefined
    const firstPage = data.pages[0]
    return firstPage?.total
  }, [data])

  // Wrapped fetchNextPage that handles errors
  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return

    try {
      await tanstackFetchNextPage()
    } catch (err) {
      console.error('[Vortex] Error fetching next page:', err)
      onError?.(err as Error)
    }
  }, [hasNextPage, isFetchingNextPage, tanstackFetchNextPage, onError])

  // Wrapped refetch
  const refetch = useCallback(async () => {
    try {
      await tanstackRefetch()
    } catch (err) {
      console.error('[Vortex] Error refetching:', err)
      onError?.(err as Error)
    }
  }, [tanstackRefetch, onError])

  return {
    videos,
    isLoading: isLoading && !!config,
    isFetchingMore: isFetchingNextPage,
    hasMore: hasNextPage ?? false,
    fetchNextPage,
    refetch,
    error: error ?? null,
    isApiMode: !!config,
    totalCount,
  }
}

// =============================================================================
// PREFETCH UTILITY
// =============================================================================

/**
 * Prefetch videos for a feed type
 * Call this in a Server Component or before navigation to pre-warm cache
 *
 * @example
 * ```tsx
 * // In a page component
 * export async function generateStaticParams() {
 *   const queryClient = new QueryClient()
 *   await prefetchVideoFeed(queryClient, config)
 *   return { props: { dehydratedState: dehydrate(queryClient) } }
 * }
 * ```
 */
export async function prefetchVideoFeed(
  queryClient: ReturnType<typeof useQueryClient>,
  config: VortexConfig,
  params: VideoFetchParams = {}
): Promise<void> {
  const client = createVortexApiClient(config)

  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.videos.list(params as Record<string, unknown>),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      client.fetchVideos({ ...params, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
  })
}

