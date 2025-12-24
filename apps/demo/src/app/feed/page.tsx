'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import {
  VideoFeed,
  PooledVideoFeed,
  ConnectedVideoFeed,
  type VideoFeedRef,
} from '@xhub-reel/feed'
import type { Video } from '@xhub-reel/core'
import { CommentSheet, ShareSheet, Toast } from '@xhub-reel/ui'
import { mockVideos, mockComments } from '@/lib/mock-data'
import { useDemoConfig, toXHubReelConfig } from '@/lib/demo-config'
import { Navigation } from '@/components/Navigation'
import { Settings, Wifi, WifiOff, Zap, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import Link from 'next/link'
import { motion, useDragControls } from 'motion/react'

export default function FeedPage() {
  const feedRef = useRef<VideoFeedRef>(null)

  const mode = useDemoConfig((state) => state.mode)
  const baseUrl = useDemoConfig((state) => state.baseUrl)
  const apiKey = useDemoConfig((state) => state.apiKey)
  const accessToken = useDemoConfig((state) => state.accessToken)
  const refreshToken = useDemoConfig((state) => state.refreshToken)
  const endpoints = useDemoConfig((state) => state.endpoints)
  const debugMode = useDemoConfig((state) => state.debugMode)

  // Pool mode toggle - force HLS.js for better preloading in WebViews
  const [usePooledFeed, setUsePooledFeed] = useState(true)
  const [forceHLSJS, setForceHLSJS] = useState(false)

  // Debug panel state
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const dragControls = useDragControls()
  const constraintsRef = useRef<HTMLDivElement>(null)

  const xhubReelConfig = useMemo(() => {
    if (mode === 'mock' || !baseUrl) {
      return null
    }
    return toXHubReelConfig({
      mode,
      baseUrl,
      apiKey,
      accessToken,
      refreshToken,
      endpoints,
      debugMode,
    } as Parameters<typeof toXHubReelConfig>[0])
  }, [mode, baseUrl, apiKey, accessToken, refreshToken, endpoints, debugMode])

  const isApiMode = mode === 'api' && xhubReelConfig !== null

  // State for mock mode
  const [videos, setVideos] = useState<Video[]>(mockVideos)
  const [currentVideo, setCurrentVideo] = useState<Video | null>(mockVideos[0] || null)

  // Comment sheet state
  const [commentSheetOpen, setCommentSheetOpen] = useState(false)
  const [selectedVideoComments] = useState(mockComments)

  // Share sheet state
  const [shareSheetOpen, setShareSheetOpen] = useState(false)

  // Toast state
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVariant, setToastVariant] = useState<'default' | 'success' | 'error' | 'warning'>('default')

  const showToast = useCallback((message: string, variant: 'default' | 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(message)
    setToastVariant(variant)
    setToastVisible(true)
  }, [])

  // Handle video change
  const handleVideoChange = useCallback((video: Video, _index: number) => {
    setCurrentVideo(video)
  }, [])

  // Handle like
  const handleLike = useCallback((video: Video) => {
    if (!isApiMode) {
      // Mock mode: update local state
      setVideos((prev) =>
        prev.map((v) =>
          v.id === video.id
            ? {
                ...v,
                isLiked: !v.isLiked,
                stats: {
                  ...v.stats,
                  likes: v.isLiked ? v.stats.likes - 1 : v.stats.likes + 1,
                },
              }
            : v
        )
      )
    }

    const isLiked = !video.isLiked
    showToast(isLiked ? '❤️ Đã thích video' : '💔 Đã bỏ thích', isLiked ? 'success' : 'warning')
  }, [isApiMode, showToast])

  // Handle comment
  const handleComment = useCallback((_video: Video) => {
    setCommentSheetOpen(true)
  }, [])

  // Handle share
  const handleShare = useCallback((_video: Video) => {
    setShareSheetOpen(true)
  }, [])

  // Handle author click
  const handleAuthorClick = useCallback((video: Video) => {
    showToast(`👤 Đang xem profile @${video.author.username}`, 'default')
  }, [showToast])

  const feedProps = useMemo(() => ({
    onVideoChange: handleVideoChange,
    onLike: handleLike,
    onComment: handleComment,
    onShare: handleShare,
    onAuthorClick: handleAuthorClick,
    transitionDuration: 300,
    swipeThreshold: 50,
    velocityThreshold: 0.3,
    hapticEnabled: true,
  }), [handleVideoChange, handleLike, handleComment, handleShare, handleAuthorClick])

  // Pool configuration
  const poolConfig = useMemo(() => ({
    maxSlots: 5,
    preloadBufferTarget: 5,
    activeBufferTarget: 30,
  }), [])

  return (
    <div className="min-h-screen bg-xhub-reel-bg">
      <Navigation />

      {/* Video Feed - Switch between mock and API mode */}
      {isApiMode ? (
        // API Mode: Use ConnectedVideoFeed with pooling prop
        <ConnectedVideoFeed
          ref={feedRef}
          config={xhubReelConfig}
          pageSize={10}
          pooling={usePooledFeed}
          forceHLSJS={forceHLSJS}
          poolConfig={poolConfig}
          {...feedProps}
        />
      ) : usePooledFeed ? (
        // Mock Mode with Pooling: Use PooledVideoFeed
        <PooledVideoFeed
          ref={feedRef}
          videos={videos}
          forceHLSJS={forceHLSJS}
          poolConfig={poolConfig}
          {...feedProps}
        />
      ) : (
        // Mock Mode without Pooling: Use VideoFeed
        <VideoFeed
          ref={feedRef}
          videos={videos}
          {...feedProps}
        />
      )}

      {/* Comment Sheet */}
      <CommentSheet
        isOpen={commentSheetOpen}
        onClose={() => setCommentSheetOpen(false)}
        comments={selectedVideoComments}
        totalCount={selectedVideoComments.length}
        onSubmit={(text) => {
          showToast(`💬 Đã gửi: ${text}`, 'success')
        }}
        onLikeComment={(_id) => {
          // Like comment action
        }}
        onLoadMore={() => Promise.resolve()}
        hasMore={false}
        isLoading={false}
      />

      {/* Share Sheet */}
      <ShareSheet
        isOpen={shareSheetOpen}
        onClose={() => setShareSheetOpen(false)}
        videoUrl={currentVideo?.url || ''}
        videoTitle={currentVideo?.caption || ''}
        onCopyLink={() => showToast('✓ Đã copy link!', 'success')}
        onNativeShare={() => showToast('✓ Đã chia sẻ!', 'success')}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        variant={toastVariant}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* Drag Constraints Container */}
      <div
        ref={constraintsRef}
        className="fixed inset-0 z-40 pointer-events-none"
      />

      {/* Mode Indicator - Draggable & Collapsible */}
      <motion.div
        drag
        dragControls={dragControls}
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={constraintsRef}
        initial={{ x: 16, y: 160 }}
        className="fixed z-40 touch-none pointer-events-auto"
        style={{ top: 0, left: 0 }}
      >
        <div className="xhub-reel-glass rounded-xl overflow-hidden max-w-[260px]">
          {/* Header - Always visible, acts as drag handle */}
          <div
            className="flex items-center gap-2 px-4 py-3 cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <GripVertical className="w-3.5 h-3.5 text-xhub-reel-text-muted" />
            {isApiMode ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-xhub-reel-text-muted" />
            )}
            <span className="text-xs font-medium text-xhub-reel-text">
              {isApiMode ? 'API Mode' : 'Mock Mode'}
            </span>
            <div className="ml-auto flex items-center gap-1">
              <Link
                href="/settings"
                className="p-1 rounded hover:bg-xhub-reel-surface transition-colors"
                title="Settings"
                onClick={(e) => e.stopPropagation()}
              >
                <Settings className="w-3.5 h-3.5 text-xhub-reel-text-muted" />
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsPanelCollapsed(!isPanelCollapsed)
                }}
                className="p-1 rounded hover:bg-xhub-reel-surface transition-colors"
                title={isPanelCollapsed ? 'Mở rộng' : 'Thu gọn'}
              >
                {isPanelCollapsed ? (
                  <ChevronDown className="w-3.5 h-3.5 text-xhub-reel-text-muted" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5 text-xhub-reel-text-muted" />
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Content */}
          <motion.div
            initial={false}
            animate={{
              height: isPanelCollapsed ? 0 : 'auto',
              opacity: isPanelCollapsed ? 0 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3">
              {isApiMode && baseUrl && (
                <div className="text-xs text-xhub-reel-text-muted truncate">
                  {baseUrl}
                </div>
              )}
              <div className="text-xs text-xhub-reel-text-secondary mt-1">
                {currentVideo?.author.displayName || 'Video'} •{' '}
                {feedRef.current ? `${feedRef.current.activeIndex + 1}/${feedRef.current.totalSlides}` : '1/?'}
              </div>

              {/* Pool Controls */}
              <div className="mt-3 pt-3 border-t border-xhub-reel-surface space-y-2">
                <button
                  onClick={() => setUsePooledFeed(!usePooledFeed)}
                  className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs transition-colors ${
                    usePooledFeed
                      ? 'bg-xhub-reel-accent/20 text-xhub-reel-accent'
                      : 'bg-xhub-reel-surface text-xhub-reel-text-muted'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Engine Pool: {usePooledFeed ? 'ON' : 'OFF'}</span>
                </button>

                {usePooledFeed && (
                  <button
                    onClick={() => setForceHLSJS(!forceHLSJS)}
                    className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs transition-colors ${
                      forceHLSJS
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-xhub-reel-surface text-xhub-reel-text-muted'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 text-center">⚙️</span>
                    <span>Force HLS.js: {forceHLSJS ? 'ON' : 'Auto'}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Instructions - Bottom Center */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="xhub-reel-glass rounded-full px-6 py-3 animate-xhub-reel-fade-in">
          <p className="text-sm text-xhub-reel-text-secondary text-center whitespace-nowrap">
            ⬆️ Vuốt lên/xuống để chuyển video • 👆 Tap để pause • 👆👆 Double-tap để like
          </p>
        </div>
      </div>
    </div>
  )
}
