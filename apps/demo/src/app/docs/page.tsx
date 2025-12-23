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
    name: '@vortex/core',
    description: 'Core logic, types, stores, và utilities',
    exports: ['Types', 'Stores (Zustand)', 'Hooks', 'Utils', 'Constants', 'Styles'],
    icon: Box,
  },
  {
    name: '@vortex/player',
    description: 'Video player components và logic',
    exports: ['VideoPlayer', 'Timeline', 'SeekPreview', 'Controls', 'usePlayer'],
    icon: Play,
  },
  {
    name: '@vortex/feed',
    description: 'Virtualized video feed với gesture navigation',
    exports: ['VideoFeed', 'VideoFeedItem', 'VideoOverlay', 'ConnectedVideoFeed'],
    icon: Layers,
  },
  {
    name: '@vortex/gestures',
    description: 'Touch-optimized gesture system',
    exports: ['useVideoGestures', 'useTapGestures', 'useSwipe', 'useLongPress', 'useSeekDrag'],
    icon: Hand,
  },
  {
    name: '@vortex/ui',
    description: 'UI components theo Vortex Design System',
    exports: ['Button', 'ActionBar', 'BottomSheet', 'Toast', 'CommentSheet', 'ShareSheet'],
    icon: Palette,
  },
  {
    name: '@vortex/embed',
    description: 'Embeddable video widget cho websites',
    exports: ['VortexEmbed', 'createVortexEmbed'],
    icon: Code2,
  },
]

