/**
 * @xhub-reel/gestures
 *
 * Gesture system for XHubReel
 * Touch-optimized interactions for video player
 */

// Main composite hook
export { useVideoGestures, type VideoGestureHandlers } from './hooks/useVideoGestures'

// Individual gesture hooks
export { useTapGestures, type TapGestureHandlers, type TapGesturesReturn } from './hooks/useTapGestures'
export { useDoubleTap, type DoubleTapOptions } from './hooks/useDoubleTap'
export {
  useLongPress,
  type LongPressOptions,
  type LongPressReturn,
  // Backwards compatibility exports
  useHold,
  type HoldOptions,
  type HoldReturn,
} from './hooks/useLongPress'

// Swipe hooks
export { useSwipe, type SwipeOptions, type SwipeDirection } from './hooks/useSwipe'
export {
  useVerticalSwipe,
  type VerticalSwipeOptions,
  type VerticalSwipeState,
  type VerticalSwipeReturn,
} from './hooks/useVerticalSwipe'
export {
  useHorizontalSwipe,
  type HorizontalSwipeOptions,
  type HorizontalSwipeState,
  type HorizontalSwipeReturn,
} from './hooks/useHorizontalSwipe'

// Seek drag hook
export { useSeekDrag, type SeekDragOptions, type SeekDragReturn } from './hooks/useSeekDrag'

// Utils
export { getGestureZone, type GestureZone } from './utils/getGestureZone'
export { calculateSeekAmount } from './utils/calculateSeekAmount'

// Styles
/**
 * CSS styles to apply on elements that use gesture hooks (drag, swipe).
 * This prevents browser default touch behaviors and eliminates @use-gesture warnings.
 *
 * @example
 * ```tsx
 * const { bind } = useVerticalSwipe({ ... })
 * return <div {...bind()} style={gestureTargetStyles}>...</div>
 * ```
 */
export const gestureTargetStyles: React.CSSProperties = {
  touchAction: 'none',
  userSelect: 'none',
  WebkitUserSelect: 'none',
}
