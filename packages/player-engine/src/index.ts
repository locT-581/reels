/**
 * @vortex/player-engine
 * Pure Vanilla TypeScript video player engine
 * No React dependency - can be used in any framework
 */

// Core engines
export { HLSEngine, type HLSEngineOptions, type HLSEngineCallbacks } from './core/hls-engine'
export { NativeHLS, type NativeHLSOptions, type NativeHLSCallbacks } from './core/native-hls'
export {
  PlayerCore,
  type PlayerCoreOptions,
  type PlayerCoreCallbacks,
} from './core/player-core'

// State machine
export {
  PlayerStateMachine,
  createPlayerStateMachine,
  STATE_TRANSITIONS,
  type StateTransition,
} from './state/player-state-machine'

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

// Utils
export { safePlay, type SafePlayOptions } from './utils/safePlay'

// Types
export type { PlayResult } from './types/playback'

// Config
export { HLS_CONFIG, PLAYBACK_SPEEDS, QUALITY_BITRATES } from './config'

