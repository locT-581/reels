/**
 * Configuration types for XHubReel API integration
 */

import type { Video } from './video'
import type { Comment } from './comment'

// =============================================================================
// API ENDPOINTS CONFIGURATION
// =============================================================================

/**
 * Configurable API endpoints
 * Use placeholders like :id, :videoId, :commentId for dynamic values
 */
export interface XHubReelApiEndpoints {
  /** GET videos list */
  videos: string
  /** GET single video */
  videoDetail: string
  /** GET video metadata */
  videoMetadata: string
  /** POST like video */
  likeVideo: string
  /** DELETE unlike video */
  unlikeVideo: string
  /** POST save/bookmark video */
  saveVideo: string
  /** DELETE unsave video */
  unsaveVideo: string
  /** POST share video */
  shareVideo: string
  /** GET comments for video */
  comments: string
  /** POST comment */
  postComment: string
  /** POST like comment */
  likeComment: string
  /** POST report video */
  reportVideo: string
  /** POST not interested */
  notInterested: string
}

/**
 * Default API endpoints
 */
export const DEFAULT_API_ENDPOINTS: XHubReelApiEndpoints = {
  videos: '/videos',
  videoDetail: '/videos/:id',
  videoMetadata: '/videos/:id/metadata',
  likeVideo: '/videos/:id/like',
  unlikeVideo: '/videos/:id/like',
  saveVideo: '/videos/:id/save',
  unsaveVideo: '/videos/:id/save',
  shareVideo: '/videos/:id/share',
  comments: '/videos/:videoId/comments',
  postComment: '/videos/:videoId/comments',
  likeComment: '/comments/:commentId/like',
  reportVideo: '/videos/:id/report',
  notInterested: '/videos/:id/not-interested',
}

// =============================================================================
// AUTHENTICATION
// =============================================================================

/**
 * Token refresh result
 */
export interface TokenRefreshResult {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
}

/**
 * Authentication configuration
 */
export interface XHubReelAuthConfig {
  /** Access token */
  accessToken?: string
  /** Refresh token (optional) */
  refreshToken?: string
  /** Token type (default: 'Bearer') */
  tokenType?: 'Bearer' | 'Basic' | string
  /** Custom header name (default: 'Authorization') */
  headerName?: string
  /** Callback when token expires - return new tokens or null to logout */
  onTokenExpired?: () => Promise<TokenRefreshResult | null>
  /** Callback on auth error */
  onAuthError?: (error: Error) => void
  /** Custom function to check if response indicates token expired */
  isTokenExpired?: (response: Response, body?: unknown) => boolean
}

// =============================================================================
// RESPONSE TRANSFORMERS
// =============================================================================

/**
 * Video list response structure
 */
export interface VideoListResponse {
  videos: Video[]
  hasMore: boolean
  cursor?: string
  nextCursor?: string
  total?: number
}

/**
 * Single video response
 */
export interface VideoDetailResponse {
  video: Video
}

/**
 * Comments list response
 */
export interface CommentsListResponse {
  comments: Comment[]
  hasMore: boolean
  cursor?: string
  nextCursor?: string
  total?: number
}

/**
 * Replies list response
 */
export interface RepliesListResponse {
  replies: Comment[]
  hasMore: boolean
  cursor?: string
  nextCursor?: string
}

/**
 * Response transformer functions
 * Use these to transform your API response format to XHubReel format
 */
export interface XHubReelResponseTransformers {
  /** Transform video list response */
  transformVideoList?: (response: unknown) => VideoListResponse
  /** Transform single video response */
  transformVideo?: (response: unknown) => Video
  /** Transform comments response */
  transformComments?: (response: unknown) => CommentsListResponse
}

// =============================================================================
// INTERCEPTORS
// =============================================================================

/**
 * Request interceptor
 */
export type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>

/**
 * Response interceptor
 */
export type ResponseInterceptor = (response: Response, body: unknown) => void | Promise<void>

/**
 * Error interceptor
 */
export type ErrorInterceptor = (error: Error) => Error | null | Promise<Error | null>

/**
 * Request/Response interceptors
 */
export interface XHubReelInterceptors {
  /** Called before each request */
  onRequest?: RequestInterceptor
  /** Called after each successful response */
  onResponse?: ResponseInterceptor
  /** Called on request error - return null to suppress error */
  onError?: ErrorInterceptor
}

// =============================================================================
// VIDEO FETCH PARAMS
// =============================================================================

/**
 * Parameters for fetching videos
 */
export interface VideoFetchParams {
  /** Number of videos to fetch */
  limit?: number
  /** Cursor for pagination */
  cursor?: string
  /** Category/feed type */
  category?: string
  /** User ID for profile videos */
  userId?: string
  /** Hashtag filter */
  hashtag?: string
  /** Sound ID filter */
  soundId?: string
  /** Search query */
  query?: string
  /** Sort by */
  sortBy?: 'recent' | 'popular' | 'trending'
}

// =============================================================================
// MAIN CONFIG
// =============================================================================

/**
 * Main XHubReel configuration
 */
export interface XHubReelConfig {
  /** Base URL for API requests */
  baseUrl: string
  /** Authentication configuration */
  auth?: XHubReelAuthConfig
  /** API key to include in all requests as query param (?api_key=xxx) */
  apiKey?: string
  /** Custom API endpoints */
  endpoints?: Partial<XHubReelApiEndpoints>
  /** Response transformers */
  transformers?: XHubReelResponseTransformers
  /** Request/Response interceptors */
  interceptors?: XHubReelInterceptors
  /** Default fetch params */
  defaultFetchParams?: VideoFetchParams
  /** Custom headers to include in all requests */
  headers?: Record<string, string>
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number
  /** Enable debug logging */
  debug?: boolean
}

// =============================================================================
// PROVIDER TYPES
// =============================================================================

/**
 * XHubReelProvider props
 */
export interface XHubReelProviderProps {
  /** API configuration (optional - omit for manual mode) */
  config?: XHubReelConfig
  /** Children */
  children: React.ReactNode
}

/**
 * XHubReelContext value
 */
export interface XHubReelContextValue {
  /** Current configuration */
  config: XHubReelConfig | null
  /** Whether API mode is enabled */
  isApiMode: boolean
  /** Update configuration */
  updateConfig: (newConfig: Partial<XHubReelConfig>) => void
  /** Update access token */
  setAccessToken: (token: string | undefined) => void
}