const quickStartSteps = [
  {
    step: 1,
    title: 'Install packages',
    code: `pnpm add @vortex/core @vortex/player @vortex/feed @vortex/ui @vortex/gestures`,
  },
  {
    step: 2,
    title: 'Import components',
    code: `import { VideoFeed } from '@vortex/feed'
import { VideoPlayer } from '@vortex/player'
import { ActionBar, Toast } from '@vortex/ui'`,
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
    <div className="min-h-screen bg-vortex-bg">
      <Navigation />

      {/* Page Header */}
      <div className="sticky top-0 z-30 pt-4 px-6 pb-4 vortex-glass">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-vortex-text">Documentation</h1>
          <p className="text-sm text-vortex-text-muted">
            Getting started với VortexStream packages
          </p>
        </div>
      </div>

      <main className="px-6 pb-32 pt-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Quick Start */}
          <section>
            <h2 className="text-xl font-semibold text-vortex-text mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-vortex-accent" />
              Quick Start
            </h2>

            <div className="space-y-4">
              {quickStartSteps.map((item) => (
                <div key={item.step} className="vortex-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-vortex-accent flex items-center justify-center text-white font-bold text-sm">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-vortex-text">{item.title}</h3>
                  </div>
                  <pre className="p-4 rounded-lg bg-vortex-surface-elevated overflow-x-auto">
                    <code className="text-sm font-mono text-vortex-text-secondary">
                      {item.code}
                    </code>
                  </pre>
                </div>
              ))}
            </div>
          </section>

          {/* Packages */}
          <section>
            <h2 className="text-xl font-semibold text-vortex-text mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-vortex-accent" />
              Packages
            </h2>

            <div className="grid gap-4">
              {packages.map((pkg) => {
                const Icon = pkg.icon
                return (
                  <div key={pkg.name} className="vortex-card">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-vortex-accent/10 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-vortex-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-vortex-text mb-1 font-mono">
                          {pkg.name}
                        </h3>
                        <p className="text-sm text-vortex-text-secondary mb-3">
                          {pkg.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {pkg.exports.map((exp) => (
                            <span
                              key={exp}
                              className="px-2 py-1 rounded text-xs bg-vortex-surface-elevated text-vortex-text-muted"
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
            <h2 className="text-xl font-semibold text-vortex-text mb-6 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-vortex-accent" />
              Code Examples
            </h2>

            <div className="space-y-6">
              {/* Video Feed Example */}
              <div className="vortex-card">
                <h3 className="font-semibold text-vortex-text mb-4">Basic Video Feed</h3>
                <pre className="p-4 rounded-lg bg-vortex-surface-elevated overflow-x-auto text-sm">
                  <code className="font-mono text-vortex-text-secondary">{`'use client'

import { useState } from 'react'
import { VideoFeed } from '@vortex/feed'
import { CommentSheet, ShareSheet, Toast } from '@vortex/ui'
import type { Video } from '@vortex/core'

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
              <div className="vortex-card">
                <h3 className="font-semibold text-vortex-text mb-4">Single Video Player</h3>
                <pre className="p-4 rounded-lg bg-vortex-surface-elevated overflow-x-auto text-sm">
                  <code className="font-mono text-vortex-text-secondary">{`'use client'

import { useRef } from 'react'
import { VideoPlayer, Timeline, type VideoPlayerRef } from '@vortex/player'
import { PlayPauseOverlay, ActionBar } from '@vortex/ui'
import { useVideoGestures } from '@vortex/gestures'

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
              <div className="vortex-card">
                <h3 className="font-semibold text-vortex-text mb-4">Custom Gestures</h3>
                <pre className="p-4 rounded-lg bg-vortex-surface-elevated overflow-x-auto text-sm">
                  <code className="font-mono text-vortex-text-secondary">{`import {
  useVideoGestures,
  useTapGestures,
  useLongPress,
  useVerticalSwipe,
  useSeekDrag,
} from '@vortex/gestures'

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
            <h2 className="text-xl font-semibold text-vortex-text mb-6 flex items-center gap-2">
              <Book className="w-5 h-5 text-vortex-accent" />
              Demo Pages
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/feed"
                className="vortex-card group hover:border-vortex-accent vortex-transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-vortex-text group-hover:text-vortex-accent">
                      Video Feed Demo
                    </h3>
                    <p className="text-sm text-vortex-text-muted">
                      Full-featured video feed với gestures
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-vortex-text-muted group-hover:text-vortex-accent" />
                </div>
              </Link>

              <Link
                href="/player"
                className="vortex-card group hover:border-vortex-accent vortex-transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-vortex-text group-hover:text-vortex-accent">
                      Single Player Demo
                    </h3>
                    <p className="text-sm text-vortex-text-muted">
                      Standalone video player
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-vortex-text-muted group-hover:text-vortex-accent" />
                </div>
              </Link>

              <Link
                href="/components"
                className="vortex-card group hover:border-vortex-accent vortex-transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-vortex-text group-hover:text-vortex-accent">
                      UI Components
                    </h3>
                    <p className="text-sm text-vortex-text-muted">
                      All UI components showcase
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-vortex-text-muted group-hover:text-vortex-accent" />
                </div>
              </Link>

              <Link
                href="/gestures"
                className="vortex-card group hover:border-vortex-accent vortex-transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-vortex-text group-hover:text-vortex-accent">
                      Gestures Demo
                    </h3>
                    <p className="text-sm text-vortex-text-muted">
                      Interactive gesture examples
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-vortex-text-muted group-hover:text-vortex-accent" />
                </div>
              </Link>

              <Link
                href="/design"
                className="vortex-card group hover:border-vortex-accent vortex-transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-vortex-text group-hover:text-vortex-accent">
                      Design System
                    </h3>
                    <p className="text-sm text-vortex-text-muted">
                      Colors, typography, spacing
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-vortex-text-muted group-hover:text-vortex-accent" />
                </div>
              </Link>
            </div>
          </section>

          {/* Development */}
          <section>
            <h2 className="text-xl font-semibold text-vortex-text mb-6 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-vortex-accent" />
              Development
            </h2>

            <div className="vortex-card space-y-6">
              <div>
                <h3 className="font-medium text-vortex-text mb-2">Run Demo App</h3>
                <pre className="p-3 rounded-lg bg-vortex-surface-elevated">
                  <code className="text-sm font-mono text-vortex-text-secondary">
                    pnpm --filter vortex-demo dev
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="font-medium text-vortex-text mb-2">Build All Packages</h3>
                <pre className="p-3 rounded-lg bg-vortex-surface-elevated">
                  <code className="text-sm font-mono text-vortex-text-secondary">
                    pnpm build
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="font-medium text-vortex-text mb-2">Run Tests</h3>
                <pre className="p-3 rounded-lg bg-vortex-surface-elevated">
                  <code className="text-sm font-mono text-vortex-text-secondary">
                    pnpm test
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="font-medium text-vortex-text mb-2">Lint & Type Check</h3>
                <pre className="p-3 rounded-lg bg-vortex-surface-elevated">
                  <code className="text-sm font-mono text-vortex-text-secondary">
                    pnpm lint && pnpm typecheck
                  </code>
                </pre>
              </div>
            </div>
          </section>

          {/* Performance */}
          <section className="vortex-card">
            <h2 className="text-xl font-semibold text-vortex-text mb-6">Performance Targets</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-vortex-text mb-3">Bundle Size</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-vortex-border">
                      <td className="py-2 text-vortex-text-muted">@vortex/core</td>
                      <td className="py-2 text-right text-vortex-text">&lt; 5KB</td>
                    </tr>
                    <tr className="border-b border-vortex-border">
                      <td className="py-2 text-vortex-text-muted">@vortex/player</td>
                      <td className="py-2 text-right text-vortex-text">&lt; 70KB</td>
                    </tr>
                    <tr className="border-b border-vortex-border">
                      <td className="py-2 text-vortex-text-muted">@vortex/ui</td>
                      <td className="py-2 text-right text-vortex-text">&lt; 15KB</td>
                    </tr>
                    <tr className="border-b border-vortex-border">
                      <td className="py-2 text-vortex-text-muted">@vortex/feed</td>
                      <td className="py-2 text-right text-vortex-text">&lt; 8KB</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-vortex-text-muted font-medium">Total</td>
                      <td className="py-2 text-right text-vortex-accent font-bold">&lt; 150KB</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h3 className="font-medium text-vortex-text mb-3">Core Web Vitals</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-vortex-border">
                      <td className="py-2 text-vortex-text-muted">LCP</td>
                      <td className="py-2 text-right text-vortex-text">&lt; 1.5s</td>
                    </tr>
                    <tr className="border-b border-vortex-border">
                      <td className="py-2 text-vortex-text-muted">TTI</td>
                      <td className="py-2 text-right text-vortex-text">&lt; 2s</td>
                    </tr>
                    <tr className="border-b border-vortex-border">
                      <td className="py-2 text-vortex-text-muted">Video First Frame</td>
                      <td className="py-2 text-right text-vortex-text">&lt; 500ms</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-vortex-text-muted">Scroll</td>
                      <td className="py-2 text-right text-vortex-accent font-bold">60fps</td>
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

