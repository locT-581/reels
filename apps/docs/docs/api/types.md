---
sidebar_position: 1
---

# Types

TypeScript type definitions cho VortexStream.

## Video

```typescript
interface Video {
  /** Unique video identifier */
  id: string
  
  /** Direct video URL (MP4) */
  url: string
  
  /** HLS manifest URL (recommended) */
  hlsUrl?: string
  
  /** Thumbnail image URL */
  thumbnail: string
  
  /** Blur hash for placeholder */
  blurHash?: string
  
  /** Video author */
  author: Author
  
  /** Video caption/description */
  caption: string
  
  /** Hashtags in caption */
  hashtags?: string[]
  
  /** Video statistics */
  stats: VideoStats
  
  /** Duration in seconds */
  duration: number
  
  /** Music/sound info */
  music?: Music
  
  /** ISO timestamp */
  createdAt: string
  
  /** ISO timestamp */
  updatedAt?: string
  
  /** Privacy setting */
  privacy?: 'public' | 'private' | 'friends'
  
  /** Video is liked by current user */
  isLiked?: boolean
  
  /** Video is saved by current user */
  isSaved?: boolean
}
```

## Author

```typescript
interface Author {
  /** Unique user identifier */
  id: string
  
  /** Unique username */
  username: string
  
  /** Display name */
  displayName: string
  
  /** Avatar URL */
  avatar?: string
  
  /** User is verified */
  verified?: boolean
  
  /** User bio */
  bio?: string
  
  /** Follower count */
  followers?: number
  
  /** Following count */
  following?: number
  
  /** Current user follows this author */
  isFollowing?: boolean
}
```

## VideoStats

```typescript
interface VideoStats {
  /** View count */
  views: number
  
  /** Like count */
  likes: number
  
  /** Comment count */
  comments: number
  
  /** Share count */
  shares: number
  
  /** Save/bookmark count */
  saves?: number
}
```

## Comment

```typescript
interface Comment {
  /** Unique comment identifier */
  id: string
  
  /** Video this comment belongs to */
  videoId: string
  
  /** Comment author */
  author: Author
  
  /** Comment text content */
  content: string
  
  /** Like count */
  likes: number
  
  /** Nested replies */
  replies?: Comment[]
  
  /** Reply count */
  replyCount?: number
  
  /** Parent comment ID (if reply) */
  parentId?: string
  
  /** ISO timestamp */
  createdAt: string
  
  /** Current user liked this comment */
  isLiked?: boolean
}
```

## Music

```typescript
interface Music {
  /** Music track ID */
  id: string
  
  /** Track name */
  name: string
  
  /** Artist name */
  artist: string
  
  /** Album art URL */
  coverUrl?: string
  
  /** Music page URL */
  url?: string
}
```

## Player Types

```typescript
/** Player state machine states */
type PlayerState = 
  | 'idle' 
  | 'loading' 
  | 'ready' 
  | 'playing' 
  | 'paused' 
  | 'buffering' 
  | 'error'

/** Video quality levels */
type Quality = 
  | 'auto' 
  | '1080p' 
  | '720p' 
  | '480p' 
  | '360p'

/** Playback speed options */
type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2

/** Error types */
interface PlayerError {
  code: 'NETWORK_ERROR' | 'MEDIA_ERROR' | 'DECODE_ERROR' | 'NOT_SUPPORTED'
  message: string
  details?: unknown
}
```

## Gesture Types

```typescript
/** Tap zone on video player */
type GestureZone = 'left' | 'center' | 'right'

/** Swipe direction */
type SwipeDirection = 'up' | 'down' | 'left' | 'right'

/** Gesture event */
interface GestureEvent {
  zone: GestureZone
  clientX: number
  clientY: number
  timestamp: number
}
```

## UI Types

```typescript
/** Toast notification */
interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/** Context menu item */
interface ContextMenuItem {
  icon: React.ComponentType
  label: string
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}
```

## Store Types

```typescript
/** Player store state */
interface PlayerStoreState {
  // State
  isPlaying: boolean
  isMuted: boolean
  volume: number
  playbackSpeed: PlaybackSpeed
  quality: Quality
  currentTime: number
  duration: number
  buffered: number
  playerState: PlayerState
  error: PlayerError | null
  
  // Actions
  play: () => void
  pause: () => void
  togglePlay: () => void
  toggleMute: () => void
  setVolume: (volume: number) => void
  setPlaybackSpeed: (speed: PlaybackSpeed) => void
  setQuality: (quality: Quality) => void
  seek: (time: number) => void
  reset: () => void
}

/** Feed store state */
interface FeedStoreState {
  // State
  videos: Video[]
  currentIndex: number
  currentVideo: Video | null
  feedType: 'foryou' | 'following'
  
  // Actions
  setVideos: (videos: Video[]) => void
  addVideos: (videos: Video[]) => void
  setCurrentIndex: (index: number) => void
  goToNext: () => void
  goToPrevious: () => void
  setFeedType: (type: 'foryou' | 'following') => void
}

/** UI store state */
interface UIStoreState {
  // State
  isCommentSheetOpen: boolean
  isShareSheetOpen: boolean
  activeVideoId: string | null
  toast: Toast | null
  
  // Actions
  openCommentSheet: (videoId: string) => void
  closeCommentSheet: () => void
  openShareSheet: (videoId: string) => void
  closeShareSheet: () => void
  showToast: (message: string, type: Toast['type']) => void
  hideToast: () => void
}
```

## Config Types

```typescript
/** Embed configuration */
interface EmbedConfig {
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  showControls?: boolean
  showActions?: boolean
  showOverlay?: boolean
  theme?: 'dark' | 'light'
  accentColor?: string
  preloadCount?: number
  maxVideosInDOM?: number
}

/** HLS configuration */
interface HLSConfig {
  maxBufferLength?: number
  maxMaxBufferLength?: number
  maxBufferSize?: number
  startLevel?: number
  abrEwmaDefaultEstimate?: number
  abrBandWidthUpFactor?: number
  abrBandWidthFactor?: number
  fragLoadingMaxRetry?: number
}

/** Gesture configuration */
interface GestureConfig {
  tap?: {
    doubleTapDelay?: number
    enableHaptic?: boolean
  }
  longPress?: {
    threshold?: number
    cancelOnMove?: boolean
    enableHaptic?: boolean
  }
  swipe?: {
    threshold?: number
    velocity?: number
    lockDirection?: boolean
  }
  seek?: {
    ratio?: number
  }
}
```

## API Response Types

```typescript
/** Paginated response */
interface PaginatedResponse<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
  total?: number
}

/** Video feed response */
interface FeedResponse extends PaginatedResponse<Video> {}

/** Comments response */
interface CommentsResponse extends PaginatedResponse<Comment> {}

/** API error response */
interface APIError {
  code: string
  message: string
  details?: Record<string, unknown>
}
```

## Utility Types

```typescript
/** Make some properties required */
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

/** Video with required HLS URL */
type HLSVideo = WithRequired<Video, 'hlsUrl'>

/** Partial video for updates */
type VideoUpdate = Partial<Pick<Video, 'caption' | 'privacy'>>
```

