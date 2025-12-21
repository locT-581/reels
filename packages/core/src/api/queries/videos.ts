/**
 * Video Queries - TanStack Query hooks for video data
 */

'use client'

import {
  useQuery,
  useInfiniteQuery,
  type UseQueryOptions,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query'
import { apiClient, type ApiResponse } from '../api-client'
import { queryKeys } from '../query-client'
import type { Video, VideoMetadata, FeedType } from '../../types'

// ============================================
// Types
// ============================================

export interface VideoListParams {
  feedType?: FeedType
  userId?: string
  tag?: string
  limit?: number
}

export interface VideoListResponse {
  videos: Video[]
  nextCursor?: string
  hasMore: boolean
}

// ============================================
// Query Functions
// ============================================

/**
 * Fetch video list (paginated)
 */
async function fetchVideos(params: VideoListParams & { cursor?: string }): Promise<VideoListResponse> {
  const response = await apiClient.get<ApiResponse<VideoListResponse>>('/videos', {
    params: {
      feedType: params.feedType,
      userId: params.userId,
      tag: params.tag,
      limit: params.limit || 10,
      cursor: params.cursor,
    },
  })
  return response.data
}

/**
 * Fetch single video
 */
async function fetchVideo(videoId: string): Promise<Video> {
  const response = await apiClient.get<ApiResponse<Video>>(`/videos/${videoId}`)
  return response.data
}

/**
 * Fetch video metadata (for player)
 */
async function fetchVideoMetadata(videoId: string): Promise<VideoMetadata> {
  const response = await apiClient.get<ApiResponse<VideoMetadata>>(
    `/videos/${videoId}/metadata`
  )
  return response.data
}

// ============================================
// Query Hooks
// ============================================

/**
 * Hook for infinite video feed
 */
export function useVideosInfiniteQuery(
  params: VideoListParams = {},
  options?: Partial<UseInfiniteQueryOptions<VideoListResponse, Error>>
) {
  return useInfiniteQuery({
    queryKey: queryKeys.videos.list(params as Record<string, unknown>),
    queryFn: ({ pageParam }) => fetchVideos({ ...params, cursor: pageParam as string }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
    ...options,
  })
}

/**
 * Hook for single video
 */
export function useVideoQuery(
  videoId: string,
  options?: Partial<UseQueryOptions<Video, Error>>
) {
  return useQuery({
    queryKey: queryKeys.videos.detail(videoId),
    queryFn: () => fetchVideo(videoId),
    enabled: !!videoId,
    ...options,
  })
}

/**
 * Hook for video metadata
 */
export function useVideoMetadataQuery(
  videoId: string,
  options?: Partial<UseQueryOptions<VideoMetadata, Error>>
) {
  return useQuery({
    queryKey: [...queryKeys.videos.detail(videoId), 'metadata'],
    queryFn: () => fetchVideoMetadata(videoId),
    enabled: !!videoId,
    staleTime: 1000 * 60 * 10, // 10 minutes - metadata changes less frequently
    ...options,
  })
}

/**
 * Prefetch videos for feed
 */
export function prefetchVideos(
  queryClient: ReturnType<typeof import('@tanstack/react-query').useQueryClient>,
  params: VideoListParams = {}
) {
  return queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.videos.list(params as Record<string, unknown>),
    queryFn: ({ pageParam }) => fetchVideos({ ...params, cursor: pageParam as string }),
    initialPageParam: undefined as string | undefined,
  })
}

/**
 * Prefetch single video
 */
export function prefetchVideo(
  queryClient: ReturnType<typeof import('@tanstack/react-query').useQueryClient>,
  videoId: string
) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.videos.detail(videoId),
    queryFn: () => fetchVideo(videoId),
  })
}

