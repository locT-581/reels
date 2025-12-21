/**
 * Feed-related type definitions
 */

import type { Video } from './video'

/**
 * Feed types available in the app
 */
export type FeedType = 'foryou' | 'following' | 'trending' | 'live'

/**
 * Feed response from API
 */
export interface FeedResponse {
  videos: Video[]
  nextCursor?: string
  nextPage?: number
  hasMore: boolean
}

/**
 * Feed request parameters
 */
export interface FeedRequest {
  type: FeedType
  cursor?: string
  limit?: number
  userId?: string
}

/**
 * Video activation state in feed
 */
export interface VideoActivation {
  videoId: string
  isActive: boolean
  visibility: number // 0-1 viewport visibility
  timestamp: number
}

/**
 * Feed scroll state
 */
export interface FeedScrollState {
  currentIndex: number
  scrollPosition: number
  scrollVelocity: number
  isScrolling: boolean
  direction: 'up' | 'down' | 'none'
}

/**
 * Feed preload configuration
 */
export interface FeedPreloadConfig {
  preloadAhead: number // Videos to preload ahead
  preloadBehind: number // Videos to keep behind
  maxVideosInDom: number
  maxDecodedFrames: number
}

