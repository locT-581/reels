/**
 * Network Detector Service
 * Detects network conditions and provides recommendations for video playback
 */

export type EffectiveType = 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'unknown'
export type ConnectionType = 'wifi' | 'cellular' | 'ethernet' | 'bluetooth' | 'none' | 'unknown'

export interface NetworkInfo {
  online: boolean
  effectiveType: EffectiveType
  downlink: number | null
  rtt: number | null
  saveData: boolean
  type: ConnectionType
}

export interface NetworkDetectorCallbacks {
  onNetworkChange?: (info: NetworkInfo) => void
  onOffline?: () => void
  onOnline?: () => void
}

interface NetworkInformation extends EventTarget {
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
  type?: string
}

export class NetworkDetector {
  private callbacks: NetworkDetectorCallbacks = {}
  private currentInfo: NetworkInfo

  constructor() {
    this.currentInfo = this.detectNetwork()
    this.setupListeners()
  }

  private detectNetwork(): NetworkInfo {
    const connection = (navigator as unknown as { connection?: NetworkInformation }).connection

    return {
      online: navigator.onLine,
      effectiveType: (connection?.effectiveType as EffectiveType) ?? 'unknown',
      downlink: connection?.downlink ?? null,
      rtt: connection?.rtt ?? null,
      saveData: connection?.saveData ?? false,
      type: (connection?.type as ConnectionType) ?? 'unknown',
    }
  }

  private setupListeners(): void {
    window.addEventListener('online', this.handleOnline)
    window.addEventListener('offline', this.handleOffline)

    const connection = (navigator as unknown as { connection?: NetworkInformation }).connection
    if (connection) {
      connection.addEventListener('change', this.handleConnectionChange)
    }
  }

  private handleOnline = (): void => {
    this.currentInfo = { ...this.currentInfo, online: true }
    this.callbacks.onOnline?.()
    this.callbacks.onNetworkChange?.(this.currentInfo)
  }

  private handleOffline = (): void => {
    this.currentInfo = { ...this.currentInfo, online: false }
    this.callbacks.onOffline?.()
    this.callbacks.onNetworkChange?.(this.currentInfo)
  }

  private handleConnectionChange = (): void => {
    this.currentInfo = this.detectNetwork()
    this.callbacks.onNetworkChange?.(this.currentInfo)
  }

  subscribe(callbacks: NetworkDetectorCallbacks): () => void {
    this.callbacks = { ...this.callbacks, ...callbacks }
    return () => {
      this.callbacks = {}
    }
  }

  getInfo(): NetworkInfo {
    return this.currentInfo
  }

  isSlowNetwork(): boolean {
    const { effectiveType } = this.currentInfo
    return effectiveType === 'slow-2g' || effectiveType === '2g'
  }

  getRecommendedConfig(): Record<string, unknown> {
    const { effectiveType, saveData } = this.currentInfo

    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      return {
        maxBufferLength: 10,
        maxMaxBufferLength: 20,
        startLevel: 0,
      }
    }

    if (effectiveType === '3g') {
      return {
        maxBufferLength: 20,
        maxMaxBufferLength: 40,
        startLevel: 1,
      }
    }

    return {}
  }

  /**
   * Estimate download time for a given file size in bytes
   */
  estimateDownloadTime(sizeBytes: number): number {
    const { downlink } = this.currentInfo
    if (!downlink || downlink === 0) return Infinity

    // downlink is in Mbps, convert to bytes per second
    const bytesPerSecond = (downlink * 1_000_000) / 8
    return sizeBytes / bytesPerSecond
  }

  destroy(): void {
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)

    const connection = (navigator as unknown as { connection?: NetworkInformation }).connection
    if (connection) {
      connection.removeEventListener('change', this.handleConnectionChange)
    }
  }
}

export function createNetworkDetector(): NetworkDetector {
  return new NetworkDetector()
}

