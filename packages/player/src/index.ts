/**
 * @xhub-reel/player
 * Video player package for XHubReel
 *
 * This package re-exports core functionality from @xhub-reel/player-core
 * and adds UI components specific to the video player.
 */

// Re-export everything from player-core (engine, state, hooks)
export * from '@xhub-reel/player-core'

// Re-export everything from ui (allows feed to import from player only)
export * from '@xhub-reel/ui'

// Player-specific UI components
export * from './components'

// Player-specific hooks (high-level)
export * from './hooks'

// Utils (re-exported from @xhub-reel/core for convenience)
export { cn } from '@xhub-reel/core'
