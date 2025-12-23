/**
 * Preload Manager Service
 * Manages video preloading queue with priority support
 */

export type PreloadType = 'metadata' | 'auto' | 'none'
export type PreloadStatus = 'pending' | 'loading' | 'loaded' | 'error'

export interface PreloadItem {
  id?: string
  url: string
  status?: PreloadStatus
  priority: number
  type?: 'metadata' | 'auto' | 'full'
}

export interface PreloadManagerOptions {
  maxConcurrent?: number
  maxQueue?: number
}

export interface PreloadManagerCallbacks {
  onPreloadStart?: (item: PreloadItem) => void
  onPreloadComplete?: (item: PreloadItem) => void
  onPreloadError?: (item: PreloadItem, error: Error) => void
  onPreloadCancel?: (item: PreloadItem) => void
}

interface InternalPreloadItem extends PreloadItem {
  id: string
  status: PreloadStatus
}

export class PreloadManager {
  private queue: InternalPreloadItem[] = []
  private preloaded: Set<string> = new Set()
  private loading: Set<string> = new Set()
  private callbacks: PreloadManagerCallbacks = {}
  private options: Required<PreloadManagerOptions>
  private paused: boolean = false
  private velocityThreshold: number = 2000 // px/s

  constructor(options: PreloadManagerOptions = {}) {
    this.options = {
      maxConcurrent: options.maxConcurrent ?? 2,
      maxQueue: options.maxQueue ?? 5,
    }
  }

  enqueue(item: PreloadItem): void {
    const id = item.id ?? item.url

    // Skip if already preloaded or in queue
    if (this.preloaded.has(item.url) || this.queue.some(i => i.url === item.url)) {
      return
    }

    if (this.queue.length >= this.options.maxQueue) {
      const removed = this.queue.shift()
      if (removed) {
        this.callbacks.onPreloadCancel?.(removed)
      }
    }

    this.queue.push({
      ...item,
      id,
      status: 'pending',
    })
    this.queue.sort((a, b) => b.priority - a.priority)
    this.processQueue()
  }

  enqueueMany(items: PreloadItem[]): void {
    items.forEach(item => this.enqueue(item))
  }

  cancel(url: string): void {
    const item = this.queue.find(i => i.url === url)
    if (item) {
      this.queue = this.queue.filter(i => i.url !== url)
      this.loading.delete(item.id)
      this.callbacks.onPreloadCancel?.(item)
    }
  }

  cancelAll(): void {
    this.queue.forEach(item => {
      this.callbacks.onPreloadCancel?.(item)
    })
    this.queue = []
    this.loading.clear()
  }

  // Legacy methods for backward compat
  add(id: string, url: string, priority: number = 0): void {
    this.enqueue({ id, url, priority })
  }

  remove(id: string): void {
    this.queue = this.queue.filter((item) => item.id !== id)
    this.loading.delete(id)
  }

  clear(): void {
    this.cancelAll()
    this.preloaded.clear()
  }

  setPaused(paused: boolean): void {
    this.paused = paused
    if (!paused) {
      this.processQueue()
    }
  }

  handleScrollVelocity(velocity: number): void {
    if (Math.abs(velocity) > this.velocityThreshold) {
      this.setPaused(true)
    } else {
      this.setPaused(false)
    }
  }

  isPreloaded(url: string): boolean {
    return this.preloaded.has(url)
  }

  getStatus(url: string): PreloadStatus | null {
    const item = this.queue.find(i => i.url === url)
    if (item) return item.status
    if (this.preloaded.has(url)) return 'loaded'
    return null
  }

  getAllStatuses(): PreloadStatus[] {
    return this.queue.map(item => item.status)
  }

  getPreloadedUrls(): string[] {
    return Array.from(this.preloaded)
  }

  subscribe(callbacks: PreloadManagerCallbacks): () => void {
    this.callbacks = { ...this.callbacks, ...callbacks }
    return () => {
      this.callbacks = {}
    }
  }

  private processQueue(): void {
    if (this.paused) return

    while (
      this.loading.size < this.options.maxConcurrent &&
      this.queue.some((item) => item.status === 'pending')
    ) {
      const item = this.queue.find((i) => i.status === 'pending')
      if (item) {
        this.preloadItem(item)
      }
    }
  }

  private async preloadItem(item: InternalPreloadItem): Promise<void> {
    item.status = 'loading'
    this.loading.add(item.id)
    this.callbacks.onPreloadStart?.(item)

    try {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'fetch'
      link.href = item.url
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)

      await new Promise<void>((resolve, reject) => {
        link.onload = () => resolve()
        link.onerror = () => reject(new Error('Preload failed'))
      })

      item.status = 'loaded'
      this.preloaded.add(item.url)
      this.callbacks.onPreloadComplete?.(item)
    } catch (error) {
      item.status = 'error'
      this.callbacks.onPreloadError?.(item, error as Error)
    } finally {
      this.loading.delete(item.id)
      this.processQueue()
    }
  }

  destroy(): void {
    this.clear()
    this.callbacks = {}
  }
}

export function createPreloadManager(options?: PreloadManagerOptions): PreloadManager {
  return new PreloadManager(options)
}

