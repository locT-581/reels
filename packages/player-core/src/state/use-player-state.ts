/**
 * usePlayerState - Hook to subscribe to player state
 */

'use client'

import type { PlayerStateMachine } from './player-state-machine'
import type { PlayerState } from '@xhub-reel/core'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { createPlayerStateMachine } from './player-state-machine'

export interface UsePlayerStateReturn {
  state: PlayerState
  isPlaying: boolean
  isPaused: boolean
  isLoading: boolean
  isBuffering: boolean
  isStalled: boolean
  isEnded: boolean
  hasError: boolean
  canPlay: boolean
  transition: (to: PlayerState) => boolean
  reset: () => void
}

export function usePlayerState(): UsePlayerStateReturn {
  const stateMachine = useMemo(() => createPlayerStateMachine(), [])
  const [state, setState] = useState<PlayerState>(stateMachine.state)

  useEffect(() => {
    const unsubscribe = stateMachine.subscribe((newState) => {
      setState(newState)
    })

    return unsubscribe
  }, [stateMachine])

  const transition = useCallback(
    (to: PlayerState) => stateMachine.transition(to),
    [stateMachine]
  )

  const reset = useCallback(() => {
    stateMachine.reset()
    setState('idle')
  }, [stateMachine])

  return {
    state,
    isPlaying: state === 'playing',
    isPaused: state === 'paused',
    isLoading: state === 'loading',
    isBuffering: state === 'buffering',
    isStalled: state === 'stalled',
    isEnded: state === 'ended',
    hasError: state === 'error',
    canPlay: stateMachine.canPlay(),
    transition,
    reset,
  }
}

/**
 * Hook that connects player state to an external state machine
 */
export function useExternalPlayerState(
  stateMachine: PlayerStateMachine
): UsePlayerStateReturn {
  const [state, setState] = useState<PlayerState>(stateMachine.state)

  useEffect(() => {
    const unsubscribe = stateMachine.subscribe((newState) => {
      setState(newState)
    })

    return unsubscribe
  }, [stateMachine])

  const transition = useCallback(
    (to: PlayerState) => stateMachine.transition(to),
    [stateMachine]
  )

  const reset = useCallback(() => {
    stateMachine.reset()
    setState('idle')
  }, [stateMachine])

  return {
    state,
    isPlaying: state === 'playing',
    isPaused: state === 'paused',
    isLoading: state === 'loading',
    isBuffering: state === 'buffering',
    isStalled: state === 'stalled',
    isEnded: state === 'ended',
    hasError: state === 'error',
    canPlay: stateMachine.canPlay(),
    transition,
    reset,
  }
}

