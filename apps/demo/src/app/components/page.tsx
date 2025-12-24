'use client'

import { useState, useCallback } from 'react'
import {
  Button,
  Avatar,
  IconButton,
  Text,
  Counter,
  Marquee,
  Spinner,
  Toast,
  Skeleton,
  AvatarSkeleton,
  ThumbnailSkeleton,
  LikeButton,
  SaveButton,
  BottomSheet,
  Modal,
  ActionBar,
  PlayPauseOverlay,
  ContextMenu,
  PullToRefresh,
  DoubleTapHeart,
  useDoubleTapHeart,
  CommentSheet,
  ShareSheet,
} from '@xhub-reel/ui'
import {
  Play,
  Pause,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Settings,
  User,
  Bell,
  Search,
  Home,
} from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { mockComments, authors } from '@/lib/mock-data'

export default function ComponentsPage() {
  // Component states
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(12345)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPauseOverlay, setShowPauseOverlay] = useState(false)

  // Toast state
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVariant, setToastVariant] = useState<'default' | 'success' | 'error' | 'warning'>('default')

  // Sheet states
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [commentSheetOpen, setCommentSheetOpen] = useState(false)
  const [shareSheetOpen, setShareSheetOpen] = useState(false)
  const [contextMenuOpen, setContextMenuOpen] = useState(false)

  // Pull to refresh
  const [refreshing, setRefreshing] = useState(false)

  // Double tap heart
  const { isShowing: showHeart, position: heartPosition, showHeart: triggerHeart } = useDoubleTapHeart()

  const showToast = useCallback((message: string, variant: 'default' | 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(message)
    setToastVariant(variant)
    setToastVisible(true)
  }, [])

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
    showToast(isLiked ? '💔 Unliked' : '❤️ Liked!', isLiked ? 'warning' : 'success')
  }, [isLiked, showToast])

  const handleSave = useCallback(() => {
    setIsSaved(!isSaved)
    showToast(isSaved ? '🗑️ Unsaved' : '📌 Saved!', isSaved ? 'warning' : 'success')
  }, [isSaved, showToast])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setRefreshing(false)
    showToast('🔄 Refreshed!', 'success')
  }, [showToast])

  const handleDoubleTapDemo = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    triggerHeart(x, y)
    showToast('❤️ Double tapped!', 'success')
  }, [triggerHeart, showToast])

  return (
    <div className="min-h-screen bg-xhub-reel-bg">
      <Navigation />

      {/* Page Header */}
      <div className="sticky top-0 z-30 pt-4 px-6 pb-4 xhub-reel-glass">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-xhub-reel-text">UI Components</h1>
          <p className="text-sm text-xhub-reel-text-muted">
            XHubReel design System components showcase
          </p>
        </div>
      </div>

      <main className="px-6 pb-32 pt-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Buttons Section */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6">Buttons</h2>
            <div className="xhub-reel-card space-y-6">
              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Button Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Button Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Icon Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <IconButton icon={<Play className="w-5 h-5" />} aria-label="Play" onClick={() => showToast('Play clicked')} />
                  <IconButton icon={<Pause className="w-5 h-5" />} aria-label="Pause" onClick={() => showToast('Pause clicked')} />
                  <IconButton icon={<Heart className="w-5 h-5" />} aria-label="Like" variant="ghost" onClick={() => showToast('Like clicked')} />
                  <IconButton icon={<MessageCircle className="w-5 h-5" />} aria-label="Comment" variant="ghost" onClick={() => showToast('Comment clicked')} />
                  <IconButton icon={<Share2 className="w-5 h-5" />} aria-label="Share" variant="ghost" onClick={() => showToast('Share clicked')} />
                </div>
              </div>
            </div>
          </section>

          {/* Interaction Components */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6">Interactions</h2>
            <div className="xhub-reel-card space-y-6">
              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Like Button</h3>
                <div className="flex items-center gap-4">
                  <LikeButton
                    isLiked={isLiked}
                    count={likeCount}
                    onLike={handleLike}
                    size="lg"
                  />
                  <span className="text-sm text-xhub-reel-text-secondary">
                    Click to {isLiked ? 'unlike' : 'like'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Save Button</h3>
                <div className="flex items-center gap-4">
                  <SaveButton
                    isSaved={isSaved}
                    onSave={handleSave}
                    size="lg"
                  />
                  <span className="text-sm text-xhub-reel-text-secondary">
                    Click to {isSaved ? 'unsave' : 'save'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Action Bar</h3>
                <div className="relative h-[400px] bg-linear-to-b from-xhub-reel-surface-elevated to-xhub-reel-surface rounded-xl overflow-hidden">
                  <ActionBar
                    likeCount={likeCount}
                    commentCount={8765}
                    shareCount={4321}
                    isLiked={isLiked}
                    onLike={handleLike}
                    onComment={() => setCommentSheetOpen(true)}
                    onShare={() => setShareSheetOpen(true)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Avatar & Profile */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6">Avatar & Profile</h2>
            <div className="xhub-reel-card space-y-6">
              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Avatar Sizes</h3>
                <div className="flex items-center gap-4">
                  <Avatar src={authors[0]?.avatar} alt="User" size="sm" />
                  <Avatar src={authors[1]?.avatar} alt="User" size="md" />
                  <Avatar src={authors[2]?.avatar} alt="User" size="lg" />
                  <Avatar src={authors[3]?.avatar} alt="User" size="xl" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Avatar with Border</h3>
                <div className="flex items-center gap-4">
                  <Avatar src={authors[0]?.avatar} alt="User" size="lg" showBorder />
                  <Avatar src={authors[1]?.avatar} alt="User" size="lg" showBorder borderColor="#FF2D55" />
                </div>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6">Typography</h2>
            <div className="xhub-reel-card space-y-6">
              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Text Variants</h3>
                <div className="space-y-2">
                  <Text variant="heading">Heading Text</Text>
                  <Text variant="title">Title Text</Text>
                  <Text variant="body">Body text - Lorem ipsum dolor sit amet</Text>
                  <Text variant="caption">Caption text - smaller details</Text>
                  <Text variant="label">Label text</Text>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Text Colors</h3>
                <div className="space-y-2">
                  <Text color="default">Default color</Text>
                  <Text color="secondary">Secondary color</Text>
                  <Text color="muted">Muted color</Text>
                  <Text color="accent">Accent color</Text>
                  <Text color="error">Error color</Text>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Counter Animation</h3>
                <div className="flex items-center gap-4">
                  <Counter value={likeCount} className="text-3xl font-bold text-xhub-reel-text" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setLikeCount((prev) => prev + 100)}>
                      +100
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setLikeCount((prev) => Math.max(0, prev - 100))}>
                      -100
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Marquee</h3>
                <div className="bg-xhub-reel-surface-elevated rounded-lg p-4">
                  <Marquee speed={30}>
                    🎵 This is a scrolling text - Lorem ipsum dolor sit amet, consectetur adipiscing elit. 🎶
                  </Marquee>
                </div>
              </div>
            </div>
          </section>

          {/* Loading States */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6">Loading States</h2>
            <div className="xhub-reel-card space-y-6">
              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Spinners</h3>
                <div className="flex items-center gap-6">
                  <Spinner size={16} />
                  <Spinner size={24} />
                  <Spinner size={32} />
                  <Spinner size={48} color="#8B5CF6" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Skeletons</h3>
                <div className="flex items-start gap-6">
                  <div className="space-y-2">
                    <AvatarSkeleton size="lg" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <ThumbnailSkeleton className="w-32 h-48 rounded-lg" />
                </div>
              </div>
            </div>
          </section>

          {/* Overlays */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6">Overlays</h2>
            <div className="xhub-reel-card space-y-6">
              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Play/Pause Overlay</h3>
                <div
                  className="relative h-[200px] bg-linear-to-b from-xhub-reel-surface-elevated to-xhub-reel-surface rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => {
                    setIsPlaying(!isPlaying)
                    setShowPauseOverlay(!isPlaying)
                    setTimeout(() => setShowPauseOverlay(false), 1500)
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-xhub-reel-text-muted">
                    Click to toggle play/pause
                  </div>
                  <PlayPauseOverlay
                    isPlaying={isPlaying}
                    show={showPauseOverlay}
                    size={64}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Double Tap Heart</h3>
                <div
                  className="relative h-[200px] bg-linear-to-b from-xhub-reel-surface-elevated to-xhub-reel-surface rounded-xl overflow-hidden cursor-pointer"
                  onDoubleClick={handleDoubleTapDemo}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-xhub-reel-text-muted">
                    Double click anywhere
                  </div>
                  <DoubleTapHeart
                    show={showHeart}
                    position={heartPosition}
                    size={100}
                    showParticles={true}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Sheets & Modals</h3>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => setBottomSheetOpen(true)}>Bottom Sheet</Button>
                  <Button variant="secondary" onClick={() => setModalOpen(true)}>Modal</Button>
                  <Button variant="secondary" onClick={() => setCommentSheetOpen(true)}>Comment Sheet</Button>
                  <Button variant="secondary" onClick={() => setShareSheetOpen(true)}>Share Sheet</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Context Menu */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6">Context Menu</h2>
            <div className="xhub-reel-card">
              <div className="flex items-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setContextMenuOpen(true)}
                >
                  <MoreHorizontal className="w-5 h-5 mr-2" />
                  Open Context Menu
                </Button>
              </div>
              <ContextMenu
                isOpen={contextMenuOpen}
                onClose={() => setContextMenuOpen(false)}
                onSaveVideo={() => showToast('Video saved!')}
                onCopyLink={() => showToast('Link copied!')}
                onNotInterested={() => showToast('Marked as not interested')}
                onHideAuthor={() => showToast('Author hidden')}
                onReport={() => showToast('Reported', 'error')}
              />
            </div>
          </section>

          {/* Pull to Refresh */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6">Pull to Refresh</h2>
            <div className="xhub-reel-card">
              <div className="h-[200px] overflow-hidden rounded-lg bg-xhub-reel-surface-elevated">
                <PullToRefresh onRefresh={handleRefresh} isLoading={refreshing}>
                  <div className="flex items-center justify-center h-full text-xhub-reel-text-muted">
                    Pull down to refresh (on mobile)
                  </div>
                </PullToRefresh>
              </div>
            </div>
          </section>

          {/* Navigation Icons */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6">Icons</h2>
            <div className="xhub-reel-card">
              <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-3">Common Icons (Lucide)</h3>
              <div className="flex flex-wrap gap-4">
                {[
                  { Icon: Home, name: 'Home' },
                  { Icon: Search, name: 'Search' },
                  { Icon: Bell, name: 'Bell' },
                  { Icon: User, name: 'User' },
                  { Icon: Settings, name: 'Settings' },
                  { Icon: Play, name: 'Play' },
                  { Icon: Pause, name: 'Pause' },
                  { Icon: Heart, name: 'Heart' },
                  { Icon: MessageCircle, name: 'Comment' },
                  { Icon: Share2, name: 'Share' },
                  { Icon: Bookmark, name: 'Bookmark' },
                  { Icon: MoreHorizontal, name: 'More' },
                ].map(({ Icon, name }) => (
                  <div key={name} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-xhub-reel-surface-elevated">
                    <Icon className="w-6 h-6 text-xhub-reel-text" />
                    <span className="text-xs text-xhub-reel-text-muted">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        title="Bottom Sheet Example"
      >
        <div className="px-4 pb-8 space-y-4">
          <p className="text-xhub-reel-text-secondary">
            This is a bottom sheet component with glassmorphism styling.
          </p>
          <div className="space-y-2">
            <Button fullWidth onClick={() => {
              setBottomSheetOpen(false)
              showToast('Action 1 clicked')
            }}>
              Action 1
            </Button>
            <Button fullWidth variant="secondary" onClick={() => {
              setBottomSheetOpen(false)
              showToast('Action 2 clicked')
            }}>
              Action 2
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Modal Example"
      >
        <div className="space-y-4">
          <p className="text-xhub-reel-text-secondary">
            This is a modal dialog with backdrop blur effect.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setModalOpen(false)
              showToast('Confirmed!')
            }}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* Comment Sheet */}
      <CommentSheet
        isOpen={commentSheetOpen}
        onClose={() => setCommentSheetOpen(false)}
        comments={mockComments}
        totalCount={mockComments.length}
        onSubmit={(text) => {
          showToast(`Comment: ${text}`)
        }}
        onLikeComment={(id) => {
          showToast(`Liked comment: ${id}`)
        }}
        onLoadMore={() => Promise.resolve()}
        hasMore={false}
        isLoading={false}
      />

      {/* Share Sheet */}
      <ShareSheet
        isOpen={shareSheetOpen}
        onClose={() => setShareSheetOpen(false)}
        videoUrl="https://xhubreel.app/video/123"
        videoTitle="Sample Video"
        onCopyLink={() => showToast('Link copied!')}
        onNativeShare={() => showToast('Shared!')}
      />

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
