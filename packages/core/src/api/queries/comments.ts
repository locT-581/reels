/**
 * Comment Queries - TanStack Query hooks for comments
 *
 * Uses XHubReelApiClient from context for configurable endpoints
 */

'use client'

import {
  useQuery,
  useInfiniteQuery,
  type UseQueryOptions,
  type UseInfiniteQueryOptions,
  type QueryClient,
} from '@tanstack/react-query'
import { useXHubReelApiClient } from '../useXHubReelApiClient'
import { queryKeys } from '../query-client'
import type { CommentsListResponse, RepliesListResponse } from '../../types'

// ============================================
// Types
// ============================================

export interface CommentFetchParams {
  videoId: string
  sortBy?: 'top' | 'newest' | 'oldest'
  limit?: number
}

export interface ReplyFetchParams {
  commentId: string
  videoId: string
  limit?: number
}

// ============================================
// Query Hooks
// ============================================

/**
 * Hook for infinite comments list
 *
 * Requires XHubReelProvider with config
 *
 * @example
 * ```tsx
 * function CommentSection({ videoId }: { videoId: string }) {
 *   const { data, fetchNextPage, hasNextPage } = useCommentsInfiniteQuery({
 *     videoId,
 *     sortBy: 'top',
 *     limit: 20
 *   })
 *
 *   const comments = data?.pages.flatMap(page => page.comments) ?? []
 *   return <CommentList comments={comments} onLoadMore={fetchNextPage} />
 * }
 * ```
 */
export function useCommentsInfiniteQuery(
  params: CommentFetchParams,
  options?: Partial<UseInfiniteQueryOptions<CommentsListResponse, Error>>
) {
  const apiClient = useXHubReelApiClient()

  return useInfiniteQuery({
    queryKey: queryKeys.comments.list(params.videoId),
    queryFn: async ({ pageParam }) => {
      return apiClient.fetchComments(params.videoId, {
        cursor: pageParam as string,
        limit: params.limit,
      })
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!params.videoId,
    ...options,
  })
}

/**
 * Hook for infinite replies list
 *
 * Note: XHubReelApiClient doesn't have a fetchReplies method yet,
 * so this uses the generic get method with the replies endpoint
 *
 * @example
 * ```tsx
 * function ReplySection({ commentId, videoId }: { commentId: string; videoId: string }) {
 *   const { data, fetchNextPage } = useRepliesInfiniteQuery({
 *     commentId,
 *     videoId,
 *     limit: 10
 *   })
 *
 *   const replies = data?.pages.flatMap(page => page.replies) ?? []
 *   return <ReplyList replies={replies} />
 * }
 * ```
 */
export function useRepliesInfiniteQuery(
  params: ReplyFetchParams,
  options?: Partial<UseInfiniteQueryOptions<RepliesListResponse, Error>>
) {
  const apiClient = useXHubReelApiClient()

  return useInfiniteQuery({
    queryKey: queryKeys.comments.replies(params.commentId),
    queryFn: async ({ pageParam }) => {
      // Use generic get since XHubReelApiClient doesn't have fetchReplies
      // The endpoint follows pattern: /comments/:commentId/replies
      return apiClient.get<RepliesListResponse>(
        `/comments/${params.commentId}/replies`,
        {
          cursor: pageParam as string,
          limit: params.limit,
        }
      )
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!params.commentId,
    ...options,
  })
}

/**
 * Get comment count for a video
 *
 * @example
 * ```tsx
 * function CommentCount({ videoId }: { videoId: string }) {
 *   const { data: count } = useCommentCountQuery(videoId)
 *   return <span>{formatCount(count ?? 0)} comments</span>
 * }
 * ```
 */
export function useCommentCountQuery(
  videoId: string,
  options?: Partial<UseQueryOptions<number, Error>>
) {
  const apiClient = useXHubReelApiClient()

  return useQuery({
    queryKey: [...queryKeys.comments.list(videoId), 'count'],
    queryFn: async () => {
      const response = await apiClient.get<{ count: number }>(
        `/videos/${videoId}/comments/count`
      )
      return response.count
    },
    enabled: !!videoId,
    staleTime: 1000 * 60, // 1 minute
    ...options,
  })
}

/**
 * Prefetch comments for a video
 *
 * @example
 * ```tsx
 * // Prefetch when video comes into view
 * const queryClient = useQueryClient()
 * const apiClient = useXHubReelApiClient()
 *
 * useEffect(() => {
 *   prefetchComments(queryClient, apiClient, videoId)
 * }, [videoId])
 * ```
 */
export function prefetchComments(
  queryClient: QueryClient,
  apiClient: { fetchComments: (videoId: string, params?: { cursor?: string; limit?: number }) => Promise<CommentsListResponse> },
  videoId: string,
  params?: { limit?: number }
) {
  return queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.comments.list(videoId),
    queryFn: ({ pageParam }) =>
      apiClient.fetchComments(videoId, {
        cursor: pageParam as string,
        limit: params?.limit,
      }),
    initialPageParam: undefined as string | undefined,
  })
}
