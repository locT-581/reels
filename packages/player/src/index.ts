/**
 * @vortex/player
 * Video player package for VortexStream
 *
 * This package re-exports core functionality from @vortex/player-core
 * and adds UI components specific to the video player.
 */

// Re-export everything from player-core (engine, state, hooks)
export * from '@vortex/player-core'

// Re-export everything from ui (allows feed to import from player only)
export * from '@vortex/ui'

// Player-specific UI components
export * from './components'

// Player-specific hooks (high-level)
export * from './hooks'

// Utils (re-exported from @vortex/core for convenience)
export { cn } from '@vortex/core'
