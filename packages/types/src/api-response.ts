/**
 * External API Response Types
 *
 * These types represent common external API response structures
 * that can be transformed to VortexStream's internal format.
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
  duration?: number
  width?: number
  height?: number
}

/**
 * Thumbnail from API
 */
export interface ApiThumbnail {
  url: string
  width?: number
  height?: number
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
  description?: string
  content?: string
  media: ApiMediaItem[]
  thumbnail?: ApiThumbnail
  owner: ApiOwner | null
  tags: string[]
  views?: number
  likes?: number
  total_comments?: number
  liked?: boolean
  saved?: boolean
  status?: 'published' | 'draft' | 'private'
  is_allow_comment: boolean
  created_at: string
  updated_at?: string
}

// =============================================================================
// PAGINATED RESPONSE
// =============================================================================

/**
 * Generic paginated response wrapper
 */
export interface ApiPaginatedResponse<T> {
  success: boolean
  data: {
    reels: T[]
    total: number
    has_next: boolean
    next_cursor: string | null
  }
  message?: string
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
 * External API error response (different from internal VortexError)
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

