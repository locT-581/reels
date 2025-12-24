/**
 * Formatting utilities for XHubReel
 */

/**
 * Format a number to a human-readable count (1.2K, 3.5M, etc.)
 */
export function formatCount(count: number): string {
  if (count < 1000) {
    return count.toString()
  }

  if (count < 10000) {
    return `${(count / 1000).toFixed(1)}K`
  }

  if (count < 1000000) {
    return `${Math.floor(count / 1000)}K`
  }

  return `${(count / 1000000).toFixed(1)}M`
}

/**
 * Format duration in seconds to mm:ss or hh:mm:ss
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format a timestamp to relative time (2h ago, 3d ago, etc.)
 */
export function formatTimestamp(timestamp: string | Date): string {
  const now = new Date()
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSeconds < 60) {
    return 'Vừa xong'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} phút`
  }

  if (diffHours < 24) {
    return `${diffHours}h`
  }

  if (diffDays < 7) {
    return `${diffDays}d`
  }

  if (diffWeeks < 4) {
    return `${diffWeeks}w`
  }

  if (diffMonths < 12) {
    return `${diffMonths} tháng`
  }

  return `${diffYears} năm`
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength - 3)}...`
}

/**
 * Extract hashtags from text
 */
export function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w\u00C0-\u024F]+/g)
  return matches ? matches.map((tag) => tag.slice(1)) : []
}

