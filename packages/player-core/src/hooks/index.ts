/**
 * @vortex/player-core - Hooks
 */

// Playback control hooks
export { usePlayback, type UsePlaybackReturn } from './usePlayback'
export { useVolume, type UseVolumeReturn } from './useVolume'
export {
  useProgress,
  type UseProgressOptions,
  type UseProgressReturn,
} from './useProgress'
export { useQuality, type UseQualityReturn } from './useQuality'
export { useBuffering, type UseBufferingReturn } from './useBuffering'

// Service-related hooks
export {
  useAnalytics,
  type UseAnalyticsOptions,
  type UseAnalyticsReturn,
} from './useAnalytics'

export {
  useNetwork,
  type UseNetworkReturn,
} from './useNetwork'

export {
  usePreload,
  type UsePreloadOptions,
  type UsePreloadReturn,
} from './usePreload'

// Headless engine hook
export {
  useVideoEngine,
  type UseVideoEngineOptions,
  type UseVideoEngineReturn,
} from './useVideoEngine'

