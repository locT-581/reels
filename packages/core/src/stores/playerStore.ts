/**
 * Player Stores - Re-exports for convenience
 *
 * State Architecture:
 * - usePlayerRuntimeStore: Transient playback state (currentVideo, isPlaying, etc.)
 * - usePlayerPreferencesStore: Persisted preferences (volume, muted, speed, quality)
 * - PlayerStateMachine: State transition validation (in @vortex/player-core)
 */

// Re-export individual stores
export { usePlayerRuntimeStore, type PlayerRuntimeStore } from './playerRuntimeStore'
export { usePlayerPreferencesStore, type PreferencesStore } from './preferencesStore'
