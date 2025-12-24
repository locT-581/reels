/**
 * Platform Detection Utilities
 * Cross-platform detection for iOS, Android, WebView environments
 */

export interface PlatformInfo {
  /** Operating system */
  os: 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'unknown'
  /** Browser/runtime environment */
  browser: 'safari' | 'chrome' | 'firefox' | 'edge' | 'webview' | 'unknown'
  /** Whether running in a WebView (Flutter, React Native, etc.) */
  isWebView: boolean
  /** Whether native HLS is supported */
  hasNativeHLS: boolean
  /** Whether HLS.js should be used (forced or fallback) */
  shouldUseHLSJS: boolean
  /** Whether device is considered low-end */
  isLowEndDevice: boolean
  /** Device memory in GB (if available) */
  deviceMemory: number | null
  /** Number of CPU cores */
  hardwareConcurrency: number
  /** Browser/WebView version */
  browserVersion: number | null
}

export interface PlatformConfig {
  /** Max video engine slots in pool */
  maxSlots: number
  /** Buffer target for preloading adjacent videos (seconds) */
  preloadBufferTarget: number
  /** Buffer target for active video (seconds) */
  activeBufferTarget: number
  /** Max buffer size in bytes */
  maxBufferSize: number
  /** Whether to use Web Workers for HLS parsing */
  enableWorker: boolean
  /** Initial quality level (-1 for auto, 0 for lowest) */
  startLevel: number
  /** ABR bandwidth estimate (bps) */
  abrBandwidthEstimate: number
}

/**
 * Detect current platform information
 */
export function detectPlatform(): PlatformInfo {
  if (typeof navigator === 'undefined' || typeof document === 'undefined') {
    return getDefaultPlatformInfo()
  }

  const ua = navigator.userAgent
  const os = detectOS(ua)
  const browser = detectBrowser(ua)
  const isWebView = detectWebView(ua, os)
  const hasNativeHLS = checkNativeHLSSupport()
  const deviceMemory = getDeviceMemory()
  const hardwareConcurrency = navigator.hardwareConcurrency || 4
  const isLowEndDevice = checkLowEndDevice(deviceMemory, hardwareConcurrency)
  const browserVersion = detectBrowserVersion(ua, browser)

  // Determine if HLS.js should be used
  const shouldUseHLSJS = determineShouldUseHLSJS(os, isWebView, hasNativeHLS)

  return {
    os,
    browser,
    isWebView,
    hasNativeHLS,
    shouldUseHLSJS,
    isLowEndDevice,
    deviceMemory,
    hardwareConcurrency,
    browserVersion,
  }
}

/**
 * Get optimized configuration based on platform
 */
export function getPlatformConfig(platform?: PlatformInfo): PlatformConfig {
  const info = platform || detectPlatform()

  // Base config
  const baseConfig: PlatformConfig = {
    maxSlots: 5,
    preloadBufferTarget: 5,
    activeBufferTarget: 30,
    maxBufferSize: 30 * 1024 * 1024, // 30MB
    enableWorker: true,
    startLevel: -1, // Auto
    abrBandwidthEstimate: 500000, // 500kbps
  }

  // Low-end device optimizations
  if (info.isLowEndDevice) {
    return {
      ...baseConfig,
      maxSlots: 3,
      preloadBufferTarget: 3,
      activeBufferTarget: 15,
      maxBufferSize: 15 * 1024 * 1024, // 15MB
      enableWorker: false, // Workers can be heavy on low-end
      startLevel: 0, // Start with lowest quality
      abrBandwidthEstimate: 300000, // 300kbps conservative
    }
  }

  // iOS WebView optimizations
  if (info.os === 'ios' && info.isWebView) {
    return {
      ...baseConfig,
      maxSlots: 4, // iOS WebView has stricter memory limits
      preloadBufferTarget: 4,
      activeBufferTarget: 20,
      maxBufferSize: 20 * 1024 * 1024, // 20MB
      startLevel: 0, // Start low for fast first frame
    }
  }

  // Android optimizations
  if (info.os === 'android') {
    // Check for older Android WebView
    if (info.browserVersion && info.browserVersion < 80) {
      return {
        ...baseConfig,
        maxSlots: 3,
        preloadBufferTarget: 3,
        activeBufferTarget: 15,
        enableWorker: false, // Older WebView may have issues with workers
        startLevel: 0,
      }
    }

    return {
      ...baseConfig,
      maxSlots: 5,
      preloadBufferTarget: 5,
      activeBufferTarget: 25,
      maxBufferSize: 25 * 1024 * 1024, // 25MB (Android devices vary widely)
      startLevel: 0, // Start low for fast first frame
    }
  }

  // iOS Safari (native) - can use native HLS efficiently
  if (info.os === 'ios' && !info.isWebView) {
    return {
      ...baseConfig,
      maxSlots: 5,
      preloadBufferTarget: 5,
      activeBufferTarget: 30,
      startLevel: -1, // Auto is fine for native
    }
  }

  // Desktop browsers
  return {
    ...baseConfig,
    maxSlots: 5,
    preloadBufferTarget: 8,
    activeBufferTarget: 60,
    maxBufferSize: 60 * 1024 * 1024, // 60MB
    startLevel: -1, // Auto
  }
}

// =============================================================================
// PRIVATE HELPERS
// =============================================================================

function getDefaultPlatformInfo(): PlatformInfo {
  return {
    os: 'unknown',
    browser: 'unknown',
    isWebView: false,
    hasNativeHLS: false,
    shouldUseHLSJS: true,
    isLowEndDevice: false,
    deviceMemory: null,
    hardwareConcurrency: 4,
    browserVersion: null,
  }
}

