/**
 * Player Core Services
 * Re-exported from @vortex/player-engine for convenience
 */

export {
  // Network Detector
  type EffectiveType,
  type ConnectionType,
  type NetworkInfo,
  type NetworkDetectorCallbacks,
  NetworkDetector,
  createNetworkDetector,

  // Power Manager
  type PowerInfo,
  type PowerManagerCallbacks,
  PowerManager,
  createPowerManager,

  // Preload Manager
  type PreloadType,
  type PreloadStatus,
  type PreloadItem,
  type PreloadManagerOptions,
  type PreloadManagerCallbacks,
  PreloadManager,
  createPreloadManager,

  // Analytics Collector
  type QualitySwitch,
  type BufferingEvent,
  type PlaybackError,
  type SeekEvent,
  type PlaybackMetrics,
  type AnalyticsCollectorCallbacks,
  AnalyticsCollector,
  createAnalyticsCollector,
} from '@vortex/player-engine'
