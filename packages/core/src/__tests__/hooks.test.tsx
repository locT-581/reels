/**
 * Tests for custom hooks
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useDebounce } from '../hooks/useDebounce'
import { useThrottle } from '../hooks/useThrottle'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value updates', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated' })
    
    // Should still be initial immediately
    expect(result.current).toBe('initial')

    // Fast-forward time
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    // Should now be updated
    expect(result.current).toBe('updated')
  })

  it('should cancel pending debounce on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'a' } }
    )

    rerender({ value: 'b' })
    await act(async () => {
      vi.advanceTimersByTime(200)
    })
    
    rerender({ value: 'c' })
    await act(async () => {
      vi.advanceTimersByTime(200)
    })
    
    rerender({ value: 'd' })
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    // Should only have the final value
    expect(result.current).toBe('d')
  })
})

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useThrottle('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should throttle value updates', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useThrottle(value, 500),
      { initialProps: { value: 'a' } }
    )

    expect(result.current).toBe('a')

    // Update value - should not update immediately (throttled)
    rerender({ value: 'b' })
    expect(result.current).toBe('a') // Still a (throttled)

    // Rapid updates within throttle window
    rerender({ value: 'c' })
    expect(result.current).toBe('a') // Still a (throttled)

    rerender({ value: 'd' })
    expect(result.current).toBe('a') // Still a (throttled)

    // Advance past throttle window
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    // Should update to latest value
    expect(result.current).toBe('d')
  })
})

