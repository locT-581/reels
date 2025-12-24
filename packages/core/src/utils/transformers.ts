/**
 * API Response Transformers
 *
 * Transform external API responses to VortexStream's internal format.
 * These are pre-built transformers for common API response structures.
 */

import type {
  Video,
  VideoStats,
  Author,
  Comment,
  Reply,
  User,
  ApiReel,
  ApiPaginatedResponse,
  ApiComment,
  ApiOwner,
  VideoListResponse,
  CommentsListResponse,
} from '@vortex/types'

// =============================================================================
// VIDEO/REEL TRANSFORMERS
// =============================================================================

/**
 * Default author when not provided by API
 */
const DEFAULT_AUTHOR: Author = {
  id: 'unknown',
  username: 'unknown',
  displayName: 'Unknown User',
  avatar: '',
  isVerified: false,
  followersCount: 0,
  followingCount: 0,
}

/**
 * Default user when not provided by API
 */
const DEFAULT_USER: User = {
  id: 'unknown',
  username: 'unknown',
  displayName: 'Unknown User',
  avatar: '',
  isVerified: false,
  followersCount: 0,
  followingCount: 0,
}

/**
 * Transform API owner to VortexStream Author
 */
export function transformOwnerToAuthor(owner: ApiOwner | null, fallbackDisplayName?: string): Author {
  if (!owner) {
    return {...DEFAULT_AUTHOR, displayName: `${fallbackDisplayName}`}
  }

  return {
    id: owner.id || 'unknown',
    username: owner.username || 'unknown',
    displayName: owner.display_name || owner.username || `${fallbackDisplayName}` || 'Unknown User',
    avatar: owner.avatar || '',
    isVerified: owner.is_verified || false,
    followersCount: owner.followers_count || 0,
    followingCount: owner.following_count || 0,
  }
}

/**
 * Transform API owner to VortexStream User
 */
export function transformOwnerToUser(owner: ApiOwner | null): User {
  if (!owner) {
    return DEFAULT_USER
  }

  return {
    id: owner.id || 'unknown',
    username: owner.username || 'unknown',
    displayName: owner.display_name || owner.username || 'Unknown User',
    avatar: owner.avatar || '',
    isVerified: owner.is_verified || false,
    followersCount: owner.followers_count || 0,
    followingCount: owner.following_count || 0,
  }
}

/**
 * Transform a single API Reel to VortexStream Video
 */
export function transformReelToVideo(reel: ApiReel): Video {
  // Get the first video media item
  const videoMedia = reel.media?.find((m) => m.type === 'video')

  // Build stats
  const stats: VideoStats = {
    views: reel.views || 0,
    likes: reel.likes || 0,
    comments: reel.total_comments || 0,
    shares: 0, // API doesn't provide shares count
  }

  // Build hashtags from tags (remove # prefix if present)
  // Handle null/undefined tags safely
  const hashtags = (reel.tags || []).map((tag) =>
    tag.startsWith('#') ? tag.slice(1) : tag
  )

  return {
    id: reel.id,
    url: videoMedia?.url || '',
    hlsUrl: videoMedia?.url || '',
    thumbnail: reel.thumbnail?.url || videoMedia?.poster || '',
    blurHash: undefined, // API doesn't provide blurHash
    author: transformOwnerToAuthor(reel.owner, reel.title),
    caption: reel.description || reel.content || '',
    hashtags,
    sound: undefined, // API doesn't provide sound info
    stats,
    metadata: videoMedia
      ? {
          duration: videoMedia.duration || 0,
          width: 0, // API doesn't provide dimensions
          height: 0,
          qualityLevels: [],
          hasAudio: true,
        }
      : undefined,
    createdAt: reel.created_at,
    duration: videoMedia?.duration || 0,
    isLiked: reel.liked || false,
    isSaved: reel.saved || false,
    isPrivate: reel.status !== 'published',
    allowComments: reel.is_allow_comment,
    allowDuet: false,
    allowStitch: false,
  }
}

/**
 * Transform paginated API response to VideoListResponse
 *
 * @example
 * ```typescript
 * const config: VortexConfig = {
 *   baseUrl: 'https://api.example.com',
 *   transformers: {
 *     transformVideoList: transformReelsResponse,
 *   },
 * }
 * ```
 */
export function transformReelsResponse(
  response: unknown
): VideoListResponse {
  const apiResponse = response as ApiPaginatedResponse<ApiReel>

  // Handle error responses
  if (!apiResponse.success || !apiResponse.data) {
    return {
      videos: [],
      hasMore: false,
      nextCursor: undefined,
      total: 0,
    }
  }

  const { data } = apiResponse

  return {
    videos: data.reels.map(transformReelToVideo),
    hasMore: data.has_next,
    nextCursor: data.next_cursor || undefined,
    total: data.total,
  }
}