function detectOS(ua: string): PlatformInfo['os'] {
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    return 'ios'
  }
  if (/Android/.test(ua)) {
    return 'android'
  }
  if (/Mac OS X/.test(ua)) {
    return 'macos'
  }
  if (/Windows/.test(ua)) {
    return 'windows'
  }
  if (/Linux/.test(ua)) {
    return 'linux'
  }
  return 'unknown'
}

function detectBrowser(ua: string): PlatformInfo['browser'] {
  // Order matters - check more specific patterns first
  if (/EdgA?\//.test(ua)) {
    return 'edge'
  }
  if (/Firefox\//.test(ua)) {
    return 'firefox'
  }
  if (/CriOS|Chrome\//.test(ua)) {
    return 'chrome'
  }
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) {
    return 'safari'
  }
  return 'unknown'
}

function detectWebView(ua: string, os: PlatformInfo['os']): boolean {
  // iOS WebView detection
  if (os === 'ios') {
    // Safari app contains both "Safari" and "Version"
    // WebView typically contains "AppleWebKit" but NOT "Safari" or has different patterns
    const hasAppleWebKit = /AppleWebKit/.test(ua)
    const hasSafari = /Safari/.test(ua)
    const hasCriOS = /CriOS/.test(ua) // Chrome on iOS
    const hasFxiOS = /FxiOS/.test(ua) // Firefox on iOS
    const hasGSA = /GSA\//.test(ua) // Google Search App
    const hasFBiOS = /FBAN|FBAV/.test(ua) // Facebook
    const hasInstagram = /Instagram/.test(ua)
    const hasTwitter = /Twitter/.test(ua)
    const hasLinkedIn = /LinkedInApp/.test(ua)

    // Known in-app browsers
    if (hasCriOS || hasFxiOS || hasGSA || hasFBiOS || hasInstagram || hasTwitter || hasLinkedIn) {
      return true
    }

    // Generic WebView: has WebKit but no Safari identifier
    if (hasAppleWebKit && !hasSafari) {
      return true
    }

    // Flutter WebView often has no Safari string
    return false
  }

  // Android WebView detection
  if (os === 'android') {
    // Android WebView typically has "wv" in the UA string
    if (/; wv\)/.test(ua)) {
      return true
    }

    // Or doesn't have "Chrome" but has "Version/"
    if (/Version\/[\d.]+/.test(ua) && !/Chrome/.test(ua)) {
      return true
    }

    // Check for common WebView indicators
    if (/FB_IAB|FBAN|FBAV|Instagram|Twitter|LinkedInApp/.test(ua)) {
      return true
    }

    return false
  }

  return false
}

function checkNativeHLSSupport(): boolean {
  if (typeof document === 'undefined') return false

  const video = document.createElement('video')
  const canPlay = video.canPlayType('application/vnd.apple.mpegurl')

  // canPlayType returns '', 'maybe', or 'probably'
  return canPlay === 'probably' || canPlay === 'maybe'
}

function getDeviceMemory(): number | null {
  if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
    return (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null
  }
  return null
}

function checkLowEndDevice(deviceMemory: number | null, hardwareConcurrency: number): boolean {
  // Check memory (< 4GB is considered low-end)
  if (deviceMemory !== null && deviceMemory < 4) {
    return true
  }

  // Check CPU cores (< 4 cores is considered low-end)
  if (hardwareConcurrency < 4) {
    return true
  }

  return false
}

function detectBrowserVersion(ua: string, browser: PlatformInfo['browser']): number | null {
  let match: RegExpMatchArray | null = null

  switch (browser) {
    case 'chrome':
      match = ua.match(/(?:Chrome|CriOS)\/(\d+)/)
      break
    case 'safari':
      match = ua.match(/Version\/(\d+)/)
      break
    case 'firefox':
      match = ua.match(/(?:Firefox|FxiOS)\/(\d+)/)
      break
    case 'edge':
      match = ua.match(/EdgA?\/(\d+)/)
      break
  }

  return match && match[1] ? parseInt(match[1], 10) : null
}

function determineShouldUseHLSJS(
  os: PlatformInfo['os'],
  isWebView: boolean,
  hasNativeHLS: boolean
): boolean {
  // No native HLS = must use HLS.js (Android, most browsers)
  if (!hasNativeHLS) {
    return true
  }

  // iOS WebView: Native HLS works but preloading is unreliable
  // Force HLS.js for better control
  if (os === 'ios' && isWebView) {
    return true
  }

  // iOS Safari: Native HLS is excellent, prefer it
  if (os === 'ios' && !isWebView) {
    return false
  }

  // macOS Safari: Native HLS works well
  if (os === 'macos') {
    return false
  }

  // Default: Use HLS.js for better cross-platform consistency
  return true
}

/**
 * Check if HLS.js is supported
 */
export function isHLSJSSupported(): boolean {
  if (typeof window === 'undefined') return false

  // HLS.js requires Media Source Extensions
  const hasMediaSource = 'MediaSource' in window
  const hasSourceBuffer = hasMediaSource && 'SourceBuffer' in window

  return hasMediaSource && hasSourceBuffer
}

/**
 * Get a human-readable platform description
 */
export function getPlatformDescription(platform?: PlatformInfo): string {
  const info = platform || detectPlatform()
  const parts: string[] = []

  parts.push(info.os.toUpperCase())
  parts.push(info.browser)

  if (info.isWebView) {
    parts.push('WebView')
  }

  if (info.browserVersion) {
    parts.push(`v${info.browserVersion}`)
  }

  if (info.isLowEndDevice) {
    parts.push('(low-end)')
  }

  return parts.join(' ')
}

