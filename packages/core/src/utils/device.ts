/**
 * Device detection utilities
 */

/**
 * Check if the current device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Check if the current device is iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

/**
 * Check if the browser supports native HLS playback
 */
export function supportsNativeHLS(): boolean {
  if (typeof document === 'undefined') return false

  const video = document.createElement('video')
  return video.canPlayType('application/vnd.apple.mpegurl') !== ''
}

/**
 * Check if HLS.js is needed (not native HLS support)
 */
export function needsHLSJS(): boolean {
  return !supportsNativeHLS()
}

/**
 * Get the current network connection type
 */
export function getNetworkType(): 'slow-2g' | '2g' | '3g' | '4g' | 'unknown' {
  if (typeof navigator === 'undefined') return 'unknown'

  // @ts-expect-error - connection is not in the standard navigator type
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

  if (!connection) return 'unknown'

  return connection.effectiveType || 'unknown'
}

/**
 * Check if the network is slow (2g or slow-2g)
 */
export function isSlowNetwork(): boolean {
  const type = getNetworkType()
  return type === 'slow-2g' || type === '2g'
}

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get the device pixel ratio
 */
export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') return 1

  return window.devicePixelRatio || 1
}

/**
 * Check if the device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false

  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Get the viewport dimensions
 */
export function getViewport(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

