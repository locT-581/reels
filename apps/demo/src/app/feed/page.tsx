'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import { VideoFeed, ConnectedVideoFeed, type VideoFeedRef } from '@xhub-reel/feed'
import type { Video } from '@xhub-reel/core'
import { CommentSheet, ShareSheet, Toast } from '@xhub-reel/ui'
import { mockVideos, mockComments } from '@/lib/mock-data'
import { useDemoConfig, toXHubReelConfig } from '@/lib/demo-config'
import { Navigation } from '@/components/Navigation'
import { Settings, Wifi, WifiOff } from 'lucide-react'
import Link from 'next/link'

export default function FeedPage() {
  const feedRef = useRef<VideoFeedRef>(null)

  const mode = useDemoConfig((state) => state.mode)
  const baseUrl = useDemoConfig((state) => state.baseUrl)
  const apiKey = useDemoConfig((state) => state.apiKey)
  const accessToken = useDemoConfig((state) => state.accessToken)
  const refreshToken = useDemoConfig((state) => state.refreshToken)
  const endpoints = useDemoConfig((state) => state.endpoints)
  const debugMode = useDemoConfig((state) => state.debugMode)

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

  return (
    <div className="min-h-screen bg-xhub-reel-bg">
      <Navigation />

      {/* Video Feed - Switch between mock and API mode */}
      {isApiMode ? (
        <ConnectedVideoFeed
          ref={feedRef}
          config={xhubReelConfig}
          pageSize={10}
          {...feedProps}
        />
      ) : (
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

      {/* Mode Indicator - Top Left */}
      <div className="fixed top-4 left-4 z-40 pointer-events-none">
        <div className="xhub-reel-glass rounded-xl px-4 py-3 max-w-[220px] pointer-events-auto">
          <div className="flex items-center gap-2 mb-2">
            {isApiMode ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-xhub-reel-text-muted" />
            )}
            <span className="text-xs font-medium text-xhub-reel-text">
              {isApiMode ? 'API Mode' : 'Mock Mode'}
            </span>
            <Link
              href="/settings"
              className="ml-auto p-1 rounded hover:bg-xhub-reel-surface transition-colors"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5 text-xhub-reel-text-muted" />
            </Link>
          </div>
          {isApiMode && baseUrl && (
            <div className="text-xs text-xhub-reel-text-muted truncate">
              {baseUrl}
            </div>
          )}
          <div className="text-xs text-xhub-reel-text-secondary mt-1">
            {currentVideo?.author.displayName || 'Video'} •{' '}
            {feedRef.current ? `${feedRef.current.activeIndex + 1}/${feedRef.current.totalSlides}` : '1/?'}
          </div>
        </div>
      </div>

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
