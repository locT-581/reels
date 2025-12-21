'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import type { Video } from '@vortex/core'
import { usePlayerStore } from '@vortex/core'
import { VideoPlayer } from '@vortex/player'
import { useVideoGestures } from '@vortex/gestures'
import { DoubleTapHeart, useDoubleTapHeart, Text, Spinner } from '@vortex/ui'
import { Heart, MessageCircle, Share2, Bookmark, Music2, ChevronRight } from 'lucide-react'
import { mockVideos, generateMoreVideos } from './data/mock-videos'
import { AnimatePresence } from 'motion/react'

/**
 * VortexStream Example App - Simplified Demo
 */
export default function ExamplePage() {
  const [videos, setVideos] = useState<Video[]>(mockVideos)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const { isPlaying, isMuted, play, pause, toggleMute } = usePlayerStore()
  const currentVideo = videos[currentIndex]

  const [likedVideos, setLikedVideos] = useState<Set<string>>(
    new Set(videos.filter((v) => v.isLiked).map((v) => v.id))
  )
  const [savedVideos, setSavedVideos] = useState<Set<string>>(
    new Set(videos.filter((v) => v.isSaved).map((v) => v.id))
  )

  const { isShowing: showHeart, showHeart: triggerHeart, position: heartPosition } = useDoubleTapHeart()

  const handleLike = useCallback(() => {
    if (!currentVideo) return
    setLikedVideos((prev) => {
      const next = new Set(prev)
      if (next.has(currentVideo.id)) {
        next.delete(currentVideo.id)
      } else {
        next.add(currentVideo.id)
      }
      return next
    })
  }, [currentVideo])

  const handleSave = useCallback(() => {
    if (!currentVideo) return
    setSavedVideos((prev) => {
      const next = new Set(prev)
      if (next.has(currentVideo.id)) {
        next.delete(currentVideo.id)
      } else {
        next.add(currentVideo.id)
      }
      return next
    })
  }, [currentVideo])

  const goToNext = useCallback(() => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
    if (currentIndex >= videos.length - 3 && !isLoading) {
      setIsLoading(true)
      setTimeout(() => {
        setVideos((prev) => [...prev, ...generateMoreVideos(prev.length, 5)])
        setIsLoading(false)
      }, 500)
    }
  }, [currentIndex, videos.length, isLoading])

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  const gestureHandlers = useVideoGestures({
    onSingleTap: () => {
      if (isPlaying) {
        pause()
      } else {
        play()
      }
    },
    onDoubleTap: (zone) => {
      if (zone === 'center' || zone === 'right') {
        triggerHeart()
        if (!likedVideos.has(currentVideo?.id || '')) {
          handleLike()
        }
      }
    },
    onSwipeUp: goToNext,
    onSwipeDown: goToPrevious,
  })

  if (!currentVideo) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    )
  }

  const isLiked = likedVideos.has(currentVideo.id)
  const isSaved = savedVideos.has(currentVideo.id)

  return (
    <main className="h-screen w-screen bg-black overflow-hidden relative">
      {/* Video Container */}
      <div {...gestureHandlers()} className="absolute inset-0 touch-none">
        <VideoPlayer
          video={currentVideo}
          autoPlay
          muted={isMuted}
          loop
          className="h-full w-full object-cover"
        />

        {/* Double Tap Heart */}
        <AnimatePresence>
          {showHeart && (
            <DoubleTapHeart show={showHeart} position={heartPosition} />
          )}
        </AnimatePresence>
      </div>

      {/* Video Info Overlay */}
      <div className="absolute bottom-0 left-0 right-16 p-4 pb-8">
        <Text variant="subtitle" className="font-bold video-text-shadow">
          @{currentVideo.author.username}
        </Text>
        <Text variant="body" className="video-text-shadow mt-2 line-clamp-2">
          {currentVideo.caption}
        </Text>
        {currentVideo.sound && (
          <div className="flex items-center gap-2 mt-2">
            <Music2 className="w-4 h-4 text-white" />
            <Text variant="caption" className="video-text-shadow">
              {currentVideo.sound.title}
            </Text>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6">
        <ActionButton
          icon={Heart}
          count={currentVideo.stats.likes}
          isActive={isLiked}
          onClick={handleLike}
          activeColor="fill-red-500 text-red-500"
        />
        <ActionButton
          icon={MessageCircle}
          count={currentVideo.stats.comments}
          onClick={() => alert('Comments coming soon!')}
        />
        <ActionButton
          icon={Bookmark}
          isActive={isSaved}
          onClick={handleSave}
          activeColor="fill-accent text-accent"
        />
        <ActionButton
          icon={Share2}
          count={currentVideo.stats.shares}
          onClick={() => alert('Share coming soon!')}
        />
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/50 backdrop-blur-sm"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
        <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
          <Text variant="caption">
            {currentIndex + 1} / {videos.length}
          </Text>
        </div>
        <Link
          href="/features"
          className="p-2 rounded-full bg-black/50 backdrop-blur-sm flex items-center gap-1"
        >
          <Text variant="caption">Components</Text>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Spinner size="md" />
        </div>
      )}
    </main>
  )
}

function ActionButton({
  icon: Icon,
  count,
  isActive,
  onClick,
  activeColor = '',
}: {
  icon: React.ElementType
  count?: number
  isActive?: boolean
  onClick: () => void
  activeColor?: string
}) {
  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toString()
  }

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <div className="w-12 h-12 flex items-center justify-center">
        <Icon className={`w-8 h-8 ${isActive ? activeColor : 'text-white'}`} />
      </div>
      {count !== undefined && (
        <Text variant="caption">{formatCount(count)}</Text>
      )}
    </button>
  )
}
