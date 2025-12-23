/**
 * Player Engine Services
 * Network detection, power management, preloading, and analytics
 */

// Network Detector
export {
  type EffectiveType,
  type ConnectionType,
  type NetworkInfo,
  type NetworkDetectorCallbacks,
  NetworkDetector,
  createNetworkDetector,
} from './network-detector'

// Power Manager
export {
  type PowerInfo,
  type PowerManagerCallbacks,
  PowerManager,
  createPowerManager,
} from './power-manager'

// Preload Manager
export {
  type PreloadType,
  type PreloadStatus,
  type PreloadItem,
  type PreloadManagerOptions,
  type PreloadManagerCallbacks,
  PreloadManager,
  createPreloadManager,
} from './preload-manager'

// Analytics Collector
export {
  type QualitySwitch,
  type BufferingEvent,
  type PlaybackError,
  type SeekEvent,
  type PlaybackMetrics,
  type AnalyticsCollectorCallbacks,
  AnalyticsCollector,
  createAnalyticsCollector,
} from './analytics-collector'
