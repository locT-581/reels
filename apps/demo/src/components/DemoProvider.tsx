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
  const config = useDemoConfig()

  // Convert demo config to VortexConfig
  const vortexConfig = useMemo(() => toVortexConfig(config), [config])

  return (
    <QueryClientProvider client={queryClient}>
      <VortexProvider config={vortexConfig ?? undefined}>
        {children}
      </VortexProvider>
    </QueryClientProvider>
  )
}

