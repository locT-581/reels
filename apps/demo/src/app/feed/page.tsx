'use client'

import { useState, useCallback, useRef } from 'react'
import { VideoFeed, type VideoFeedRef } from '@vortex/feed'
import type { Video } from '@vortex/core'
import { CommentSheet, ShareSheet, Toast } from '@vortex/ui'
import { mockVideos, mockComments } from '@/lib/mock-data'
import { Navigation } from '@/components/Navigation'

export default function FeedPage() {
  const feedRef = useRef<VideoFeedRef>(null)
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

    const isLiked = !video.isLiked
    showToast(isLiked ? '❤️ Đã thích video' : '💔 Đã bỏ thích', isLiked ? 'success' : 'warning')
  }, [showToast])

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

  return (
    <div className="min-h-screen bg-vortex-bg">
      <Navigation />

      {/* Video Feed */}
      <VideoFeed
        ref={feedRef}
        videos={videos}
        onVideoChange={handleVideoChange}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onAuthorClick={handleAuthorClick}
        transitionDuration={300}
        swipeThreshold={50}
        velocityThreshold={0.3}
        hapticEnabled={true}
      />

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

      {/* Video Info Overlay - Top Left */}
      <div className="fixed top-4 left-4 z-40 pointer-events-none">
        <div className="vortex-glass rounded-xl px-4 py-3 max-w-[200px]">
          <div className="text-xs text-vortex-text-muted mb-1">Đang xem</div>
          <div className="text-sm font-medium text-vortex-text truncate">
            {currentVideo?.author.displayName || 'Video'}
          </div>
          <div className="text-xs text-vortex-text-secondary mt-1">
            {feedRef.current ? `${feedRef.current.activeIndex + 1} / ${feedRef.current.totalSlides}` : '1 / ?'}
          </div>
        </div>
      </div>

      {/* Instructions - Bottom Center */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="vortex-glass rounded-full px-6 py-3 animate-vortex-fade-in">
          <p className="text-sm text-vortex-text-secondary text-center whitespace-nowrap">
            ⬆️ Vuốt lên/xuống để chuyển video • 👆 Tap để pause • 👆👆 Double-tap để like
          </p>
        </div>
      </div>
    </div>
  )
}
