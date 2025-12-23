'use client'

import { useState, useCallback, useRef } from 'react'
import { VideoPlayer, Timeline, type VideoPlayerRef } from '@vortex/player'
import { PlayPauseOverlay, ActionBar, Toast, BottomSheet } from '@vortex/ui'
import { useVideoGestures } from '@vortex/gestures'
import { mockVideos } from '@/lib/mock-data'
import { Navigation } from '@/components/Navigation'
import { ChevronLeft, ChevronRight, Settings, Info } from 'lucide-react'

export default function PlayerPage() {
  const playerRef = useRef<VideoPlayerRef>(null)
  const videoElementRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [showPauseOverlay, setShowPauseOverlay] = useState(false)
  const [timelineExpanded, setTimelineExpanded] = useState(false)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)
  const [showInfoSheet, setShowInfoSheet] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVariant, setToastVariant] = useState<'default' | 'success' | 'error' | 'warning'>('default')

  const currentVideo = mockVideos[selectedVideoIndex]

  const showToast = useCallback((message: string, variant: 'default' | 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(message)
    setToastVariant(variant)
    setToastVisible(true)
  }, [])

  // Player callbacks
  const handlePlay = useCallback(() => {
    setIsPlaying(true)
    setShowPauseOverlay(false)
    setTimelineExpanded(false)
  }, [])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
    setShowPauseOverlay(true)
    setTimelineExpanded(true)
  }, [])

  const handleEnded = useCallback(() => {
    showToast('Video đã kết thúc', 'default')
  }, [showToast])

  const handleError = useCallback((error: Error) => {
    showToast(`Lỗi: ${error.message}`, 'error')
  }, [showToast])

  // Gesture handlers
  const handleSingleTap = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.togglePlay()
    }
  }, [])

  const handleDoubleTap = useCallback((zone: string) => {
    if (!playerRef.current) return

    if (zone === 'left') {
      playerRef.current.seekBackward(10)
      showToast('⏪ -10s', 'default')
    } else if (zone === 'right') {
      playerRef.current.seekForward(10)
      showToast('⏩ +10s', 'default')
    } else {
      // Center - like
      showToast('❤️ Đã thích!', 'success')
    }
  }, [showToast])

  const handleLongPress = useCallback(() => {
    setShowInfoSheet(true)
  }, [])

  // Gesture bindings
  const gestureBindings = useVideoGestures({
    onSingleTap: handleSingleTap,
    onDoubleTap: handleDoubleTap,
    onLongPress: handleLongPress,
  })

  // Navigation between videos
  const goToPrevVideo = useCallback(() => {
    if (selectedVideoIndex > 0) {
      setSelectedVideoIndex((prev) => prev - 1)
    }
  }, [selectedVideoIndex])

  const goToNextVideo = useCallback(() => {
    if (selectedVideoIndex < mockVideos.length - 1) {
      setSelectedVideoIndex((prev) => prev + 1)
    }
  }, [selectedVideoIndex])

  // Action handlers
  const handleLike = useCallback(() => {
    showToast('❤️ Đã thích video', 'success')
  }, [showToast])

  const handleComment = useCallback(() => {
    showToast('💬 Mở comment sheet...', 'default')
  }, [showToast])

  const handleShare = useCallback(() => {
    showToast('🔗 Mở share sheet...', 'default')
  }, [showToast])

  // Timeline handlers
  const handleSeekStart = useCallback(() => {
    setTimelineExpanded(true)
  }, [])

  const handleSeekEnd = useCallback((time: number) => {
    if (playerRef.current) {
      playerRef.current.seek(time)
    }
  }, [])

  // Sync video element ref
  const handleReady = useCallback(() => {
    if (playerRef.current) {
      const videoEl = playerRef.current.getVideoElement()
      if (videoEl) {
        videoElementRef.current = videoEl
      }
    }
  }, [])

  // Guard against undefined video
  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-vortex-bg flex items-center justify-center">
        <p className="text-vortex-text-muted">No video available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vortex-bg">
      <Navigation />

      {/* Page Header */}
      <div className="fixed top-0 left-0 right-0 z-30 pt-4 px-6 pb-4 vortex-glass">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-vortex-text">Single Player Demo</h1>
            <p className="text-sm text-vortex-text-muted">
              VideoPlayer component với full controls
            </p>
          </div>
          <button
            onClick={() => setShowInfoSheet(true)}
            className="p-3 rounded-full vortex-glass vortex-transition hover:bg-vortex-glass-light"
          >
            <Info className="w-5 h-5 text-vortex-text" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Video Player Container */}
          <div className="relative aspect-9/16 max-h-[70vh] mx-auto rounded-3xl overflow-hidden border border-vortex-border bg-vortex-surface">
            <div
              ref={containerRef}
              className="absolute inset-0"
              {...gestureBindings()}
            >
              <VideoPlayer
                ref={playerRef}
                video={currentVideo}
                autoPlay={false}
                muted={true}
                loop={true}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onError={handleError}
                onReady={handleReady}
              />

              {/* Overlays */}
              <PlayPauseOverlay
                isPlaying={isPlaying}
                show={showPauseOverlay}
                size={64}
                autoHideDelay={800}
              />

              {/* Action Bar */}
              <ActionBar
                likeCount={currentVideo.stats.likes}
                commentCount={currentVideo.stats.comments}
                shareCount={currentVideo.stats.shares}
                isLiked={currentVideo.isLiked}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />

              {/* Timeline */}
              <Timeline
                videoRef={videoElementRef}
                expanded={timelineExpanded}
                onSeekStart={handleSeekStart}
                onSeekEnd={handleSeekEnd}
                onExpandedChange={setTimelineExpanded}
              />

              {/* Video Info Overlay */}
              <div className="absolute bottom-20 left-4 right-20">
                <div className="vortex-text-shadow">
                  <p className="text-lg font-semibold text-vortex-text mb-1">
                    @{currentVideo.author.username}
                  </p>
                  <p className="text-sm text-vortex-text-secondary line-clamp-2">
                    {currentVideo.caption}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={goToPrevVideo}
              disabled={selectedVideoIndex === 0}
              className="p-4 rounded-full vortex-glass vortex-transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-vortex-glass-light"
            >
              <ChevronLeft className="w-6 h-6 text-vortex-text" />
            </button>

            <div className="text-center">
              <div className="text-lg font-semibold text-vortex-text">
                Video {selectedVideoIndex + 1} / {mockVideos.length}
              </div>
              <div className="text-sm text-vortex-text-muted">
                @{currentVideo.author.username}
              </div>
            </div>

            <button
              onClick={goToNextVideo}
              disabled={selectedVideoIndex === mockVideos.length - 1}
              className="p-4 rounded-full vortex-glass vortex-transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-vortex-glass-light"
            >
              <ChevronRight className="w-6 h-6 text-vortex-text" />
            </button>
          </div>

          {/* Player Controls */}
          <div className="vortex-card">
            <h2 className="text-lg font-semibold text-vortex-text mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Player Controls
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => playerRef.current?.play()}
                className="vortex-btn vortex-btn-primary"
              >
                Play
              </button>
              <button
                onClick={() => playerRef.current?.pause()}
                className="vortex-btn vortex-btn-secondary"
              >
                Pause
              </button>
              <button
                onClick={() => playerRef.current?.toggleMute()}
                className="vortex-btn vortex-btn-secondary"
              >
                Toggle Mute
              </button>
              <button
                onClick={() => playerRef.current?.restart()}
                className="vortex-btn vortex-btn-secondary"
              >
                Restart
              </button>
              <button
                onClick={() => playerRef.current?.seekBackward(10)}
                className="vortex-btn vortex-btn-secondary"
              >
                -10s
              </button>
              <button
                onClick={() => playerRef.current?.seekForward(10)}
                className="vortex-btn vortex-btn-secondary"
              >
                +10s
              </button>
              <button
                onClick={() => playerRef.current?.seek(0)}
                className="vortex-btn vortex-btn-secondary"
              >
                Seek to 0
              </button>
              <button
                onClick={() => {
                  const duration = playerRef.current?.getDuration() || 0
                  playerRef.current?.seek(duration / 2)
                }}
                className="vortex-btn vortex-btn-secondary"
              >
                Seek to 50%
              </button>
            </div>
          </div>

          {/* Gesture Guide */}
          <div className="vortex-card">
            <h2 className="text-lg font-semibold text-vortex-text mb-4">
              🎮 Gesture Guide
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-vortex-accent/10 flex items-center justify-center">
                  👆
                </div>
                <div>
                  <div className="font-medium text-vortex-text">Single Tap</div>
                  <div className="text-vortex-text-muted">Play/Pause video</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-vortex-accent/10 flex items-center justify-center">
                  👆👆
                </div>
                <div>
                  <div className="font-medium text-vortex-text">Double Tap Left</div>
                  <div className="text-vortex-text-muted">Seek -10 seconds</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-vortex-accent/10 flex items-center justify-center">
                  👆👆
                </div>
                <div>
                  <div className="font-medium text-vortex-text">Double Tap Right</div>
                  <div className="text-vortex-text-muted">Seek +10 seconds</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-vortex-accent/10 flex items-center justify-center">
                  ✊
                </div>
                <div>
                  <div className="font-medium text-vortex-text">Long Press</div>
                  <div className="text-vortex-text-muted">Show info sheet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Info Bottom Sheet */}
      <BottomSheet
        isOpen={showInfoSheet}
        onClose={() => setShowInfoSheet(false)}
        title="Video Information"
      >
        <div className="space-y-4 px-4 pb-8">
          <div className="flex items-center gap-4">
            <img
              src={currentVideo.author.avatar}
              alt={currentVideo.author.displayName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-vortex-text">
                {currentVideo.author.displayName}
              </h3>
              <p className="text-sm text-vortex-text-muted">
                @{currentVideo.author.username}
              </p>
            </div>
          </div>

          <p className="text-vortex-text-secondary">
            {currentVideo.caption}
          </p>

          <div className="flex flex-wrap gap-2">
            {currentVideo.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm bg-vortex-accent/10 text-vortex-accent"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4 py-4 border-t border-vortex-border">
            <div className="text-center">
              <div className="text-lg font-semibold text-vortex-text">
                {(currentVideo.stats.views / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-vortex-text-muted">Views</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-vortex-text">
                {(currentVideo.stats.likes / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-vortex-text-muted">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-vortex-text">
                {(currentVideo.stats.comments / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-vortex-text-muted">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-vortex-text">
                {(currentVideo.stats.shares / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-vortex-text-muted">Shares</div>
            </div>
          </div>
        </div>
      </BottomSheet>

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
