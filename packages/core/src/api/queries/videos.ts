/**
 * Video Queries - TanStack Query hooks for video data
 *
 * Uses VortexApiClient from context for configurable endpoints
 */

'use client'

import {
  useQuery,
  useInfiniteQuery,
  type QueryClient,
  type UseQueryOptions,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query'
import { useVortexApiClient } from '../useVortexApiClient'
import { queryKeys } from '../query-client'
import type { Video, VideoMetadata, VideoListResponse, VideoFetchParams } from '../../types'

// ============================================
// Query Hooks
// ============================================

/**
 * Hook for infinite video feed
 *
 * Requires VortexProvider with config
 *
 * @example
 * ```tsx
 * function VideoFeed() {
 *   const { data, fetchNextPage, hasNextPage } = useVideosInfiniteQuery({
 *     limit: 10,
 *     tags: ['trending']
 *   })
 *
 *   const videos = data?.pages.flatMap(page => page.videos) ?? []
 *   return <Feed videos={videos} onLoadMore={fetchNextPage} />
 * }
 * ```
 */
export function useVideosInfiniteQuery(
  params: VideoFetchParams = {},
  options?: Partial<UseInfiniteQueryOptions<VideoListResponse, Error>>
) {
  const apiClient = useVortexApiClient()

  return useInfiniteQuery({
    queryKey: queryKeys.videos.list(params as Record<string, unknown>),
    queryFn: async ({ pageParam }) => {
      return apiClient.fetchVideos({ ...params, cursor: pageParam as string })
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
    ...options,
  })
}

/**
 * Hook for single video
 *
 * Requires VortexProvider with config
 *
 * @example
 * ```tsx
 * function VideoPage({ videoId }: { videoId: string }) {
 *   const { data: video, isLoading } = useVideoQuery(videoId)
 *
 *   if (isLoading) return <Spinner />
 *   if (!video) return <NotFound />
 *
 *   return <VideoPlayer video={video} />
 * }
 * ```
 */
export function useVideoQuery(
  videoId: string,
  options?: Partial<UseQueryOptions<Video, Error>>
) {
  const apiClient = useVortexApiClient()

  return useQuery({
    queryKey: queryKeys.videos.detail(videoId),
    queryFn: () => apiClient.fetchVideo(videoId),
    enabled: !!videoId,
    ...options,
  })
}

/**
 * Hook for video metadata
 *
 * @example
 * ```tsx
 * function VideoInfo({ videoId }: { videoId: string }) {
 *   const { data: metadata } = useVideoMetadataQuery(videoId)
 *
 *   return (
 *     <div>
 *       <p>Codec: {metadata?.codec}</p>
 *       <p>Bitrate: {metadata?.bitrate}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useVideoMetadataQuery(
  videoId: string,
  options?: Partial<UseQueryOptions<VideoMetadata, Error>>
) {
  const apiClient = useVortexApiClient()

  return useQuery({
    queryKey: [...queryKeys.videos.detail(videoId), 'metadata'],
    queryFn: () => apiClient.fetchVideoMetadata(videoId),
    enabled: !!videoId,
    staleTime: 1000 * 60 * 10, // 10 minutes - metadata changes less frequently
    ...options,
  })
}

/**
 * Prefetch videos for feed
 *
 * Requires passing VortexApiClient instance
 *
 * @example
 * ```tsx
 * // In a server component or loader
 * const client = createVortexApiClient(config)
 * await prefetchVideos(queryClient, client)
 * ```
 */
export function prefetchVideos(
  queryClient: QueryClient,
  apiClient: { fetchVideos: (params?: VideoFetchParams) => Promise<VideoListResponse> },
  params: VideoFetchParams = {}
) {
  return queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.videos.list(params as Record<string, unknown>),
    queryFn: ({ pageParam }) =>
      apiClient.fetchVideos({ ...params, cursor: pageParam as string }),
    initialPageParam: undefined as string | undefined,
  })
}

/**
 * Prefetch single video
 *
 * @example
 * ```tsx
 * // Prefetch on hover
 * const queryClient = useQueryClient()
 * const apiClient = useVortexApiClient()
 *
 * onMouseEnter={() => prefetchVideo(queryClient, apiClient, video.id)}
 * ```
 */
export function prefetchVideo(
  queryClient: QueryClient,
  apiClient: { fetchVideo: (videoId: string) => Promise<Video> },
  videoId: string
) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.videos.detail(videoId),
    queryFn: () => apiClient.fetchVideo(videoId),
  })
}
