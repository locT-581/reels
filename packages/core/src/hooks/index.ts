/**
 * @xhub-reel/core - Custom Hooks
 */

// Utility hooks
export { useDebounce } from './useDebounce'
export { useThrottle } from './useThrottle'

// Interaction hooks
export { useLike, type UseLikeOptions, type UseLikeReturn } from './useLike'
export {
  useSave,
  getSavedVideoIds,
  isVideoSaved,
  type UseSaveOptions,
  type UseSaveReturn,
} from './useSave'
export {
  useShare,
  generateShareLink,
  generateDeepLink,
  type ShareData,
  type UseShareOptions,
  type UseShareReturn,
} from './useShare'
export {
  useContentControl,
  isVideoHidden,
  isAuthorHidden,
  getHiddenVideoIds,
  getHiddenAuthorIds,
  clearHiddenContent,
  type ReportReason,
  type ContentControlOptions,
  type ContentControlReturn,
} from './useContentControl'

// Preferences hooks
export {
  usePreferences,
  usePreference,
  useMutedPreference,
  useVolumePreference,
  usePlaybackSpeedPreference,
  useQualityPreference,
  useHapticPreference,
  type UsePreferencesReturn,
  type UsePreferenceReturn,
} from './usePreferences'
