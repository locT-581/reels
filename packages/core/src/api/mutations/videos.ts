/**
 * Video Mutations - TanStack Query mutations for video actions
 *
 * Uses XHubReelApiClient from context for configurable endpoints
 */

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useXHubReelApiClient } from '../useXHubReelApiClient'
import { queryKeys } from '../query-client'
import type { Video } from '../../types'
import type { ReportReason } from '../../hooks/useContentControl'

// ============================================
// Types
// ============================================

export interface LikeVideoResponse {
  liked: boolean
  likesCount: number
}

export interface SaveVideoResponse {
  saved: boolean
}

export interface ReportVideoResponse {
  reported: boolean
  reportId: string
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Hook for liking/unliking a video
 *
 * Provides optimistic updates and automatic cache invalidation
 *
 * @example
 * ```tsx
 * function LikeButton({ video }: { video: Video }) {
 *   const { mutate: toggleLike, isPending } = useLikeVideoMutation()
 *
 *   return (
 *     <button
 *       onClick={() => toggleLike(video.id)}
 *       disabled={isPending}
 *     >
 *       {video.isLiked ? '❤️' : '🤍'} {video.stats.likes}
 *     </button>
 *   )
 * }
 * ```
 */
export function useLikeVideoMutation() {
  const apiClient = useXHubReelApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (videoId: string) => {
      await apiClient.likeVideo(videoId)
    },
    onMutate: async (videoId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.videos.detail(videoId) })

      // Snapshot the previous value
      const previousVideo = queryClient.getQueryData<Video>(
        queryKeys.videos.detail(videoId)
      )

      // Optimistically update
      if (previousVideo) {
        const isLiked = !previousVideo.isLiked
        queryClient.setQueryData<Video>(queryKeys.videos.detail(videoId), {
          ...previousVideo,
          isLiked,
          stats: {
            ...previousVideo.stats,
            likes: previousVideo.stats.likes + (isLiked ? 1 : -1),
          },
        })
      }

      return { previousVideo }
    },
    onError: (_err, videoId, context) => {
      // Rollback on error
      if (context?.previousVideo) {
        queryClient.setQueryData(
          queryKeys.videos.detail(videoId),
          context.previousVideo
        )
      }
    },
    onSettled: (_data, _error, videoId) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.detail(videoId) })
    },
  })
}

/**
 * Hook for saving/unsaving a video
 *
 * @example
 * ```tsx
 * function SaveButton({ video }: { video: Video }) {
 *   const { mutate: toggleSave } = useSaveVideoMutation()
 *
 *   return (
 *     <button onClick={() => toggleSave(video.id)}>
 *       {video.isSaved ? '🔖' : '📌'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useSaveVideoMutation() {
  const apiClient = useXHubReelApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (videoId: string) => {
      await apiClient.saveVideo(videoId)
    },
    onMutate: async (videoId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.videos.detail(videoId) })

      const previousVideo = queryClient.getQueryData<Video>(
        queryKeys.videos.detail(videoId)
      )

      if (previousVideo) {
        queryClient.setQueryData<Video>(queryKeys.videos.detail(videoId), {
          ...previousVideo,
          isSaved: !previousVideo.isSaved,
        })
      }

      return { previousVideo }
    },
    onError: (_err, videoId, context) => {
      if (context?.previousVideo) {
        queryClient.setQueryData(
          queryKeys.videos.detail(videoId),
          context.previousVideo
        )
      }
    },
    onSettled: (_data, _error, videoId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.detail(videoId) })
    },
  })
}

/**
 * Hook for reporting a video
 *
 * @example
 * ```tsx
 * function ReportButton({ videoId }: { videoId: string }) {
 *   const { mutate: report, isPending } = useReportVideoMutation()
 *
 *   const handleReport = (reason: ReportReason) => {
 *     report({ videoId, reason, details: 'Additional info' })
 *   }
 *
 *   return <ReportDialog onSubmit={handleReport} disabled={isPending} />
 * }
 * ```
 */
export function useReportVideoMutation() {
  const apiClient = useXHubReelApiClient()

  return useMutation({
    mutationFn: async ({
      videoId,
      reason,
      details,
    }: {
      videoId: string
      reason: ReportReason
      details?: string
    }) => {
      await apiClient.reportVideo(videoId, reason, details)
    },
  })
}

/**
 * Hook for marking video as not interested
 *
 * @example
 * ```tsx
 * function NotInterestedButton({ videoId }: { videoId: string }) {
 *   const { mutate: markNotInterested } = useNotInterestedMutation()
 *
 *   return (
 *     <button onClick={() => markNotInterested(videoId)}>
 *       Not interested
 *     </button>
 *   )
 * }
 * ```
 */
export function useNotInterestedMutation() {
  const apiClient = useXHubReelApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (videoId: string) => {
      await apiClient.markNotInterested(videoId)
    },
    onSuccess: () => {
      // Invalidate feed queries to remove the video
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.lists() })
    },
  })
}

/**
 * Hook for sharing a video (tracks share count)
 *
 * @example
 * ```tsx
 * function ShareButton({ videoId }: { videoId: string }) {
 *   const { mutate: trackShare } = useShareVideoMutation()
 *
 *   const handleShare = async (platform: string) => {
 *     await navigator.share({ url: `...` })
 *     trackShare({ videoId, platform })
 *   }
 *
 *   return <button onClick={() => handleShare('copy')}>Share</button>
 * }
 * ```
 */
export function useShareVideoMutation() {
  const apiClient = useXHubReelApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      videoId,
      platform,
    }: {
      videoId: string
      platform?: string
    }) => {
      await apiClient.shareVideo(videoId, platform)
    },
    onSuccess: (_data, { videoId }) => {
      // Optionally update share count in cache
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.detail(videoId) })
    },
  })
}
