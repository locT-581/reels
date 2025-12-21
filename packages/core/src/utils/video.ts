/**
 * Video utility functions
 */

import type { VideoAspectRatio, QualityLevel } from '../types'
import { QUALITY_BITRATES } from '../constants'

/**
 * Calculate video aspect ratio from dimensions
 */
export function getVideoAspectRatio(width: number, height: number): VideoAspectRatio {
  const ratio = width / height

  if (ratio < 0.6) return '9:16' // Portrait (TikTok style)
  if (ratio > 1.5) return '16:9' // Landscape
  if (ratio > 0.95 && ratio < 1.05) return '1:1' // Square
  return '4:5' // Instagram-like
}

/**
 * Calculate buffer progress as percentage
 */
export function calculateBufferProgress(
  buffered: TimeRanges,
  currentTime: number,
  duration: number
): number {
  if (!buffered.length || duration === 0) return 0

  // Find the buffered range that contains current time
  for (let i = 0; i < buffered.length; i++) {
    const start = buffered.start(i)
    const end = buffered.end(i)

    if (currentTime >= start && currentTime <= end) {
      return ((end - currentTime) / duration) * 100
    }
  }

  return 0
}

/**
 * Get all buffered ranges as array
 */
export function getBufferedRanges(
  buffered: TimeRanges
): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = []

  for (let i = 0; i < buffered.length; i++) {
    ranges.push({
      start: buffered.start(i),
      end: buffered.end(i),
    })
  }

  return ranges
}

/**
 * Get quality label from height
 */
export function getQualityLabel(height: number): string {
  if (height >= 1080) return '1080p'
  if (height >= 720) return '720p'
  if (height >= 480) return '480p'
  if (height >= 360) return '360p'
  return '240p'
}

/**
 * Get quality level from bitrate
 */
export function getQualityFromBitrate(bitrate: number): string {
  const entries = Object.entries(QUALITY_BITRATES) as Array<[string, number]>

  for (const [quality, threshold] of entries) {
    if (bitrate >= threshold * 0.8) {
      return quality
    }
  }

  return '240p'
}

/**
 * Select best quality for network conditions
 */
export function selectOptimalQuality(
  availableLevels: QualityLevel[],
  bandwidth: number,
  preferredQuality?: string
): number {
  if (availableLevels.length === 0) return -1

  // If preferred quality is specified, try to find it
  if (preferredQuality && preferredQuality !== 'auto') {
    const targetHeight = parseInt(preferredQuality.replace('p', ''))
    const index = availableLevels.findIndex((l) => l.height === targetHeight)
    if (index !== -1) return index
  }

  // Auto: Select based on bandwidth (with 20% margin)
  const safeBandwidth = bandwidth * 0.8

  for (let i = availableLevels.length - 1; i >= 0; i--) {
    const level = availableLevels[i]
    if (level && level.bitrate <= safeBandwidth) {
      return i
    }
  }

  // Fallback to lowest quality
  return 0
}

/**
 * Calculate time to buffer (seconds until buffer runs out)
 */
export function calculateTimeToBuffer(
  buffered: TimeRanges,
  currentTime: number,
  playbackRate: number = 1
): number {
  if (!buffered.length) return 0

  for (let i = 0; i < buffered.length; i++) {
    const start = buffered.start(i)
    const end = buffered.end(i)

    if (currentTime >= start && currentTime <= end) {
      return (end - currentTime) / playbackRate
    }
  }

  return 0
}

/**
 * Check if video should start buffering more
 */
export function shouldPreload(
  buffered: TimeRanges,
  currentTime: number,
  threshold: number = 5 // seconds
): boolean {
  const timeToBuffer = calculateTimeToBuffer(buffered, currentTime)
  return timeToBuffer < threshold
}

/**
 * Generate video thumbnail URL with timestamp
 */
export function generateThumbnailUrl(
  videoUrl: string,
  timestamp: number,
  width: number = 160
): string {
  // This would typically call a thumbnail generation service
  // For now, return a placeholder implementation
  const baseUrl = videoUrl.replace(/\.(mp4|m3u8|webm).*$/, '')
  return `${baseUrl}/thumbnail?t=${timestamp}&w=${width}`
}

/**
 * Parse HLS master playlist to get available qualities
 */
export function parseHLSQualities(masterPlaylist: string): QualityLevel[] {
  const qualities: QualityLevel[] = []
  const lines = masterPlaylist.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line?.startsWith('#EXT-X-STREAM-INF:')) {
      const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/)
      const resolutionMatch = line.match(/RESOLUTION=\d+x(\d+)/)

      if (bandwidthMatch && resolutionMatch) {
        const bitrate = parseInt(bandwidthMatch[1] ?? '0')
        const height = parseInt(resolutionMatch[1] ?? '0')

        qualities.push({
          label: getQualityLabel(height),
          height,
          bitrate,
        })
      }
    }
  }

  // Sort by bitrate descending (highest first)
  return qualities.sort((a, b) => b.bitrate - a.bitrate)
}

