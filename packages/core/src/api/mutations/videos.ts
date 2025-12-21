/**
 * Video Mutations - TanStack Query mutations for video actions
 */

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api-client'
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
// Mutation Functions
// ============================================

/**
 * Like/Unlike a video
 */
async function likeVideo(videoId: string): Promise<LikeVideoResponse> {
  return apiClient.post<LikeVideoResponse>(`/videos/${videoId}/like`)
}

/**
 * Save/Unsave a video
 */
async function saveVideo(videoId: string): Promise<SaveVideoResponse> {
  return apiClient.post<SaveVideoResponse>(`/videos/${videoId}/save`)
}

/**
 * Report a video
 */
async function reportVideo(
  videoId: string,
  reason: ReportReason,
  details?: string
): Promise<ReportVideoResponse> {
  return apiClient.post<ReportVideoResponse>(`/videos/${videoId}/report`, {
    reason,
    details,
  })
}

/**
 * Mark video as not interested
 */
async function markNotInterested(videoId: string): Promise<void> {
  return apiClient.post(`/videos/${videoId}/not-interested`)
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Hook for liking/unliking a video
 */
export function useLikeVideoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: likeVideo,
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
 */
export function useSaveVideoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveVideo,
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
 */
export function useReportVideoMutation() {
  return useMutation({
    mutationFn: ({ videoId, reason, details }: {
      videoId: string
      reason: ReportReason
      details?: string
    }) => reportVideo(videoId, reason, details),
  })
}

/**
 * Hook for marking video as not interested
 */
export function useNotInterestedMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markNotInterested,
    onSuccess: () => {
      // Invalidate feed queries to remove the video
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.lists() })
    },
  })
}

