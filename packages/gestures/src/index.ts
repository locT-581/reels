/**
 * @vortex/gestures
 *
 * Gesture system for VortexStream
 * Touch-optimized interactions for video player
 */

// Main composite hook
export { useVideoGestures, type VideoGestureHandlers } from './hooks/useVideoGestures'

// Individual gesture hooks
export { useTapGestures, type TapGestureHandlers, type TapGesturesReturn } from './hooks/useTapGestures'
export { useDoubleTap, type DoubleTapOptions } from './hooks/useDoubleTap'
export { useLongPress, type LongPressOptions } from './hooks/useLongPress'
export { useHold, type HoldOptions, type HoldReturn } from './hooks/useHold'

// Swipe hooks
export { useSwipe, type SwipeOptions, type SwipeDirection } from './hooks/useSwipe'
export { useVerticalSwipe, type VerticalSwipeOptions, type VerticalSwipeReturn } from './hooks/useVerticalSwipe'
export { useHorizontalSwipe, type HorizontalSwipeOptions, type HorizontalSwipeReturn } from './hooks/useHorizontalSwipe'

// Seek drag hook
export { useSeekDrag, type SeekDragOptions, type SeekDragReturn } from './hooks/useSeekDrag'

// Components
export {
  GestureIndicator,
  type GestureIndicatorProps,
  type SwipeDirection as GestureSwipeDirection,
} from './components/GestureIndicator'
export {
  useTapRipple,
  TapRippleContainer,
  type TapRippleProps,
  type TapRippleContainerProps,
  type TapRippleReturn,
  type RippleItem,
} from './components/TapRipple'

// Utils
export { getGestureZone, type GestureZone } from './utils/getGestureZone'
export { calculateSeekAmount } from './utils/calculateSeekAmount'
