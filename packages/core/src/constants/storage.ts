/**
 * Storage keys and configuration
 */

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  /** Player preferences (volume, muted, speed, quality) */
  PLAYER_PREFERENCES: 'vortex-player',
  /** User session/auth data */
  USER_DATA: 'vortex-user',
  /** Watch history */
  WATCH_HISTORY: 'vortex-history',
  /** Feed cache */
  FEED_CACHE: 'vortex-feed-cache',
  /** Liked videos (optimistic) */
  LIKED_VIDEOS: 'vortex-liked',
  /** Saved videos */
  SAVED_VIDEOS: 'vortex-saved',
  /** App settings */
  SETTINGS: 'vortex-settings',
  /** Theme preference */
  THEME: 'vortex-theme',
} as const

/**
 * IndexedDB configuration
 */
export const IDB_CONFIG = {
  /** Database name */
  DB_NAME: 'vortex-db',
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

