/**
 * @vortex/player-core
 * Core video playback engine for VortexStream
 * No UI dependency - pure playback logic
 */

// Core engine
export { HLSEngine, type HLSEngineOptions, type HLSEngineCallbacks } from './core/hls-engine'
export { NativeHLS, type NativeHLSOptions, type NativeHLSCallbacks } from './core/native-hls'
export {
  PlayerCore,
  type PlayerCoreOptions,
  type PlayerCoreCallbacks,
} from './core/player-core'

// State management
export {
  PlayerStateMachine,
  createPlayerStateMachine,
  STATE_TRANSITIONS,
  type StateTransition,
} from './state/player-state-machine'

export {
  usePlayerState,
  useExternalPlayerState,
  type UsePlayerStateReturn,
} from './state/use-player-state'

// Services
export {
  // Network
  NetworkDetector,
  createNetworkDetector,
  type NetworkInfo,
  type EffectiveType,
  type ConnectionType,
  type NetworkDetectorCallbacks,
  // Power
  PowerManager,
  createPowerManager,
  type PowerInfo,
  type PowerManagerCallbacks,
  // Preload
  PreloadManager,
  createPreloadManager,
  type PreloadItem,
  type PreloadType,
  type PreloadStatus,
  type PreloadManagerOptions,
  type PreloadManagerCallbacks,
  // Analytics
  AnalyticsCollector,
  createAnalyticsCollector,
  type PlaybackMetrics,
  type QualitySwitch,
  type BufferingEvent,
  type PlaybackError,
  type SeekEvent,
  type AnalyticsCollectorCallbacks,
} from './services'

// Hooks
export {
  // Playback
  usePlayback,
  type UsePlaybackReturn,
  useVolume,
  type UseVolumeReturn,
  useProgress,
  type UseProgressOptions,
  type UseProgressReturn,
  useQuality,
  type UseQualityReturn,
  useBuffering,
  type UseBufferingReturn,
  // Service hooks
  useAnalytics,
  type UseAnalyticsOptions,
  type UseAnalyticsReturn,
  useNetwork,
  type UseNetworkReturn,
  usePreload,
  type UsePreloadOptions,
  type UsePreloadReturn,
} from './hooks'

// Utils
export { safePlay, type SafePlayOptions } from './utils/safePlay'

// Shared types
export type { PlayResult } from './types/playback'
