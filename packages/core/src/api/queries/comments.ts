/**
 * Comment Queries - TanStack Query hooks for comments
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
import type { Comment, Reply, CommentSortBy } from '../../types'

// ============================================
// Types
// ============================================

export interface CommentListParams {
  videoId: string
  sortBy?: CommentSortBy
  limit?: number
}

export interface CommentListResponse {
  comments: Comment[]
  nextCursor?: string
  hasMore: boolean
  totalCount: number
}

export interface ReplyListParams {
  commentId: string
  limit?: number
}

export interface ReplyListResponse {
  replies: Reply[]
  nextCursor?: string
  hasMore: boolean
}

// ============================================
// Query Functions
// ============================================

/**
 * Fetch comments for a video (paginated)
 */
async function fetchComments(
  params: CommentListParams & { cursor?: string }
): Promise<CommentListResponse> {
  const response = await apiClient.get<ApiResponse<CommentListResponse>>(
    `/videos/${params.videoId}/comments`,
    {
      params: {
        sortBy: params.sortBy || 'top',
        limit: params.limit || 20,
        cursor: params.cursor,
      },
    }
  )
  return response.data
}

/**
 * Fetch replies for a comment (paginated)
 */
async function fetchReplies(
  params: ReplyListParams & { cursor?: string }
): Promise<ReplyListResponse> {
  const response = await apiClient.get<ApiResponse<ReplyListResponse>>(
    `/comments/${params.commentId}/replies`,
    {
      params: {
        limit: params.limit || 10,
        cursor: params.cursor,
      },
    }
  )
  return response.data
}

// ============================================
// Query Hooks
// ============================================

/**
 * Hook for infinite comments list
 */
export function useCommentsInfiniteQuery(
  params: CommentListParams,
  options?: Partial<UseInfiniteQueryOptions<CommentListResponse, Error>>
) {
  return useInfiniteQuery({
    queryKey: queryKeys.comments.list(params.videoId),
    queryFn: ({ pageParam }) =>
      fetchComments({ ...params, cursor: pageParam as string }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!params.videoId,
    ...options,
  })
}

/**
 * Hook for infinite replies list
 */
export function useRepliesInfiniteQuery(
  params: ReplyListParams,
  options?: Partial<UseInfiniteQueryOptions<ReplyListResponse, Error>>
) {
  return useInfiniteQuery({
    queryKey: queryKeys.comments.replies(params.commentId),
    queryFn: ({ pageParam }) =>
      fetchReplies({ ...params, cursor: pageParam as string }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!params.commentId,
    ...options,
  })
}

/**
 * Get comment count for a video (from cache or fresh)
 */
export function useCommentCountQuery(
  videoId: string,
  options?: Partial<UseQueryOptions<number, Error>>
) {
  return useQuery({
    queryKey: [...queryKeys.comments.list(videoId), 'count'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{ count: number }>>(
        `/videos/${videoId}/comments/count`
      )
      return response.data.count
    },
    enabled: !!videoId,
    staleTime: 1000 * 60, // 1 minute
    ...options,
  })
}

/**
 * Prefetch comments for a video
 */
export function prefetchComments(
  queryClient: ReturnType<typeof import('@tanstack/react-query').useQueryClient>,
  params: CommentListParams
) {
  return queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.comments.list(params.videoId),
    queryFn: ({ pageParam }) =>
      fetchComments({ ...params, cursor: pageParam as string }),
    initialPageParam: undefined as string | undefined,
  })
}

