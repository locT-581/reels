/**
 * Player State Machine
 * Manages player state transitions with guards
 *
 * This class provides:
 * - State transition validation (prevents invalid state changes)
 * - Stalled detection (buffering -> stalled after threshold)
 * - Subscriber pattern for state change notifications
 *
 * Architecture Note:
 * This state machine works alongside the playerStore from @xhub-reel/core:
 * - playerStore: Zustand store for application-level state
 * - PlayerStateMachine: Validates state transitions, handles edge cases
 *
 * The state machine ensures transitions are valid before they happen,
 * while the store persists the actual state and preferences.
 *
 * Usage:
 * ```tsx
 * const machine = createPlayerStateMachine()
 *
 * // Before changing state, check if valid
 * if (machine.canTransition('playing')) {
 *   machine.transition('playing')
 *   playerStore.play()
 * }
 * ```
 */

import type { PlayerState } from '@xhub-reel/core'

export type StateTransition = {
  from: PlayerState | '*'
  to: PlayerState
  guard?: () => boolean
}

/**
 * Valid state transitions
 */
export const STATE_TRANSITIONS: StateTransition[] = [
  // From idle
  { from: 'idle', to: 'loading' },

  // From loading
  { from: 'loading', to: 'ready' },
  { from: 'loading', to: 'error' },

  // From ready
  { from: 'ready', to: 'playing' },
  { from: 'ready', to: 'loading' },
  { from: 'ready', to: 'error' },

  // From playing
  { from: 'playing', to: 'paused' },
  { from: 'playing', to: 'buffering' },
  { from: 'playing', to: 'ended' },
  { from: 'playing', to: 'error' },
  { from: 'playing', to: 'loading' }, // Source change

  // From paused
  { from: 'paused', to: 'playing' },
  { from: 'paused', to: 'buffering' },
  { from: 'paused', to: 'loading' }, // Source change
  { from: 'paused', to: 'error' },

  // From buffering
  { from: 'buffering', to: 'playing' },
  { from: 'buffering', to: 'paused' },
  { from: 'buffering', to: 'stalled' },
  { from: 'buffering', to: 'error' },

  // From stalled
  { from: 'stalled', to: 'playing' },
  { from: 'stalled', to: 'buffering' },
  { from: 'stalled', to: 'error' },
  { from: 'stalled', to: 'loading' }, // Retry

  // From ended
  { from: 'ended', to: 'playing' }, // Replay
  { from: 'ended', to: 'loading' }, // New source
  { from: 'ended', to: 'idle' },

  // From error (can retry)
  { from: 'error', to: 'loading' },
  { from: 'error', to: 'idle' },

  // Reset from any state
  { from: '*', to: 'idle' },
]

/**
 * State machine for player
 */
export class PlayerStateMachine {
  private _state: PlayerState = 'idle'
  private listeners: Set<(state: PlayerState, prevState: PlayerState) => void> = new Set()
  private stalledTimeout: ReturnType<typeof setTimeout> | null = null
  private stalledThreshold: number = 3000 // 3 seconds to consider stalled

  get state(): PlayerState {
    return this._state
  }

  /**
   * Transition to a new state
   */
  transition(to: PlayerState): boolean {
    const isValid = this.canTransition(to)

    if (!isValid) {
      console.warn(`[PlayerStateMachine] Invalid transition: ${this._state} -> ${to}`)
      return false
    }

    const prevState = this._state
    this._state = to

    // Handle stalled detection
    if (to === 'buffering') {
      this.startStalledTimer()
    } else {
      this.clearStalledTimer()
    }

    // Notify listeners
    this.listeners.forEach((listener) => listener(to, prevState))

    return true
  }

  /**
   * Check if transition is valid
   */
  canTransition(to: PlayerState): boolean {
    const transition = STATE_TRANSITIONS.find(
      (t) => (t.from === this._state || t.from === '*') && t.to === to
    )

    if (!transition) return false

    // Check guard if exists
    if (transition.guard && !transition.guard()) {
      return false
    }

    return true
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: PlayerState, prevState: PlayerState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Reset to idle state
   */
  reset(): void {
    this.clearStalledTimer()
    this._state = 'idle'
  }

  /**
   * Check if currently playing
   */
  isPlaying(): boolean {
    return this._state === 'playing'
  }

  /**
   * Check if can play
   */
  canPlay(): boolean {
    return ['ready', 'paused', 'ended'].includes(this._state)
  }

  /**
   * Check if loading/buffering
   */
  isLoading(): boolean {
    return ['loading', 'buffering'].includes(this._state)
  }

  /**
   * Check if in error state
   */
  hasError(): boolean {
    return this._state === 'error'
  }

  private startStalledTimer(): void {
    this.clearStalledTimer()

    this.stalledTimeout = setTimeout(() => {
      if (this._state === 'buffering') {
        this.transition('stalled')
      }
    }, this.stalledThreshold)
  }

  private clearStalledTimer(): void {
    if (this.stalledTimeout) {
      clearTimeout(this.stalledTimeout)
      this.stalledTimeout = null
    }
  }
}

/**
 * Create a new state machine instance
 */
export function createPlayerStateMachine(): PlayerStateMachine {
  return new PlayerStateMachine()
}

