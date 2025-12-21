/**
 * Testing Utilities
 */

import { ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ============================================
// Mock Data Factories
// ============================================

export function createMockVideo(overrides = {}) {
  return {
    id: `video-${Math.random().toString(36).slice(2, 9)}`,
    url: 'https://example.com/video.mp4',
    hlsUrl: 'https://example.com/video.m3u8',
    thumbnail: 'https://example.com/thumb.jpg',
    blurHash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
    author: {
      id: 'author-1',
      username: 'testuser',
      displayName: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      verified: false,
      followers: 1000,
      following: 100,
    },
    caption: 'Test video caption #test',
    hashtags: ['test', 'video'],
    sound: {
      id: 'sound-1',
      name: 'Original Sound',
      author: 'Test User',
    },
    stats: {
      views: 10000,
      likes: 500,
      comments: 100,
      shares: 50,
      saves: 25,
    },
    metadata: {
      width: 1080,
      height: 1920,
      duration: 30,
      bitrate: 2000000,
      codec: 'h264',
    },
    createdAt: new Date().toISOString(),
    duration: 30,
    isLiked: false,
    isSaved: false,
    ...overrides,
  }
}

export function createMockComment(overrides = {}) {
  return {
    id: `comment-${Math.random().toString(36).slice(2, 9)}`,
    videoId: 'video-1',
    author: {
      id: 'author-1',
      username: 'testuser',
      displayName: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      verified: false,
    },
    content: 'This is a test comment',
    likes: 10,
    isLiked: false,
    replyCount: 0,
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockUser(overrides = {}) {
  return {
    id: `user-${Math.random().toString(36).slice(2, 9)}`,
    username: 'testuser',
    displayName: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Test bio',
    verified: false,
    followers: 1000,
    following: 100,
    likes: 5000,
    ...overrides,
  }
}

// ============================================
// Query Client
// ============================================

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

// ============================================
// Test Wrapper
// ============================================

interface TestProvidersProps {
  children: ReactNode
  queryClient?: QueryClient
}

export function TestProviders({
  children,
  queryClient = createTestQueryClient(),
}: TestProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// ============================================
// Custom Render
// ============================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { queryClient, ...renderOptions } = options
  
  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders queryClient={queryClient}>{children}</TestProviders>
    ),
    ...renderOptions,
  })
}

// ============================================
// Async Utilities
// ============================================

export function waitForNextTick() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

export function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ============================================
// Re-export testing library
// ============================================

export * from '@testing-library/react'
export { renderWithProviders as render }

