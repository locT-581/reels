/**
 * @vortex/player - Hooks
 *
 * Player-specific hooks. Core playback hooks are re-exported from @vortex/player-core
 */

// High-level player hook
export { usePlayer, type UsePlayerReturn, type UsePlayerOptions } from './usePlayer'

// UI-specific hooks (not in player-core)
export { useFullscreen, type UseFullscreenReturn } from './useFullscreen'

// Core hooks are re-exported from main index via @vortex/player-core
// usePlayback, useVolume, useProgress, useQuality, useBuffering
// useAnalytics, useNetwork, usePreload
