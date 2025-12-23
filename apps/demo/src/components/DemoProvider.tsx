'use client'

import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { VortexProvider } from '@vortex/core/api'
import { useDemoConfig, toVortexConfig } from '@/lib/demo-config'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

interface DemoProviderProps {
  children: React.ReactNode
}

export function DemoProvider({ children }: DemoProviderProps) {
  // ✅ Sử dụng selector để chỉ subscribe những fields cần thiết
  const mode = useDemoConfig((state) => state.mode)
  const baseUrl = useDemoConfig((state) => state.baseUrl)
  const apiKey = useDemoConfig((state) => state.apiKey)
  const accessToken = useDemoConfig((state) => state.accessToken)
  const refreshToken = useDemoConfig((state) => state.refreshToken)
  const endpoints = useDemoConfig((state) => state.endpoints)
  const debugMode = useDemoConfig((state) => state.debugMode)

  // ✅ Memoize vortexConfig với dependencies cụ thể
  const vortexConfig = useMemo(() => {
    if (mode === 'mock' || !baseUrl) {
      return undefined
    }
    return (toVortexConfig({
      mode,
      baseUrl,
      apiKey,
      accessToken,
      refreshToken,
      endpoints,
      debugMode,
    } as Parameters<typeof toVortexConfig>[0]) ?? undefined)
  }, [mode, baseUrl, apiKey, accessToken, refreshToken, endpoints, debugMode])

  return (
    <QueryClientProvider client={queryClient}>
      <VortexProvider config={vortexConfig}>
        {children}
      </VortexProvider>
    </QueryClientProvider>
  )
}

