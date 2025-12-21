/**
 * useFeedType - Hook for managing feed type state
 */

'use client'

import { useState, useCallback } from 'react'
import { useFeedStore } from '@vortex/core'
import type { FeedType } from '@vortex/core'

export interface UseFeedTypeOptions {
  /** Initial feed type */
  initialType?: FeedType
  /** Called when feed type changes */
  onTypeChange?: (type: FeedType) => void
}

export interface UseFeedTypeReturn {
  feedType: FeedType
  setFeedType: (type: FeedType) => void
  toggleFeedType: () => void
  isForYou: boolean
  isFollowing: boolean
}

export function useFeedType({
  initialType = 'foryou',
  onTypeChange,
}: UseFeedTypeOptions = {}): UseFeedTypeReturn {
  const { feedType: storedType, setFeedType: storeSetFeedType } = useFeedStore()
  const [feedType, setFeedTypeState] = useState<FeedType>(storedType || initialType)

  const setFeedType = useCallback(
    (type: FeedType) => {
      setFeedTypeState(type)
      storeSetFeedType(type)
      onTypeChange?.(type)
    },
    [storeSetFeedType, onTypeChange]
  )

  const toggleFeedType = useCallback(() => {
    const newType: FeedType = feedType === 'foryou' ? 'following' : 'foryou'
    setFeedType(newType)
  }, [feedType, setFeedType])

  return {
    feedType,
    setFeedType,
    toggleFeedType,
    isForYou: feedType === 'foryou',
    isFollowing: feedType === 'following',
  }
}

