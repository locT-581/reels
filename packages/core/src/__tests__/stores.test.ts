/**
 * Tests for Zustand stores
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { usePlayerStore } from '../stores/playerStore'
import { useFeedStore } from '../stores/feedStore'
import { useUIStore } from '../stores/uiStore'
import type { Video, Quality } from '../types'

// Mock video factory
const createMockVideo = (id: string): Video => ({
  id,
  url: `https://example.com/${id}.mp4`,
  thumbnail: `https://example.com/${id}.jpg`,
  author: {
    id: 'author-1',
    username: 'testuser',
    displayName: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    verified: false,
    followers: 1000,
    following: 100,
  },
  caption: 'Test video',
  hashtags: ['test'],
  stats: {
    views: 1000,
    likes: 100,
    comments: 10,
    shares: 5,
    saves: 2,
  },
  createdAt: new Date().toISOString(),
  duration: 30,
})

describe('Player Store', () => {
  beforeEach(() => {
    // Reset store before each test
    usePlayerStore.setState({
      currentVideo: null,
      playerState: 'idle',
      isPlaying: false,
      isMuted: true,
      volume: 1,
      playbackSpeed: 1,
      quality: 'auto' as Quality,
      currentTime: 0,
      duration: 0,
      buffered: 0,
    })
  })

  describe('playback controls', () => {
    it('should start with default values', () => {
      const state = usePlayerStore.getState()
      expect(state.isPlaying).toBe(false)
      expect(state.isMuted).toBe(true)
      expect(state.volume).toBe(1)
      expect(state.playerState).toBe('idle')
    })

    it('should play video', () => {
      usePlayerStore.getState().play()
      expect(usePlayerStore.getState().isPlaying).toBe(true)
      expect(usePlayerStore.getState().playerState).toBe('playing')
    })

    it('should pause video', () => {
      usePlayerStore.getState().play()
      usePlayerStore.getState().pause()
      expect(usePlayerStore.getState().isPlaying).toBe(false)
      expect(usePlayerStore.getState().playerState).toBe('paused')
    })

    it('should toggle play/pause', () => {
      usePlayerStore.getState().togglePlay()
      expect(usePlayerStore.getState().isPlaying).toBe(true)
      usePlayerStore.getState().togglePlay()
      expect(usePlayerStore.getState().isPlaying).toBe(false)
    })
  })

  describe('mute controls', () => {
    it('should toggle mute', () => {
      usePlayerStore.getState().toggleMute()
      expect(usePlayerStore.getState().isMuted).toBe(false)
      usePlayerStore.getState().toggleMute()
      expect(usePlayerStore.getState().isMuted).toBe(true)
    })

    it('should set volume', () => {
      usePlayerStore.getState().setVolume(0.5)
      expect(usePlayerStore.getState().volume).toBe(0.5)
    })

    it('should mute when setting volume to 0', () => {
      usePlayerStore.getState().setVolume(0)
      expect(usePlayerStore.getState().isMuted).toBe(true)
    })

    it('should clamp volume between 0 and 1', () => {
      usePlayerStore.getState().setVolume(1.5)
      expect(usePlayerStore.getState().volume).toBe(1)
      usePlayerStore.getState().setVolume(-0.5)
      expect(usePlayerStore.getState().volume).toBe(0)
    })
  })

  describe('time controls', () => {
    it('should update progress', () => {
      usePlayerStore.getState().updateProgress(30, 45)
      expect(usePlayerStore.getState().currentTime).toBe(30)
      expect(usePlayerStore.getState().buffered).toBe(45)
    })

    it('should update duration', () => {
      usePlayerStore.getState().setDuration(120)
      expect(usePlayerStore.getState().duration).toBe(120)
    })

    it('should seek to time', () => {
      usePlayerStore.getState().setDuration(120)
      usePlayerStore.getState().seek(60)
      expect(usePlayerStore.getState().currentTime).toBe(60)
    })
  })

  describe('quality and speed controls', () => {
    it('should set quality', () => {
      usePlayerStore.getState().setQuality('720p')
      expect(usePlayerStore.getState().quality).toBe('720p')
    })

    it('should set playback speed', () => {
      usePlayerStore.getState().setPlaybackSpeed(1.5)
      expect(usePlayerStore.getState().playbackSpeed).toBe(1.5)
    })
  })

  describe('video management', () => {
    it('should set current video', () => {
      const video = createMockVideo('test-1')
      usePlayerStore.getState().setCurrentVideo(video)
      expect(usePlayerStore.getState().currentVideo).toEqual(video)
      expect(usePlayerStore.getState().playerState).toBe('loading')
      expect(usePlayerStore.getState().currentTime).toBe(0)
    })

    it('should reset state', () => {
      usePlayerStore.getState().play()
      usePlayerStore.getState().setVolume(0.5)
      usePlayerStore.getState().reset()
      expect(usePlayerStore.getState().isPlaying).toBe(false)
      expect(usePlayerStore.getState().volume).toBe(1)
    })
  })
})

describe('Feed Store', () => {
  beforeEach(() => {
    useFeedStore.setState({
      currentIndex: 0,
      videos: [],
      feedType: 'foryou',
      isLoading: false,
      hasMore: true,
      error: null,
    })
  })

  it('should start with default values', () => {
    const state = useFeedStore.getState()
    expect(state.currentIndex).toBe(0)
    expect(state.videos).toEqual([])
    expect(state.isLoading).toBe(false)
    expect(state.feedType).toBe('foryou')
  })

  it('should set current index', () => {
    useFeedStore.getState().setCurrentIndex(5)
    expect(useFeedStore.getState().currentIndex).toBe(5)
  })

  it('should set videos', () => {
    const videos = [createMockVideo('1'), createMockVideo('2')]
    useFeedStore.getState().setVideos(videos)
    expect(useFeedStore.getState().videos).toEqual(videos)
    expect(useFeedStore.getState().currentIndex).toBe(0)
  })

  it('should append videos', () => {
    useFeedStore.getState().setVideos([createMockVideo('1')])
    useFeedStore.getState().appendVideos([createMockVideo('2')])
    expect(useFeedStore.getState().videos).toHaveLength(2)
  })

  it('should go to next video', () => {
    useFeedStore.getState().setVideos([createMockVideo('1'), createMockVideo('2')])
    useFeedStore.getState().goToNext()
    expect(useFeedStore.getState().currentIndex).toBe(1)
  })

  it('should go to previous video', () => {
    useFeedStore.getState().setVideos([createMockVideo('1'), createMockVideo('2')])
    useFeedStore.getState().setCurrentIndex(1)
    useFeedStore.getState().goToPrevious()
    expect(useFeedStore.getState().currentIndex).toBe(0)
  })

  it('should not go before first video', () => {
    useFeedStore.getState().goToPrevious()
    expect(useFeedStore.getState().currentIndex).toBe(0)
  })

  it('should not go past last video', () => {
    useFeedStore.getState().setVideos([createMockVideo('1'), createMockVideo('2')])
    useFeedStore.getState().setCurrentIndex(1)
    useFeedStore.getState().goToNext()
    expect(useFeedStore.getState().currentIndex).toBe(1)
  })

  it('should remove video', () => {
    useFeedStore.getState().setVideos([createMockVideo('1'), createMockVideo('2')])
    useFeedStore.getState().removeVideo('1')
    expect(useFeedStore.getState().videos).toHaveLength(1)
    expect(useFeedStore.getState().videos[0].id).toBe('2')
  })

  it('should set loading state', () => {
    useFeedStore.getState().setLoading(true)
    expect(useFeedStore.getState().isLoading).toBe(true)
  })

  it('should set error state', () => {
    useFeedStore.getState().setError('Network error')
    expect(useFeedStore.getState().error).toBe('Network error')
  })

  it('should reset state', () => {
    useFeedStore.getState().setVideos([createMockVideo('1')])
    useFeedStore.getState().setCurrentIndex(5)
    useFeedStore.getState().reset()
    expect(useFeedStore.getState().videos).toEqual([])
    expect(useFeedStore.getState().currentIndex).toBe(0)
  })
})

describe('UI Store', () => {
  beforeEach(() => {
    useUIStore.setState({
      isCommentSheetOpen: false,
      isShareSheetOpen: false,
      isContextMenuOpen: false,
      contextMenuPosition: null,
      activeVideoId: null,
      toast: null,
    })
  })

  it('should start with default values', () => {
    const state = useUIStore.getState()
    expect(state.isCommentSheetOpen).toBe(false)
    expect(state.isShareSheetOpen).toBe(false)
    expect(state.isContextMenuOpen).toBe(false)
    expect(state.activeVideoId).toBeNull()
  })

  describe('comment sheet', () => {
    it('should open comment sheet', () => {
      useUIStore.getState().openCommentSheet('video-1')
      expect(useUIStore.getState().isCommentSheetOpen).toBe(true)
      expect(useUIStore.getState().activeVideoId).toBe('video-1')
    })

    it('should close comment sheet', () => {
      useUIStore.getState().openCommentSheet('video-1')
      useUIStore.getState().closeCommentSheet()
      expect(useUIStore.getState().isCommentSheetOpen).toBe(false)
      expect(useUIStore.getState().activeVideoId).toBeNull()
    })

    it('should close other modals when opening comment sheet', () => {
      useUIStore.getState().openShareSheet('video-1')
      useUIStore.getState().openCommentSheet('video-1')
      expect(useUIStore.getState().isShareSheetOpen).toBe(false)
    })
  })

  describe('share sheet', () => {
    it('should open share sheet', () => {
      useUIStore.getState().openShareSheet('video-1')
      expect(useUIStore.getState().isShareSheetOpen).toBe(true)
      expect(useUIStore.getState().activeVideoId).toBe('video-1')
    })

    it('should close share sheet', () => {
      useUIStore.getState().openShareSheet('video-1')
      useUIStore.getState().closeShareSheet()
      expect(useUIStore.getState().isShareSheetOpen).toBe(false)
      expect(useUIStore.getState().activeVideoId).toBeNull()
    })
  })

  describe('context menu', () => {
    it('should open context menu', () => {
      useUIStore.getState().openContextMenu('video-1', { x: 100, y: 200 })
      expect(useUIStore.getState().isContextMenuOpen).toBe(true)
      expect(useUIStore.getState().contextMenuPosition).toEqual({ x: 100, y: 200 })
      expect(useUIStore.getState().activeVideoId).toBe('video-1')
    })

    it('should close context menu', () => {
      useUIStore.getState().openContextMenu('video-1', { x: 100, y: 200 })
      useUIStore.getState().closeContextMenu()
      expect(useUIStore.getState().isContextMenuOpen).toBe(false)
      expect(useUIStore.getState().contextMenuPosition).toBeNull()
    })
  })

  describe('toast', () => {
    it('should show toast', () => {
      useUIStore.getState().showToast({ message: 'Test toast', type: 'success' })
      expect(useUIStore.getState().toast).toEqual({ message: 'Test toast', type: 'success' })
    })

    it('should hide toast', () => {
      useUIStore.getState().showToast({ message: 'Test toast', type: 'success' })
      useUIStore.getState().hideToast()
      expect(useUIStore.getState().toast).toBeNull()
    })
  })

  describe('close all', () => {
    it('should close all modals and sheets', () => {
      useUIStore.getState().openCommentSheet('video-1')
      useUIStore.getState().closeAll()
      expect(useUIStore.getState().isCommentSheetOpen).toBe(false)
      expect(useUIStore.getState().isShareSheetOpen).toBe(false)
      expect(useUIStore.getState().isContextMenuOpen).toBe(false)
      expect(useUIStore.getState().activeVideoId).toBeNull()
    })
  })
})
