/**
 * Storage keys and configuration
 */

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  /** Player preferences (volume, muted, speed, quality) */
  PLAYER_PREFERENCES: 'xhub-reel-player',
  /** User session/auth data */
  USER_DATA: 'xhub-reel-user',
  /** Watch history */
  WATCH_HISTORY: 'xhub-reel-history',
  /** Feed cache */
  FEED_CACHE: 'xhub-reel-feed-cache',
  /** Liked videos (optimistic) */
  LIKED_VIDEOS: 'xhub-reel-liked',
  /** Saved videos */
  SAVED_VIDEOS: 'xhub-reel-saved',
  /** App settings */
  SETTINGS: 'xhub-reel-settings',
  /** Theme preference */
  THEME: 'xhub-reel-theme',
} as const

/**
 * IndexedDB configuration
 */
export const IDB_CONFIG = {
  /** Database name */
  DB_NAME: 'xhub-reel-db',
  /** Database version */
  DB_VERSION: 1,
  /** Object stores */
  STORES: {
    VIDEOS: 'videos',
    SEGMENTS: 'segments',
    HISTORY: 'history',
    CACHE: 'cache',
  },
} as const

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  /** Max videos in memory cache */
  MAX_MEMORY_VIDEOS: 10,
  /** Max videos in IndexedDB */
  MAX_IDB_VIDEOS: 100,
  /** Max HLS segments to cache */
  MAX_SEGMENTS: 50,
  /** Cache expiry time (ms) */
  EXPIRY_TIME: 24 * 60 * 60 * 1000, // 24 hours
} as const

