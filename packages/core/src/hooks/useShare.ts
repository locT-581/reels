/**
 * useShare - Hook for sharing functionality
 */

'use client'

import { useState, useCallback } from 'react'
import { lightHaptic } from '../utils/haptic'

export interface ShareData {
  /** URL to share */
  url: string
  /** Title/caption */
  title?: string
  /** Description text */
  text?: string
}

export interface UseShareOptions {
  /** Share data */
  data: ShareData
  /** Called after successful share */
  onShare?: (platform: string) => void
  /** Called after error */
  onError?: (error: Error) => void
}

export interface UseShareReturn {
  /** Whether native share is supported */
  isNativeShareSupported: boolean
  /** Open native share dialog */
  nativeShare: () => Promise<void>
  /** Copy link to clipboard */
  copyLink: () => Promise<boolean>
  /** Share to specific platform */
  shareTo: (platform: string) => void
  /** Whether a share operation is in progress */
  isSharing: boolean
  /** Whether link was recently copied */
  isCopied: boolean
}

// Social share URLs
const SHARE_URLS: Record<string, (data: ShareData) => string> = {
  facebook: (data) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`,
  twitter: (data) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title || '')}`,
  whatsapp: (data) =>
    `https://api.whatsapp.com/send?text=${encodeURIComponent(`${data.title || ''} ${data.url}`)}`,
  telegram: (data) =>
    `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title || '')}`,
  messenger: (data) =>
    `https://www.facebook.com/dialog/send?link=${encodeURIComponent(data.url)}&app_id=YOUR_APP_ID`,
  line: (data) =>
    `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(data.url)}`,
  email: (data) =>
    `mailto:?subject=${encodeURIComponent(data.title || '')}&body=${encodeURIComponent(`${data.text || ''}\n\n${data.url}`)}`,
}

export function useShare({
  data,
  onShare,
  onError,
}: UseShareOptions): UseShareReturn {
  const [isSharing, setIsSharing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Check if native share is supported
  const isNativeShareSupported =
    typeof navigator !== 'undefined' && 'share' in navigator

  // Native share
  const nativeShare = useCallback(async () => {
    if (!isNativeShareSupported) {
      onError?.(new Error('Native share not supported'))
      return
    }

    setIsSharing(true)
    lightHaptic()

    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url,
      })
      onShare?.('native')
    } catch (err) {
      // User cancelled or error
      if ((err as Error).name !== 'AbortError') {
        onError?.(err instanceof Error ? err : new Error('Share failed'))
      }
    } finally {
      setIsSharing(false)
    }
  }, [isNativeShareSupported, data, onShare, onError])

  // Copy link
  const copyLink = useCallback(async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(data.url)
      lightHaptic()
      setIsCopied(true)
      onShare?.('copy')

      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000)

      return true
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = data.url
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()

      try {
        document.execCommand('copy')
        lightHaptic()
        setIsCopied(true)
        onShare?.('copy')
        setTimeout(() => setIsCopied(false), 2000)
        return true
      } catch {
        onError?.(new Error('Failed to copy link'))
        return false
      } finally {
        document.body.removeChild(textArea)
      }
    }
  }, [data.url, onShare, onError])

  // Share to specific platform
  const shareTo = useCallback(
    (platform: string) => {
      const getShareUrl = SHARE_URLS[platform]
      if (!getShareUrl) {
        onError?.(new Error(`Unknown platform: ${platform}`))
        return
      }

      lightHaptic()
      const shareUrl = getShareUrl(data)

      // Open in new window
      const width = 600
      const height = 400
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      window.open(
        shareUrl,
        'share',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
      )

      onShare?.(platform)
    },
    [data, onShare, onError]
  )

  return {
    isNativeShareSupported,
    nativeShare,
    copyLink,
    shareTo,
    isSharing,
    isCopied,
  }
}

/**
 * Generate a share link for a video
 */
export function generateShareLink(videoId: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/video/${videoId}`
}

/**
 * Generate a deep link for mobile apps
 */
export function generateDeepLink(videoId: string, scheme = 'vortex'): string {
  return `${scheme}://video/${videoId}`
}

