/**
 * Offline Page - Shown when user is offline and no cache available
 */

'use client'

import { WifiOff, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
        <WifiOff className="w-12 h-12 text-zinc-500" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-white mb-2">
        Không có kết nối mạng
      </h1>

      {/* Description */}
      <p className="text-zinc-400 mb-8 max-w-sm">
        Mạng đang nghỉ ngơi, thử lại nhé! Bạn có thể xem lại các video đã lưu
        khi offline.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-vortex-violet text-white rounded-xl font-medium hover:bg-vortex-violet/90 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Thử lại
        </button>

        <a
          href="/saved"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-700 transition-colors"
        >
          Xem video đã lưu
        </a>
      </div>

      {/* Tip */}
      <p className="text-xs text-zinc-600 mt-8">
        💡 Tip: Lưu video yêu thích để xem offline
      </p>
    </div>
  )
}

