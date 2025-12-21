/**
 * Player-related type definitions
 */

/**
 * Player state machine states
 */
export type PlayerState =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'buffering'
  | 'stalled'
  | 'error'
  | 'ended'

/**
 * Available playback speeds
 */
export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2

/**
 * Video quality options
 */
export type Quality = 'auto' | '1080p' | '720p' | '480p' | '360p' | '240p'

/**
 * Player progress information
 */
export interface PlayerProgress {
  currentTime: number
  duration: number
  buffered: number
  progress: number // 0-100 percentage
}

/**
 * Buffered time range
 */
export interface BufferedRange {
  start: number
  end: number
}

/**
 * Player error types
 */
export type PlayerErrorType =
  | 'network'
  | 'decode'
  | 'notSupported'
  | 'aborted'
  | 'unknown'

/**
 * Player error
 */
export interface PlayerError {
  type: PlayerErrorType
  message: string
  code?: number
  recoverable: boolean
}

/**
 * Player configuration
 */
export interface PlayerConfig {
  autoPlay: boolean
  muted: boolean
  loop: boolean
  playbackSpeed: PlaybackSpeed
  quality: Quality
  preload: 'none' | 'metadata' | 'auto'
}

/**
 * Player events
 */
export type PlayerEvent =
  | 'play'
  | 'pause'
  | 'ended'
  | 'timeupdate'
  | 'progress'
  | 'seeking'
  | 'seeked'
  | 'waiting'
  | 'canplay'
  | 'canplaythrough'
  | 'error'
  | 'loadstart'
  | 'loadedmetadata'
  | 'loadeddata'
  | 'volumechange'
  | 'ratechange'
  | 'qualitychange'

/**
 * Player event callback map
 */
export interface PlayerEventMap {
  play: () => void
  pause: () => void
  ended: () => void
  timeupdate: (currentTime: number) => void
  progress: (buffered: number) => void
  seeking: () => void
  seeked: () => void
  waiting: () => void
  canplay: () => void
  canplaythrough: () => void
  error: (error: PlayerError) => void
  loadstart: () => void
  loadedmetadata: (duration: number) => void
  loadeddata: () => void
  volumechange: (volume: number, muted: boolean) => void
  ratechange: (rate: PlaybackSpeed) => void
  qualitychange: (quality: Quality) => void
}

