'use client'

import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import {
  Book,
  Package,
  Code2,
  Zap,
  FileCode,
  ExternalLink,
  Terminal,
  Layers,
  Play,
  Hand,
  Palette,
  Box,
} from 'lucide-react'

const packages = [
  {
    name: '@xhub-reel/core',
    description: 'Core logic, types, stores, và utilities',
    exports: ['Types', 'Stores (Zustand)', 'Hooks', 'Utils', 'Constants', 'Styles'],
    icon: Box,
  },
  {
    name: '@xhub-reel/player',
    description: 'Video player components và logic',
    exports: ['VideoPlayer', 'Timeline', 'SeekPreview', 'Controls', 'usePlayer'],
    icon: Play,
  },
  {
    name: '@xhub-reel/feed',
    description: 'Virtualized video feed với gesture navigation',
    exports: ['VideoFeed', 'VideoFeedItem', 'VideoOverlay', 'ConnectedVideoFeed'],
    icon: Layers,
  },
  {
    name: '@xhub-reel/gestures',
    description: 'Touch-optimized gesture system',
    exports: ['useVideoGestures', 'useTapGestures', 'useSwipe', 'useLongPress', 'useSeekDrag'],
    icon: Hand,
  },
  {
    name: '@xhub-reel/ui',
    description: 'UI components theo XHubReel design System',
    exports: ['Button', 'ActionBar', 'BottomSheet', 'Toast', 'CommentSheet', 'ShareSheet'],
    icon: Palette,
  },
  {
    name: '@xhub-reel/embed',
    description: 'Embeddable video widget cho websites',
    exports: ['XHubReelEmbed', 'createXHubReelEmbed'],
    icon: Code2,
  },
]

