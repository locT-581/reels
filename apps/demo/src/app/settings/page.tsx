'use client'

import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import {
  Settings,
  Server,
  Key,
  Link2,
  CheckCircle,
  XCircle,
  Loader2,
  RotateCcw,
  Bug,
  Wifi,
  WifiOff,
  ArrowLeft,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import {
  useDemoConfig,
  testConnection,
  type DemoMode,
} from '@/lib/demo-config'

export default function SettingsPage() {
  const router = useRouter()
  const config = useDemoConfig()
  const [isTesting, setIsTesting] = useState(false)

  // Handle test connection
  const handleTestConnection = useCallback(async () => {
    setIsTesting(true)
    config.setConnectionStatus('testing')

    const result = await testConnection(config)

    if (result.success) {
      config.setConnectionStatus('success')
    } else {
      config.setConnectionStatus('error', result.error)
    }

    setIsTesting(false)
  }, [config])

  // Handle mode change
  const handleModeChange = useCallback(
    (mode: DemoMode) => {
      config.setMode(mode)
      config.setConnectionStatus('idle')
    },
    [config]
  )

  // Handle reset
  const handleReset = useCallback(() => {
    if (confirm('Bạn có chắc muốn reset tất cả cấu hình?')) {
      config.resetConfig()
    }
  }, [config])

  return (
    <div className="min-h-screen bg-xhub-reel-bg">
      <Navigation />

      {/* Header */}
      <header className="sticky top-0 z-50 xhub-reel-glass border-b border-xhub-reel-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-xhub-reel-surface border border-xhub-reel-border flex items-center justify-center text-xhub-reel-text-secondary hover:text-xhub-reel-text hover:border-xhub-reel-text-muted active:scale-95 transition-all"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 rounded-xl bg-xhub-reel-accent/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-xhub-reel-accent" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-xhub-reel-text">Cấu hình API</h1>
            <p className="text-sm text-xhub-reel-text-muted">
              Kết nối với backend của bạn để test
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-6">
        {/* Mode Toggle */}
        <section className="xhub-reel-card p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Wifi className="w-5 h-5 text-xhub-reel-accent" />
            <h2 className="font-semibold text-xhub-reel-text">Chế độ hoạt động</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ModeButton
              active={config.mode === 'mock'}
              onClick={() => handleModeChange('mock')}
              icon={<WifiOff className="w-5 h-5" />}
              title="Mock Data"
              description="Sử dụng dữ liệu mẫu"
            />
            <ModeButton
              active={config.mode === 'api'}
              onClick={() => handleModeChange('api')}
              icon={<Server className="w-5 h-5" />}
              title="API Mode"
              description="Kết nối backend thực"
            />
          </div>

          {config.mode === 'mock' && (
            <div className="p-3 rounded-lg bg-xhub-reel-surface border border-xhub-reel-border">
              <p className="text-sm text-xhub-reel-text-muted">
                Chế độ Mock sử dụng dữ liệu mẫu có sẵn. Chuyển sang API Mode để
                test với backend thực.
              </p>
            </div>
          )}
        </section>

        {/* API Configuration */}
        {config.mode === 'api' && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="xhub-reel-card p-4 space-y-4"
          >
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-xhub-reel-accent" />
              <h2 className="font-semibold text-xhub-reel-text">Cấu hình API</h2>
            </div>

            {/* Base URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-xhub-reel-text">
                <Link2 className="w-4 h-4" />
                Base URL
              </label>
              <input
                type="url"
                value={config.baseUrl}
                onChange={(e) => config.setBaseUrl(e.target.value)}
                placeholder="https://api.example.com/v1"
                className="w-full px-4 py-3 rounded-xl bg-xhub-reel-surface border border-xhub-reel-border text-xhub-reel-text placeholder:text-xhub-reel-text-muted focus:outline-none focus:border-xhub-reel-accent transition-colors"
              />
              <p className="text-xs text-xhub-reel-text-muted">
                URL gốc của API backend (không có trailing slash)
              </p>
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-xhub-reel-text">
                <Key className="w-4 h-4" />
                API Key
                <span className="text-xhub-reel-text-muted font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={config.apiKey}
                onChange={(e) => config.setApiKey(e.target.value)}
                placeholder="CTUSTAGE"
                className="w-full px-4 py-3 rounded-xl bg-xhub-reel-surface border border-xhub-reel-border text-xhub-reel-text placeholder:text-xhub-reel-text-muted focus:outline-none focus:border-xhub-reel-accent transition-colors font-mono text-sm"
              />
              <p className="text-xs text-xhub-reel-text-muted">
                API key sẽ được thêm vào mọi request: <code className="text-xhub-reel-accent">?api_key=xxx</code>
              </p>
            </div>

            {/* Access Token */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-xhub-reel-text">
                <Key className="w-4 h-4" />
                Access Token
                <span className="text-xhub-reel-text-muted font-normal">(optional)</span>
              </label>
              <input
                type="password"
                value={config.accessToken}
                onChange={(e) => config.setAccessToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIs..."
                className="w-full px-4 py-3 rounded-xl bg-xhub-reel-surface border border-xhub-reel-border text-xhub-reel-text placeholder:text-xhub-reel-text-muted focus:outline-none focus:border-xhub-reel-accent transition-colors font-mono text-sm"
              />
              <p className="text-xs text-xhub-reel-text-muted">
                Bearer token cho authenticated requests
              </p>
            </div>

            {/* Endpoints */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-xhub-reel-text">
                Custom Endpoints
              </h3>

              <div className="space-y-2">
                <label className="text-xs text-xhub-reel-text-muted">
                  Videos Endpoint
                </label>
                <input
                  type="text"
                  value={config.endpoints.videos}
                  onChange={(e) =>
                    config.setEndpoints({ videos: e.target.value })
                  }
                  placeholder="/videos"
                  className="w-full px-3 py-2 rounded-lg bg-xhub-reel-surface border border-xhub-reel-border text-xhub-reel-text text-sm placeholder:text-xhub-reel-text-muted focus:outline-none focus:border-xhub-reel-accent transition-colors font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-xhub-reel-text-muted">
                  Comments Endpoint
                </label>
                <input
                  type="text"
                  value={config.endpoints.comments}
                  onChange={(e) =>
                    config.setEndpoints({ comments: e.target.value })
                  }
                  placeholder="/videos/:videoId/comments"
                  className="w-full px-3 py-2 rounded-lg bg-xhub-reel-surface border border-xhub-reel-border text-xhub-reel-text text-sm placeholder:text-xhub-reel-text-muted focus:outline-none focus:border-xhub-reel-accent transition-colors font-mono"
                />
              </div>
            </div>

            {/* Test Connection */}
            <div className="pt-2 space-y-3">
              <button
                onClick={handleTestConnection}
                disabled={!config.baseUrl || isTesting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-xhub-reel-accent text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang kiểm tra...
                  </>
                ) : (
                  <>
                    <Wifi className="w-5 h-5" />
                    Test Connection
                  </>
                )}
              </button>

              {/* Connection Status */}
              {config.connectionStatus !== 'idle' && (
                <ConnectionStatus
                  status={config.connectionStatus}
                  error={config.lastError}
                />
              )}
            </div>
          </motion.section>
        )}

        {/* Debug Mode */}
        <section className="xhub-reel-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bug className="w-5 h-5 text-xhub-reel-accent" />
              <div>
                <h2 className="font-semibold text-xhub-reel-text">Debug Mode</h2>
                <p className="text-sm text-xhub-reel-text-muted">
                  Log API requests/responses
                </p>
              </div>
            </div>
            <Toggle
              checked={config.debugMode}
              onChange={config.setDebugMode}
            />
          </div>
        </section>

        {/* Reset */}
        <section className="xhub-reel-card p-4">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset tất cả cấu hình
          </button>
        </section>

        {/* Current Config Preview */}
        {config.debugMode && (
          <section className="xhub-reel-card p-4 space-y-3">
            <h2 className="font-semibold text-xhub-reel-text">Config Preview</h2>
            <pre className="p-3 rounded-lg bg-xhub-reel-bg text-xs text-xhub-reel-text-muted overflow-auto font-mono">
              {JSON.stringify(
                {
                  mode: config.mode,
                  baseUrl: config.baseUrl || '(not set)',
                  apiKey: config.apiKey || '(not set)',
                  accessToken: config.accessToken ? '***' : '(not set)',
                  endpoints: config.endpoints,
                },
                null,
                2
              )}
            </pre>
          </section>
        )}
      </main>
    </div>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function ModeButton({
  active,
  onClick,
  icon,
  title,
  description,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <button
      onClick={onClick}
      className={`
        p-4 rounded-xl border text-left transition-all
        ${
          active
            ? 'bg-xhub-reel-accent/20 border-xhub-reel-accent text-xhub-reel-text'
            : 'bg-xhub-reel-surface border-xhub-reel-border text-xhub-reel-text-secondary hover:border-xhub-reel-text-muted'
        }
      `}
    >
      <div
        className={`mb-2 ${active ? 'text-xhub-reel-accent' : 'text-xhub-reel-text-muted'}`}
      >
        {icon}
      </div>
      <div className="font-medium">{title}</div>
      <div className="text-xs text-xhub-reel-text-muted mt-1">{description}</div>
    </button>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative w-12 h-7 rounded-full transition-colors
        ${checked ? 'bg-xhub-reel-accent' : 'bg-xhub-reel-surface border border-xhub-reel-border'}
      `}
    >
      <motion.div
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
      />
    </button>
  )
}

function ConnectionStatus({
  status,
  error,
}: {
  status: 'testing' | 'success' | 'error'
  error: string | null
}) {
  if (status === 'testing') {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-xhub-reel-surface text-xhub-reel-text-muted">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Đang kiểm tra kết nối...</span>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-400">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Kết nối thành công!</span>
      </div>
    )
  }

  return (
    <div className="p-3 rounded-lg bg-red-500/10 space-y-2">
      <div className="flex items-center gap-2 text-red-400">
        <XCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Kết nối thất bại</span>
      </div>
      {error && (
        <p className="text-xs text-red-300/80 font-mono break-all">{error}</p>
      )}
    </div>
  )
}

