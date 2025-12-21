/**
 * Comment Mutations - TanStack Query mutations for comment actions
 */

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api-client'
import { queryKeys } from '../query-client'
import type { Comment } from '../../types'

// ============================================
// Types
// ============================================

export interface PostCommentInput {
  videoId: string
  content: string
  replyToId?: string // For replies
}

export interface PostCommentResponse {
  comment: Comment
}

export interface LikeCommentResponse {
  liked: boolean
  likesCount: number
}

// ============================================
// Mutation Functions
// ============================================

/**
 * Post a new comment
 */
async function postComment(input: PostCommentInput): Promise<PostCommentResponse> {
  const endpoint = input.replyToId
    ? `/comments/${input.replyToId}/reply`
    : `/videos/${input.videoId}/comments`

  return apiClient.post<PostCommentResponse>(endpoint, {
    content: input.content,
  })
}

/**
 * Like/Unlike a comment
 */
async function likeComment(commentId: string): Promise<LikeCommentResponse> {
  return apiClient.post<LikeCommentResponse>(`/comments/${commentId}/like`)
}

/**
 * Delete a comment
 */
async function deleteComment(commentId: string): Promise<void> {
  return apiClient.delete(`/comments/${commentId}`)
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Hook for posting a new comment
 */
export function usePostCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postComment,
    onSuccess: (_data, variables) => {
      // Add the new comment to the cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(variables.videoId),
      })

      // If it's a reply, invalidate the replies cache too
      if (variables.replyToId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.replies(variables.replyToId),
        })
      }
    },
  })
}

/**
 * Hook for liking/unliking a comment
 */
export function useLikeCommentMutation(videoId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: likeComment,
    onMutate: async (commentId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.list(videoId),
      })

      // We need to update the comment in the infinite query data
      // This is a simplified version - in production you'd want to
      // properly update the nested comment data
      return { commentId }
    },
    onSettled: () => {
      // Refetch comments after mutation
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(videoId),
      })
    },
  })
}

/**
 * Hook for deleting a comment
 */
export function useDeleteCommentMutation(videoId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      // Invalidate comments cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(videoId),
      })
    },
  })
}

/**
 * Hook for posting a reply
 */
export function usePostReplyMutation(videoId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { commentId: string; content: string }) =>
      postComment({
        videoId,
        content: input.content,
        replyToId: input.commentId,
      }),
    onSuccess: (_data, variables) => {
      // Invalidate replies cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.replies(variables.commentId),
      })
      // Also invalidate main comments to update reply count
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(videoId),
      })
    },
  })
}

