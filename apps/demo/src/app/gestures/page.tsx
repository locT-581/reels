'use client'

import { useState, useCallback, useRef } from 'react'
import { motion } from 'motion/react'
import {
  useVideoGestures,
  useTapGestures,
  useLongPress,
  useVerticalSwipe,
  useHorizontalSwipe,
  useTapRipple,
  getGestureZone,
  calculateSeekAmount,
} from '@vortex/gestures'
import { DoubleTapHeart, useDoubleTapHeart, Toast } from '@vortex/ui'
import { Navigation } from '@/components/Navigation'
import { Play, Pause, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Hand, Zap } from 'lucide-react'

export default function GesturesPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Toast state
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVariant, setToastVariant] = useState<'default' | 'success' | 'error' | 'warning'>('default')

  // Demo states
  const [lastGesture, setLastGesture] = useState('')
  const [tapCount, setTapCount] = useState(0)
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null)
  const [gestureZone, setGestureZone] = useState<string | null>(null)

  // Double tap heart
  const { isShowing: showHeart, position: heartPosition, showHeart: triggerHeart } = useDoubleTapHeart()

  // Tap ripple
  const { Ripples, triggerRipple } = useTapRipple({ color: 'rgba(139, 92, 246, 0.5)' })

  const showToast = useCallback((message: string, variant: 'default' | 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(message)
    setToastVariant(variant)
    setToastVisible(true)
  }, [])

  // =============================================================================
  // DEMO 1: Complete Video Gestures
  // =============================================================================

  const [videoPlaying, setVideoPlaying] = useState(false)

  const handleSingleTap = useCallback(() => {
    setLastGesture('Single Tap')
    setVideoPlaying(prev => !prev)
    setTapCount((prev) => prev + 1)
  }, [])

  const handleDoubleTap = useCallback((zone: string, position: { x: number; y: number }) => {
    setLastGesture(`Double Tap: ${zone}`)
    setGestureZone(zone)

    if (zone === 'center') {
      triggerHeart(position.x, position.y)
      showToast('❤️ Liked!', 'success')
    } else if (zone === 'left') {
      showToast('⏪ -10s', 'default')
    } else if (zone === 'right') {
      showToast('⏩ +10s', 'default')
    }

    setTimeout(() => setGestureZone(null), 1000)
  }, [triggerHeart, showToast])

  const handleLongPress = useCallback(() => {
    setLastGesture('Long Press')
    showToast('Context menu...', 'default')
  }, [showToast])

  const videoGestureBindings = useVideoGestures({
    onSingleTap: handleSingleTap,
    onDoubleTap: handleDoubleTap,
    onLongPress: handleLongPress,
  })

  // =============================================================================
  // DEMO 2: Tap Gestures with Ripple
  // =============================================================================

  const { handleTap } = useTapGestures({
    onSingleTap: () => {
      setLastGesture('Single Tap')
    },
    onDoubleTap: (zone, position) => {
      setLastGesture(`Double Tap: ${zone}`)
      if (zone === 'center') {
        triggerHeart(position.x, position.y)
      }
    },
  })

  const handleTapWithRipple = useCallback((e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    triggerRipple(e.clientX - rect.left, e.clientY - rect.top)
    handleTap(e)
  }, [handleTap, triggerRipple])

  // =============================================================================
  // DEMO 3: Long Press
  // =============================================================================

  const { longPressProps, isPressing, isHolding } = useLongPress({
    onLongPress: () => {
      setLastGesture('Long Press Completed')
      showToast('✅ Long press completed!', 'success')
    },
    onPressStart: () => {
      setLastGesture('Press Started')
    },
    onPressEnd: () => {
      setLastGesture('Press Ended')
    },
    threshold: 500,
  })

  // =============================================================================
  // DEMO 4: Vertical Swipe
  // =============================================================================

  const [verticalOffset, setVerticalOffset] = useState(0)

  const { bind: verticalSwipeBind } = useVerticalSwipe({
    onSwipeUp: () => {
      setLastGesture('Swipe Up')
      setSwipeDirection('up')
      setTimeout(() => setSwipeDirection(null), 1000)
    },
    onSwipeDown: () => {
      setLastGesture('Swipe Down')
      setSwipeDirection('down')
      setTimeout(() => setSwipeDirection(null), 1000)
    },
    onSwipeProgress: (_progress, _direction, movement) => {
      setVerticalOffset(movement * 0.3) // Dampen the movement
    },
    onSwipeCancel: () => {
      setVerticalOffset(0)
    },
    threshold: 0.2,
    velocityThreshold: 0.3,
  })

  // =============================================================================
  // DEMO 5: Horizontal Swipe
  // =============================================================================

  const [horizontalOffset, setHorizontalOffset] = useState(0)

  const { bind: horizontalSwipeBind } = useHorizontalSwipe({
    onSwipeLeft: () => {
      setLastGesture('Swipe Left')
      setSwipeDirection('left')
      setHorizontalOffset(0)
      setTimeout(() => setSwipeDirection(null), 1000)
    },
    onSwipeRight: () => {
      setLastGesture('Swipe Right')
      setSwipeDirection('right')
      setHorizontalOffset(0)
      setTimeout(() => setSwipeDirection(null), 1000)
    },
    onSwipeProgress: (progress: number, direction: 'left' | 'right') => {
      // progress is 0-1, direction tells us which way
      const multiplier = direction === 'left' ? -1 : 1
      setHorizontalOffset(progress * 100 * multiplier * 0.3)
    },
    onSwipeCancel: () => {
      setHorizontalOffset(0)
    },
    threshold: 0.2,
  })

  // =============================================================================
  // DEMO 6: Gesture Zone Detection
  // =============================================================================

  const handleZoneDetection = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const zone = getGestureZone(e, e.currentTarget)
    setLastGesture(`Zone: ${zone}`)
    setGestureZone(zone)
    setTimeout(() => setGestureZone(null), 1000)
  }, [])

  // =============================================================================
  // DEMO 7: Seek Amount Calculation
  // =============================================================================

  const [seekAmount, setSeekAmount] = useState(0)

  const handleSeekCalculation = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const zone = getGestureZone(e, e.currentTarget)
    // Simulate drag distance based on zone: left=-100, center=0, right=+100
    const simulatedDragDistance = zone === 'left' ? -100 : zone === 'right' ? 100 : 0
    const amount = calculateSeekAmount(simulatedDragDistance, 60) // 60 second video
    setSeekAmount(amount)
    setLastGesture(`Seek ${zone}: ${amount > 0 ? '+' : ''}${amount.toFixed(1)}s`)
  }, [])

  return (
    <div className="min-h-screen bg-vortex-bg" ref={containerRef}>
      <Navigation />

      {/* Page Header */}
      <div className="sticky top-0 z-30 pt-4 px-6 pb-4 vortex-glass">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-vortex-text">Gesture System</h1>
          <p className="text-sm text-vortex-text-muted">
            Touch-optimized interactions demo
          </p>
        </div>
      </div>

      <main className="px-6 pb-32 pt-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Status Bar */}
          <div className="vortex-card flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Hand className="w-5 h-5 text-vortex-accent" />
              <span className="text-sm text-vortex-text-muted">Last Gesture:</span>
              <span className="font-semibold text-vortex-text">{lastGesture || 'None'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-vortex-accent" />
              <span className="text-sm text-vortex-text-muted">Tap Count:</span>
              <span className="font-semibold text-vortex-text">{tapCount}</span>
            </div>
          </div>

          {/* Demo 1: Complete Video Gestures */}
          <section>
            <h2 className="text-xl font-semibold text-vortex-text mb-4">1. Video Gestures (Combined)</h2>
            <div className="vortex-card">
              <div
                className="relative h-[300px] bg-linear-to-b from-vortex-surface-elevated to-vortex-surface rounded-xl overflow-hidden cursor-pointer select-none"
                {...videoGestureBindings()}
              >
                {/* Video placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: videoPlaying ? 0 : 1, opacity: videoPlaying ? 0 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {videoPlaying ? (
                      <Pause className="w-16 h-16 text-vortex-text/50" />
                    ) : (
                      <Play className="w-16 h-16 text-vortex-text/50" />
                    )}
                  </motion.div>
                </div>

                {/* Zone indicators */}
                <div className="absolute inset-0 flex">
                  <div className={`flex-1 flex items-center justify-center border-r border-vortex-border/30 transition-colors ${gestureZone === 'left' ? 'bg-vortex-accent/20' : ''}`}>
                    <span className="text-xs text-vortex-text-muted">Left Zone</span>
                  </div>
                  <div className={`flex-1 flex items-center justify-center border-r border-vortex-border/30 transition-colors ${gestureZone === 'center' ? 'bg-vortex-like/20' : ''}`}>
                    <span className="text-xs text-vortex-text-muted">Center Zone</span>
                  </div>
                  <div className={`flex-1 flex items-center justify-center transition-colors ${gestureZone === 'right' ? 'bg-vortex-accent/20' : ''}`}>
                    <span className="text-xs text-vortex-text-muted">Right Zone</span>
                  </div>
                </div>

                {/* Double tap heart */}
                <DoubleTapHeart
                  show={showHeart}
                  position={heartPosition}
                  size={80}
                  showParticles={true}
                />

                {/* Instructions */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-xs text-vortex-text-muted">
                    Tap: Play/Pause • Double-tap: Seek/Like • Long-press: Menu
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Demo 2: Tap with Ripple */}
          <section>
            <h2 className="text-xl font-semibold text-vortex-text mb-4">2. Tap with Ripple Effect</h2>
            <div className="vortex-card">
              <div
                className="relative h-[200px] bg-linear-to-b from-vortex-surface-elevated to-vortex-surface rounded-xl overflow-hidden cursor-pointer select-none"
                onPointerDown={handleTapWithRipple}
              >
                <Ripples />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-vortex-text-muted">Tap anywhere for ripple effect</span>
                </div>
                <DoubleTapHeart show={showHeart} position={heartPosition} size={60} />
              </div>
            </div>
          </section>

          {/* Demo 3: Long Press */}
          <section>
            <h2 className="text-xl font-semibold text-vortex-text mb-4">3. Long Press</h2>
            <div className="vortex-card">
              <div
                className="relative h-[150px] bg-linear-to-b from-vortex-surface-elevated to-vortex-surface rounded-xl overflow-hidden cursor-pointer select-none"
                {...longPressProps}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-colors ${isPressing ? 'border-vortex-accent bg-vortex-accent/20' : 'border-vortex-border'} ${isHolding ? 'bg-vortex-accent/40' : ''}`}>
                    <Hand className={`w-8 h-8 transition-colors ${isPressing ? 'text-vortex-accent' : 'text-vortex-text-muted'}`} />
                  </div>
                  <span className="text-sm text-vortex-text-muted">
                    {isHolding ? 'Holding!' : isPressing ? 'Keep holding...' : 'Press and hold'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Demo 4: Vertical Swipe */}
          <section>
            <h2 className="text-xl font-semibold text-vortex-text mb-4">4. Vertical Swipe</h2>
            <div className="vortex-card">
              <div
                className="relative h-[200px] bg-linear-to-b from-vortex-surface-elevated to-vortex-surface rounded-xl overflow-hidden cursor-grab active:cursor-grabbing touch-none"
                {...verticalSwipeBind()}
              >
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ y: verticalOffset }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <ChevronUp className={`w-8 h-8 transition-colors ${swipeDirection === 'up' ? 'text-vortex-accent' : 'text-vortex-text-muted'}`} />
                    <span className="text-vortex-text">Swipe Up/Down</span>
                    <ChevronDown className={`w-8 h-8 transition-colors ${swipeDirection === 'down' ? 'text-vortex-accent' : 'text-vortex-text-muted'}`} />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Demo 5: Horizontal Swipe */}
          <section>
            <h2 className="text-xl font-semibold text-vortex-text mb-4">5. Horizontal Swipe</h2>
            <div className="vortex-card">
              <div
                className="relative h-[150px] bg-linear-to-b from-vortex-surface-elevated to-vortex-surface rounded-xl overflow-hidden cursor-grab active:cursor-grabbing touch-none"
                {...horizontalSwipeBind()}
              >
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ x: horizontalOffset }}
                >
                  <div className="flex items-center gap-8">
                    <ChevronLeft className={`w-8 h-8 transition-colors ${swipeDirection === 'left' ? 'text-vortex-accent' : 'text-vortex-text-muted'}`} />
                    <span className="text-vortex-text">Swipe Left/Right</span>
                    <ChevronRight className={`w-8 h-8 transition-colors ${swipeDirection === 'right' ? 'text-vortex-accent' : 'text-vortex-text-muted'}`} />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Demo 6: Zone Detection */}
          <section>
            <h2 className="text-xl font-semibold text-vortex-text mb-4">6. Gesture Zone Detection</h2>
            <div className="vortex-card">
              <div
                className="relative h-[120px] bg-linear-to-b from-vortex-surface-elevated to-vortex-surface rounded-xl overflow-hidden cursor-crosshair"
                onPointerDown={handleZoneDetection}
              >
                <div className="absolute inset-0 flex">
                  {['left', 'center', 'right'].map((zone) => (
                    <div
                      key={zone}
                      className={`flex-1 flex items-center justify-center border-r last:border-r-0 border-vortex-border/30 transition-colors ${gestureZone === zone ? 'bg-vortex-accent/20' : ''}`}
                    >
                      <span className={`text-sm font-medium capitalize ${gestureZone === zone ? 'text-vortex-accent' : 'text-vortex-text-muted'}`}>
                        {zone}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-vortex-text-muted mt-2">
                Click anywhere to detect zone (33% / 34% / 33% split)
              </p>
            </div>
          </section>

          {/* Demo 7: Seek Amount */}
          <section>
            <h2 className="text-xl font-semibold text-vortex-text mb-4">7. Seek Amount Calculation</h2>
            <div className="vortex-card">
              <div
                className="relative h-[120px] bg-linear-to-b from-vortex-surface-elevated to-vortex-surface rounded-xl overflow-hidden cursor-pointer"
                onPointerDown={handleSeekCalculation}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-vortex-text">
                      {seekAmount > 0 ? '+' : ''}{seekAmount}s
                    </span>
                    <p className="text-sm text-vortex-text-muted mt-1">
                      (60s video)
                    </p>
                  </div>
                </div>

                {/* Zone indicators */}
                <div className="absolute bottom-0 left-0 right-0 flex">
                  <div className="flex-1 py-2 text-center text-xs text-vortex-text-muted border-r border-vortex-border/30">
                    -10s
                  </div>
                  <div className="flex-1 py-2 text-center text-xs text-vortex-text-muted border-r border-vortex-border/30">
                    0s (like)
                  </div>
                  <div className="flex-1 py-2 text-center text-xs text-vortex-text-muted">
                    +10s
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* API Reference */}
          <section className="vortex-card">
            <h2 className="text-xl font-semibold text-vortex-text mb-4">API Reference</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-vortex-text mb-2">useVideoGestures</h3>
                <code className="text-vortex-text-secondary bg-vortex-surface-elevated px-2 py-1 rounded">
                  Combined hook for single tap, double tap (with zone), and long press
                </code>
              </div>
              <div>
                <h3 className="font-medium text-vortex-text mb-2">useTapGestures</h3>
                <code className="text-vortex-text-secondary bg-vortex-surface-elevated px-2 py-1 rounded">
                  Single and double tap detection with zone support
                </code>
              </div>
              <div>
                <h3 className="font-medium text-vortex-text mb-2">useLongPress</h3>
                <code className="text-vortex-text-secondary bg-vortex-surface-elevated px-2 py-1 rounded">
                  Long press with hold tracking
                </code>
              </div>
              <div>
                <h3 className="font-medium text-vortex-text mb-2">useVerticalSwipe / useHorizontalSwipe</h3>
                <code className="text-vortex-text-secondary bg-vortex-surface-elevated px-2 py-1 rounded">
                  Directional swipe with progress tracking
                </code>
              </div>
              <div>
                <h3 className="font-medium text-vortex-text mb-2">useSeekDrag</h3>
                <code className="text-vortex-text-secondary bg-vortex-surface-elevated px-2 py-1 rounded">
                  Drag-based seek interaction for video timeline
                </code>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Toast */}
      <Toast
        message={toastMessage}
        variant={toastVariant}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  )
}