const quickStartSteps = [
  {
    step: 1,
    title: 'Install packages',
    code: `pnpm add @xhub-reel/core @xhub-reel/player @xhub-reel/feed @xhub-reel/ui @xhub-reel/gestures`,
  },
  {
    step: 2,
    title: 'Import components',
    code: `import { VideoFeed } from '@xhub-reel/feed'
import { VideoPlayer } from '@xhub-reel/player'
import { ActionBar, Toast } from '@xhub-reel/ui'`,
  },
  {
    step: 3,
    title: 'Use in your app',
    code: `export default function App() {
  return (
    <VideoFeed
      videos={videos}
      onLike={handleLike}
      onComment={handleComment}
      onShare={handleShare}
    />
  )
}`,
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-xhub-reel-bg">
      <Navigation />

      {/* Page Header */}
      <div className="sticky top-0 z-30 pt-4 px-6 pb-4 xhub-reel-glass">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-xhub-reel-text">Documentation</h1>
          <p className="text-sm text-xhub-reel-text-muted">
            Getting started với XHubReel packages
          </p>
        </div>
      </div>

      <main className="px-6 pb-32 pt-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Quick Start */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-xhub-reel-accent" />
              Quick Start
            </h2>

            <div className="space-y-4">
              {quickStartSteps.map((item) => (
                <div key={item.step} className="xhub-reel-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-xhub-reel-accent flex items-center justify-center text-white font-bold text-sm">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-xhub-reel-text">{item.title}</h3>
                  </div>
                  <pre className="p-4 rounded-lg bg-xhub-reel-surface-elevated overflow-x-auto">
                    <code className="text-sm font-mono text-xhub-reel-text-secondary">
                      {item.code}
                    </code>
                  </pre>
                </div>
              ))}
            </div>
          </section>

          {/* Packages */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-xhub-reel-accent" />
              Packages
            </h2>

            <div className="grid gap-4">
              {packages.map((pkg) => {
                const Icon = pkg.icon
                return (
                  <div key={pkg.name} className="xhub-reel-card">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-xhub-reel-accent/10 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-xhub-reel-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-xhub-reel-text mb-1 font-mono">
                          {pkg.name}
                        </h3>
                        <p className="text-sm text-xhub-reel-text-secondary mb-3">
                          {pkg.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {pkg.exports.map((exp) => (
                            <span
                              key={exp}
                              className="px-2 py-1 rounded text-xs bg-xhub-reel-surface-elevated text-xhub-reel-text-muted"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Code Examples */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-xhub-reel-accent" />
              Code Examples
            </h2>

            <div className="space-y-6">
              {/* Video Feed Example */}
              <div className="xhub-reel-card">
                <h3 className="font-semibold text-xhub-reel-text mb-4">Basic Video Feed</h3>
                <pre className="p-4 rounded-lg bg-xhub-reel-surface-elevated overflow-x-auto text-sm">
                  <code className="font-mono text-xhub-reel-text-secondary">{`'use client'

import { useState } from 'react'
import { VideoFeed } from '@xhub-reel/feed'
import { CommentSheet, ShareSheet, Toast } from '@xhub-reel/ui'
import type { Video } from '@xhub-reel/core'

export default function FeedPage() {
  const [videos, setVideos] = useState<Video[]>(mockVideos)
  const [commentOpen, setCommentOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  const handleLike = (video: Video) => {
    setVideos((prev) =>
      prev.map((v) =>
        v.id === video.id
          ? { ...v, isLiked: !v.isLiked }
          : v
      )
    )
  }

  return (
    <>
      <VideoFeed
        videos={videos}
        onLike={handleLike}
        onComment={() => setCommentOpen(true)}
        onShare={() => setShareOpen(true)}
      />
      <CommentSheet isOpen={commentOpen} onClose={() => setCommentOpen(false)} />
      <ShareSheet isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  )
}`}</code>
                </pre>
              </div>

              {/* Single Player Example */}
              <div className="xhub-reel-card">
                <h3 className="font-semibold text-xhub-reel-text mb-4">Single Video Player</h3>
                <pre className="p-4 rounded-lg bg-xhub-reel-surface-elevated overflow-x-auto text-sm">
                  <code className="font-mono text-xhub-reel-text-secondary">{`'use client'

import { useRef } from 'react'
import { VideoPlayer, Timeline, type VideoPlayerRef } from '@xhub-reel/player'
import { PlayPauseOverlay, ActionBar } from '@xhub-reel/ui'
import { useVideoGestures } from '@xhub-reel/gestures'

export default function PlayerPage() {
  const playerRef = useRef<VideoPlayerRef>(null)

  const gestureBindings = useVideoGestures({
    onSingleTap: () => playerRef.current?.togglePlay(),
    onDoubleTap: (zone) => {
      if (zone === 'left') playerRef.current?.seekBackward(10)
      if (zone === 'right') playerRef.current?.seekForward(10)
      if (zone === 'center') handleLike()
    },
    onLongPress: () => showContextMenu(),
  })

  return (
    <div {...gestureBindings()}>
      <VideoPlayer
        ref={playerRef}
        video={video}
        autoPlay={true}
        muted={true}
        loop={true}
      >
        <PlayPauseOverlay />
        <ActionBar />
        <Timeline />
      </VideoPlayer>
    </div>
  )
}`}</code>
                </pre>
              </div>

              {/* Gestures Example */}
              <div className="xhub-reel-card">
                <h3 className="font-semibold text-xhub-reel-text mb-4">Custom Gestures</h3>
                <pre className="p-4 rounded-lg bg-xhub-reel-surface-elevated overflow-x-auto text-sm">
                  <code className="font-mono text-xhub-reel-text-secondary">{`import {
  useVideoGestures,
  useTapGestures,
  useLongPress,
  useVerticalSwipe,
  useSeekDrag,
} from '@xhub-reel/gestures'

// Combined video gestures
const gestureBindings = useVideoGestures({
  onSingleTap: handlePlayPause,
  onDoubleTap: (zone, position) => {
    if (zone === 'center') showHeart(position)
    else seek(zone === 'left' ? -10 : 10)
  },
  onLongPress: showContextMenu,
})

// Long press with progress
const { bind, isPressed } = useLongPress({
  onLongPress: () => console.log('Long press!'),
  onPressProgress: (progress) => setProgress(progress),
  threshold: 500,
})

// Vertical swipe for feed navigation
const { bind: swipeBind } = useVerticalSwipe({
  onSwipeUp: nextVideo,
  onSwipeDown: prevVideo,
  onSwipeProgress: (progress, direction, movement) => {
    setOffset(movement)
  },
})

// Seek drag for timeline
const { bind: seekBind, isSeeking } = useSeekDrag({
  onSeekProgress: setSeekProgress,
  onSeekEnd: (progress) => player.seek(progress * duration),
})`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Demo Pages */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6 flex items-center gap-2">
              <Book className="w-5 h-5 text-xhub-reel-accent" />
              Demo Pages
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/feed"
                className="xhub-reel-card group hover:border-xhub-reel-accent xhub-reel-transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-xhub-reel-text group-hover:text-xhub-reel-accent">
                      Video Feed Demo
                    </h3>
                    <p className="text-sm text-xhub-reel-text-muted">
                      Full-featured video feed với gestures
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-xhub-reel-text-muted group-hover:text-xhub-reel-accent" />
                </div>
              </Link>

              <Link
                href="/player"
                className="xhub-reel-card group hover:border-xhub-reel-accent xhub-reel-transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-xhub-reel-text group-hover:text-xhub-reel-accent">
                      Single Player Demo
                    </h3>
                    <p className="text-sm text-xhub-reel-text-muted">
                      Standalone video player
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-xhub-reel-text-muted group-hover:text-xhub-reel-accent" />
                </div>
              </Link>

              <Link
                href="/components"
                className="xhub-reel-card group hover:border-xhub-reel-accent xhub-reel-transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-xhub-reel-text group-hover:text-xhub-reel-accent">
                      UI Components
                    </h3>
                    <p className="text-sm text-xhub-reel-text-muted">
                      All UI components showcase
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-xhub-reel-text-muted group-hover:text-xhub-reel-accent" />
                </div>
              </Link>

              <Link
                href="/gestures"
                className="xhub-reel-card group hover:border-xhub-reel-accent xhub-reel-transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-xhub-reel-text group-hover:text-xhub-reel-accent">
                      Gestures Demo
                    </h3>
                    <p className="text-sm text-xhub-reel-text-muted">
                      Interactive gesture examples
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-xhub-reel-text-muted group-hover:text-xhub-reel-accent" />
                </div>
              </Link>

              <Link
                href="/design"
                className="xhub-reel-card group hover:border-xhub-reel-accent xhub-reel-transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-xhub-reel-text group-hover:text-xhub-reel-accent">
                      Design System
                    </h3>
                    <p className="text-sm text-xhub-reel-text-muted">
                      Colors, typography, spacing
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-xhub-reel-text-muted group-hover:text-xhub-reel-accent" />
                </div>
              </Link>
            </div>
          </section>

          {/* Development */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-xhub-reel-accent" />
              Development
            </h2>

            <div className="xhub-reel-card space-y-6">
              <div>
                <h3 className="font-medium text-xhub-reel-text mb-2">Run Demo App</h3>
                <pre className="p-3 rounded-lg bg-xhub-reel-surface-elevated">
                  <code className="text-sm font-mono text-xhub-reel-text-secondary">
                    pnpm --filter xhub-reel-demo dev
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="font-medium text-xhub-reel-text mb-2">Build All Packages</h3>
                <pre className="p-3 rounded-lg bg-xhub-reel-surface-elevated">
                  <code className="text-sm font-mono text-xhub-reel-text-secondary">
                    pnpm build
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="font-medium text-xhub-reel-text mb-2">Run Tests</h3>
                <pre className="p-3 rounded-lg bg-xhub-reel-surface-elevated">
                  <code className="text-sm font-mono text-xhub-reel-text-secondary">
                    pnpm test
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="font-medium text-xhub-reel-text mb-2">Lint & Type Check</h3>
                <pre className="p-3 rounded-lg bg-xhub-reel-surface-elevated">
                  <code className="text-sm font-mono text-xhub-reel-text-secondary">
                    pnpm lint && pnpm typecheck
                  </code>
                </pre>
              </div>
            </div>
          </section>

          {/* Performance */}
          <section className="xhub-reel-card">
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6">Performance Targets</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-xhub-reel-text mb-3">Bundle Size</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-xhub-reel-border">
                      <td className="py-2 text-xhub-reel-text-muted">@xhub-reel/core</td>
                      <td className="py-2 text-right text-xhub-reel-text">&lt; 5KB</td>
                    </tr>
                    <tr className="border-b border-xhub-reel-border">
                      <td className="py-2 text-xhub-reel-text-muted">@xhub-reel/player</td>
                      <td className="py-2 text-right text-xhub-reel-text">&lt; 70KB</td>
                    </tr>
                    <tr className="border-b border-xhub-reel-border">
                      <td className="py-2 text-xhub-reel-text-muted">@xhub-reel/ui</td>
                      <td className="py-2 text-right text-xhub-reel-text">&lt; 15KB</td>
                    </tr>
                    <tr className="border-b border-xhub-reel-border">
                      <td className="py-2 text-xhub-reel-text-muted">@xhub-reel/feed</td>
                      <td className="py-2 text-right text-xhub-reel-text">&lt; 8KB</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-xhub-reel-text-muted font-medium">Total</td>
                      <td className="py-2 text-right text-xhub-reel-accent font-bold">&lt; 150KB</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="font-medium text-xhub-reel-text mb-3">Core Web Vitals</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-xhub-reel-border">
                      <td className="py-2 text-xhub-reel-text-muted">LCP</td>
                      <td className="py-2 text-right text-xhub-reel-text">&lt; 1.5s</td>
                    </tr>
                    <tr className="border-b border-xhub-reel-border">
                      <td className="py-2 text-xhub-reel-text-muted">TTI</td>
                      <td className="py-2 text-right text-xhub-reel-text">&lt; 2s</td>
                    </tr>
                    <tr className="border-b border-xhub-reel-border">
                      <td className="py-2 text-xhub-reel-text-muted">Video First Frame</td>
                      <td className="py-2 text-right text-xhub-reel-text">&lt; 500ms</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-xhub-reel-text-muted">Scroll</td>
                      <td className="py-2 text-right text-xhub-reel-accent font-bold">60fps</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

