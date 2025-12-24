/**
 * Comment Mutations - TanStack Query mutations for comment actions
 *
 * Uses XHubReelApiClient from context for configurable endpoints
 */

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useXHubReelApiClient } from '../useXHubReelApiClient'
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
// Mutation Hooks
// ============================================

/**
 * Hook for posting a new comment
 *
 * @example
 * ```tsx
 * function CommentForm({ videoId }: { videoId: string }) {
 *   const { mutate: postComment, isPending } = usePostCommentMutation()
 *   const [content, setContent] = useState('')
 *
 *   const handleSubmit = () => {
 *     postComment({ videoId, content }, {
 *       onSuccess: () => setContent('')
 *     })
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input value={content} onChange={e => setContent(e.target.value)} />
 *       <button disabled={isPending}>Post</button>
 *     </form>
 *   )
 * }
 * ```
 */
export function usePostCommentMutation() {
  const apiClient = useXHubReelApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: PostCommentInput) => {
      return apiClient.postComment(input.videoId, input.content, input.replyToId)
    },
    onSuccess: (_, variables) => {
      // Invalidate comments list to show new comment
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
 *
 * @example
 * ```tsx
 * function CommentLikeButton({ comment, videoId }: { comment: Comment; videoId: string }) {
 *   const { mutate: toggleLike } = useLikeCommentMutation(videoId)
 *
 *   return (
 *     <button onClick={() => toggleLike(comment.id)}>
 *       {comment.isLiked ? '❤️' : '🤍'} {comment.likesCount}
 *     </button>
 *   )
 * }
 * ```
 */
export function useLikeCommentMutation(videoId: string) {
  const apiClient = useXHubReelApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (commentId: string) => {
      await apiClient.likeComment(commentId)
    },
    onMutate: async (commentId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.list(videoId),
      })

      // We could update the comment optimistically here
      // but it's complex with paginated data
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
 *
 * @example
 * ```tsx
 * function DeleteCommentButton({ commentId, videoId }: { commentId: string; videoId: string }) {
 *   const { mutate: deleteComment, isPending } = useDeleteCommentMutation(videoId)
 *
 *   return (
 *     <button
 *       onClick={() => deleteComment(commentId)}
 *       disabled={isPending}
 *     >
 *       Delete
 *     </button>
 *   )
 * }
 * ```
 */
export function useDeleteCommentMutation(videoId: string) {
  const apiClient = useXHubReelApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (commentId: string) => {
      await apiClient.delete(`/comments/${commentId}`)
    },
    onSuccess: () => {
      // Invalidate comments cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(videoId),
      })
    },
  })
}

/**
 * Hook for posting a reply to a comment
 *
 * @example
 * ```tsx
 * function ReplyForm({ commentId, videoId }: { commentId: string; videoId: string }) {
 *   const { mutate: postReply, isPending } = usePostReplyMutation(videoId)
 *   const [content, setContent] = useState('')
 *
 *   const handleSubmit = () => {
 *     postReply({ commentId, content }, {
 *       onSuccess: () => setContent('')
 *     })
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input value={content} onChange={e => setContent(e.target.value)} />
 *       <button disabled={isPending}>Reply</button>
 *     </form>
 *   )
 * }
 * ```
 */
export function usePostReplyMutation(videoId: string) {
  const apiClient = useXHubReelApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { commentId: string; content: string }) => {
      return apiClient.postComment(videoId, input.content, input.commentId)
    },
    onSuccess: (_, variables) => {
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
