/**
 * Video-related type definitions
 */

import type { Author } from './user'

/**
 * Sound/Music attached to a video
 */
export interface Sound {
  id: string
  title: string
  artist: string
  coverUrl?: string
  duration: number
}

/**
 * Video statistics
 */
export interface VideoStats {
  views: number
  likes: number
  comments: number
  shares: number
}

/**
 * Video quality level
 */
export interface QualityLevel {
  label: string
  height: number
  bitrate: number
}

/**
 * Video metadata
 */
export interface VideoMetadata {
  duration: number
  width: number
  height: number
  qualityLevels: QualityLevel[]
  hasAudio: boolean
  fps?: number
  codec?: string
}

/**
 * Main Video interface
 */
export interface Video {
  id: string
  url: string
  hlsUrl?: string
  thumbnail: string
  blurHash?: string
  author: Author
  caption: string
  hashtags: string[]
  sound?: Sound
  stats: VideoStats
  metadata?: VideoMetadata
  createdAt: string
  duration: number
  isLiked?: boolean
  isSaved?: boolean
  isPrivate?: boolean
  allowComments?: boolean
  allowDuet?: boolean
  allowStitch?: boolean
}

/**
 * Video aspect ratio
 */
export type VideoAspectRatio = '9:16' | '16:9' | '1:1' | '4:5'

/**
 * Video source type
 */
export type VideoSourceType = 'hls' | 'mp4' | 'webm'

