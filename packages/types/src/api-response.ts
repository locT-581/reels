/**
 * External API Response Types
 *
 * These types represent common external API response structures
 * that can be transformed to XHubReel's internal format.
 */

// =============================================================================
// COMMON API STRUCTURES
// =============================================================================

/**
 * Media item from API
 */
export interface ApiMediaItem {
  id?: string
  type: 'video' | 'image' | 'audio'
  url: string
  poster?: string
  duration?: number | null
  width?: number
  height?: number
  /** Download URL for the media file */
  download_url?: string
}

/**
 * Thumbnail from API
 */
export interface ApiThumbnail {
  /** Type of thumbnail (image or video) */
  type?: 'image' | 'video'
  url: string
  width?: number
  height?: number
  /** Duration (null for images) */
  duration?: number | null
  /** Poster URL */
  poster?: string
  /** Download URL */
  download_url?: string
}

/**
 * Owner/User from API
 */
export interface ApiOwner {
  id: string
  username: string
  display_name?: string
  avatar?: string
  is_verified?: boolean
  followers_count?: number
  following_count?: number
}

// =============================================================================
// REEL/VIDEO API RESPONSE
// =============================================================================

/**
 * Reel item from API
 */
export interface ApiReel {
  id: string
  title?: string
  /** Reel type (reel, video, etc.) */
  type?: 'reel' | 'video' | string
  description?: string
  content?: string
  /** Owner ID reference */
  owner_id?: string
  media: ApiMediaItem[]
  thumbnail?: ApiThumbnail
  owner: ApiOwner | null
  tags: string[]
  views?: number
  likes?: number
  /** Dislikes count */
  dislikes?: number
  total_comments?: number
  /** Unread comments count */
  total_unread_comments?: number
  /** Oldest unread comment position */
  oldest_unread_comment?: number
  liked?: boolean
  saved?: boolean
  status?: 'published' | 'draft' | 'private'
  /** Approval status */
  approving_status?: 'approved' | 'pending' | 'rejected' | string
  /** Participants (for collaborative content) */
  participants?: unknown
  is_allow_comment: boolean
  created_at: string
  updated_at?: string
  /** User who last updated */
  updated_by?: string | null
  /** Scheduled publish time */
  scheduled_at?: string | null
  /** Notification status */
  notification_status?: 'sent' | 'pending' | 'failed' | string
}

// =============================================================================
// PAGINATED RESPONSE
// =============================================================================

/**
 * Generic paginated response wrapper
 *
 * Matches BE response structure:
 * { code: 200, timestamp: ..., message: "Success", data: { reels: [...] }, success: true }
 */
export interface ApiPaginatedResponse<T> {
  /** HTTP status code */
  code?: number
  /** Server timestamp */
  timestamp?: number
  /** Response message */
  message?: string
  /** Success flag */
  success: boolean
  /** Response data */
  data: {
    reels: T[]
    total: number
    /** Number of items in current page */
    number_of_items?: number
    has_next: boolean
    next_cursor: string | null
  }
}

/**
 * Generic single item response wrapper
 */
export interface ApiSingleResponse<T> {
  success: boolean
  data: T
  message?: string
}

/**
 * External API error response (different from internal XHubReelError)
 */
export interface ExternalApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

// =============================================================================
// COMMENT API RESPONSE
// =============================================================================

/**
 * Comment from API
 */
export interface ApiComment {
  id: string
  reel_id?: string
  user: ApiOwner | null
  content: string
  likes?: number
  liked?: boolean
  replies_count?: number
  replies?: ApiReply[]
  parent_id?: string
  created_at: string
  updated_at?: string
}

/**
 * Reply from API
 */
export interface ApiReply {
  id: string
  reel_id?: string
  user: ApiOwner | null
  content: string
  likes?: number
  liked?: boolean
  parent_id?: string
  created_at: string
  updated_at?: string
}

/**
 * Comments paginated response
 */
export interface ApiCommentsResponse {
  success: boolean
  data: {
    comments: ApiComment[]
    total: number
    has_next: boolean
    next_cursor: string | null
  }
}

