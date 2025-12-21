/**
 * @vortex/core - Storage Layer
 */

// Database
export { getDB, closeDB, deleteDB, getStorageUsage, type VortexDBSchema } from './db'

// Video Cache
export {
  cacheVideo,
  cacheVideos,
  getCachedVideo,
  getCachedVideos,
  isVideoCached,
  deleteCachedVideo,
  clearExpiredCache,
  clearOldCache,
  getCacheStats,
} from './video-cache'

// Watch History
export {
  saveWatchProgress,
  getWatchProgress,
  getWatchHistory,
  getRecentlyWatched,
  getCompletedVideos,
  deleteWatchProgress,
  clearWatchHistory,
  clearOldWatchHistory,
  getWatchStats,
  type WatchProgress,
} from './watch-history'

// Preferences
export {
  getPreference,
  setPreference,
  getAllPreferences,
  setPreferences,
  resetPreference,
  resetAllPreferences,
  subscribeToPreferenceChanges,
  PREFERENCE_KEYS,
  type PreferenceKey,
  type UserPreferences,
} from './preferences'

// Cache Manager
export {
  CacheManager,
  createCacheManager,
  type CacheConfig,
  type CacheEntry,
  type CacheStats,
} from './cache-manager'