/**
 * Transform a single reel response to Video
 */
export function transformSingleReelResponse(response: unknown): Video {
  const apiResponse = response as { data: ApiReel; success: boolean }

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error('Invalid API response')
  }

  return transformReelToVideo(apiResponse.data)
}

// =============================================================================
// COMMENT TRANSFORMERS
// =============================================================================

/**
 * Transform API comment to VortexStream Comment
 *
 * @param apiComment - Raw comment from API
 * @param videoId - Video ID that this comment belongs to
 */
export function transformApiComment(
  apiComment: ApiComment,
  videoId?: string
): Comment {
  const author = transformOwnerToUser(apiComment.user || null)

  // Transform replies if present
  const replies: Reply[] = (apiComment.replies || []).map((reply) => ({
    id: reply.id,
    videoId: videoId || reply.reel_id || '',
    author: transformOwnerToUser(reply.user || null),
    content: reply.content,
    createdAt: reply.created_at,
    likesCount: reply.likes || 0,
    isLiked: reply.liked || false,
    repliesCount: 0,
    parentId: reply.parent_id || apiComment.id,
  }))

  return {
    id: apiComment.id,
    videoId: videoId || apiComment.reel_id || '',
    author,
    content: apiComment.content,
    createdAt: apiComment.created_at,
    likesCount: apiComment.likes || 0,
    isLiked: apiComment.liked || false,
    repliesCount: apiComment.replies_count || 0,
    replies,
  }
}

/**
 * Transform paginated comments response to CommentsListResponse
 *
 * @example
 * ```typescript
 * const config: VortexConfig = {
 *   baseUrl: 'https://api.example.com',
 *   transformers: {
 *     transformComments: transformCommentsResponse,
 *   },
 * }
 * ```
 */
export function transformCommentsResponse(
  response: unknown,
  videoId?: string
): CommentsListResponse {
  const apiResponse = response as {
    data: {
      comments: ApiComment[]
      total: number
      has_next: boolean
      next_cursor: string | null
    }
    success: boolean
  }

  if (!apiResponse.success || !apiResponse.data) {
    return {
      comments: [],
      hasMore: false,
      nextCursor: undefined,
      total: 0,
    }
  }

  const { data } = apiResponse

  return {
    comments: data.comments.map((c) => transformApiComment(c, videoId)),
    hasMore: data.has_next,
    nextCursor: data.next_cursor || undefined,
    total: data.total,
  }
}

/**
 * Create a comments transformer with videoId bound
 */
export function createCommentsTransformer(videoId: string) {
  return (response: unknown): CommentsListResponse => {
    return transformCommentsResponse(response, videoId)
  }
}

// =============================================================================
// UTILITY: CREATE CUSTOM TRANSFORMER
// =============================================================================

/**
 * Create a video list transformer with custom field mapping
 *
 * @example
 * ```typescript
 * const myTransformer = createVideoListTransformer({
 *   videosPath: 'data.items',
 *   hasMorePath: 'data.hasMore',
 *   cursorPath: 'data.nextPage',
 *   totalPath: 'data.totalCount',
 * })
 * ```
 */
export function createVideoListTransformer(options: {
  /** Path to videos array in response (e.g., 'data.reels') */
  videosPath: string
  /** Path to hasMore boolean (e.g., 'data.has_next') */
  hasMorePath: string
  /** Path to next cursor (e.g., 'data.next_cursor') */
  cursorPath: string
  /** Path to total count (optional) */
  totalPath?: string
  /** Custom video transformer */
  videoTransformer?: (item: unknown) => Video
}): (response: unknown) => VideoListResponse {
  const {
    videosPath,
    hasMorePath,
    cursorPath,
    totalPath,
    videoTransformer = transformReelToVideo as (item: unknown) => Video,
  } = options

  return (response: unknown): VideoListResponse => {
    const getNestedValue = (obj: unknown, path: string): unknown => {
      return path.split('.').reduce((acc, key) => {
        if (acc && typeof acc === 'object' && key in acc) {
          return (acc as Record<string, unknown>)[key]
        }
        return undefined
      }, obj)
    }

    const videos = getNestedValue(response, videosPath) as unknown[]
    const hasMore = getNestedValue(response, hasMorePath) as boolean
    const cursor = getNestedValue(response, cursorPath) as string | null
    const total = totalPath
      ? (getNestedValue(response, totalPath) as number)
      : undefined

    return {
      videos: (videos || []).map(videoTransformer),
      hasMore: hasMore || false,
      nextCursor: cursor || undefined,
      total,
    }
  }
}

