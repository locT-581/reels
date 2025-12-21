/**
 * OfflineFeed - Shows cached videos when offline
 */

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Download, WifiOff, Play } from 'lucide-react'
import { getWatchHistory, getCachedVideos, type WatchProgress, type Video } from '@vortex/core'

interface CachedVideo extends WatchProgress {
  video?: Video
}

export function OfflineFeed() {
  const [cachedVideos, setCachedVideos] = useState<CachedVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCachedVideos() {
      try {
        // Get watch history
        const history = await getWatchHistory(50)
        const videoIds = history.map(h => h.videoId)
        
        // Get cached video data
        const cached = await getCachedVideos(videoIds)
        
        // Combine data
        const videosWithData = history.map(h => ({
          ...h,
          video: cached.get(h.videoId),
        }))
        
        setCachedVideos(videosWithData)
      } catch (error) {
        console.error('Failed to load cached videos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadCachedVideos()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-vortex-violet border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (cachedVideos.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
          <WifiOff className="w-10 h-10 text-zinc-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          Không có video offline
        </h2>
        <p className="text-zinc-400 text-sm max-w-xs">
          Kết nối mạng để xem video mới hoặc lưu video để xem offline
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-zinc-800 px-4 py-3 pt-safe">
        <div className="flex items-center gap-3">
          <WifiOff className="w-5 h-5 text-zinc-400" />
          <div>
            <h1 className="text-white font-semibold">Chế độ Offline</h1>
            <p className="text-zinc-500 text-xs">
              {cachedVideos.length} video có sẵn
            </p>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <AnimatePresence>
          {cachedVideos.map((item, index) => (
            <motion.a
              key={item.videoId}
              href={`/video/${item.videoId}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative aspect-[9/16] bg-zinc-900 rounded-xl overflow-hidden group"
            >
              {/* Thumbnail */}
              {item.video?.thumbnail ? (
                <img
                  src={item.video.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                  <Play className="w-10 h-10 text-zinc-600" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
                <div
                  className="h-full bg-vortex-violet"
                  style={{ width: `${item.percentage * 100}%` }}
                />
              </div>

              {/* Info */}
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium line-clamp-2">
                  {item.video?.caption || 'Video đã lưu'}
                </p>
              </div>

              {/* Offline badge */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded-md flex items-center gap-1">
                <Download className="w-3 h-3 text-vortex-violet" />
                <span className="text-xs text-white">Offline</span>
              </div>

              {/* Play overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

