'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Navigation } from '@/components/Navigation'
import { Copy, Check, Palette, Type, Box, Sparkles, Grid3X3 } from 'lucide-react'

// Design System Colors
const colors = {
  primary: [
    { name: 'Background', value: '#000000', css: '--color-xhub-reel-bg' },
    { name: 'Surface', value: '#111111', css: '--color-xhub-reel-surface' },
    { name: 'Surface Elevated', value: '#1a1a1a', css: '--color-xhub-reel-surface-elevated' },
    { name: 'Border', value: 'rgba(255, 255, 255, 0.1)', css: '--color-xhub-reel-border' },
  ],
  text: [
    { name: 'Text Primary', value: '#ffffff', css: '--color-xhub-reel-text' },
    { name: 'Text Secondary', value: 'rgba(255, 255, 255, 0.7)', css: '--color-xhub-reel-text-secondary' },
    { name: 'Text Muted', value: 'rgba(255, 255, 255, 0.5)', css: '--color-xhub-reel-text-muted' },
  ],
  accent: [
    { name: 'Accent (Electric Violet)', value: '#8B5CF6', css: '--color-xhub-reel-accent' },
    { name: 'Accent Hover', value: '#7C3AED', css: '--color-xhub-reel-accent-hover' },
    { name: 'Accent Glow', value: 'rgba(139, 92, 246, 0.4)', css: '--color-xhub-reel-accent-glow' },
  ],
  action: [
    { name: 'Like (Pink)', value: '#FF2D55', css: '--color-xhub-reel-like' },
    { name: 'Success', value: '#34D399', css: '--color-xhub-reel-success' },
    { name: 'Warning', value: '#FBBF24', css: '--color-xhub-reel-warning' },
    { name: 'Error', value: '#EF4444', css: '--color-xhub-reel-error' },
  ],
}

// Spacing scale
const spacingScale = [
  { name: 'xs', value: '4px', px: 4 },
  { name: 'sm', value: '8px', px: 8 },
  { name: 'md', value: '16px', px: 16 },
  { name: 'lg', value: '24px', px: 24 },
  { name: 'xl', value: '32px', px: 32 },
  { name: '2xl', value: '48px', px: 48 },
  { name: '3xl', value: '64px', px: 64 },
]

// Border radius
const radiusScale = [
  { name: 'sm', value: '8px' },
  { name: 'md', value: '12px' },
  { name: 'lg', value: '16px' },
  { name: 'xl', value: '24px' },
  { name: 'full', value: '9999px' },
]

// Typography
const typography = [
  { name: 'heading-lg', size: '32px', weight: '700', sample: 'Large Heading' },
  { name: 'heading-md', size: '24px', weight: '600', sample: 'Medium Heading' },
  { name: 'heading-sm', size: '18px', weight: '600', sample: 'Small Heading' },
  { name: 'body-lg', size: '16px', weight: '400', sample: 'Large body text' },
  { name: 'body-md', size: '14px', weight: '400', sample: 'Medium body text' },
  { name: 'body-sm', size: '12px', weight: '400', sample: 'Small body text' },
  { name: 'caption', size: '11px', weight: '500', sample: 'Caption text' },
]

// Animations
const animations = [
  { name: 'Spring Easing', value: 'cubic-bezier(0.32, 0.72, 0, 1)', css: '--ease-xhub-reel-spring' },
  { name: 'Duration Fast', value: '150ms', css: '--duration-xhub-reel-fast' },
  { name: 'Duration Normal', value: '300ms', css: '--duration-xhub-reel-normal' },
  { name: 'Duration Slow', value: '500ms', css: '--duration-xhub-reel-slow' },
]

function ColorSwatch({ color, onCopy }: { color: { name: string; value: string; css: string }; onCopy: (text: string) => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy(color.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="group relative cursor-pointer"
      onClick={handleCopy}
    >
      <div
        className="w-full h-20 rounded-xl border border-xhub-reel-border mb-2 transition-transform group-hover:scale-105"
        style={{ backgroundColor: color.value }}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-xhub-reel-text">{color.name}</p>
          <p className="text-xs text-xhub-reel-text-muted font-mono">{color.value}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? (
            <Check className="w-4 h-4 text-xhub-reel-success" />
          ) : (
            <Copy className="w-4 h-4 text-xhub-reel-text-muted" />
          )}
        </div>
      </div>
    </div>
  )
}

export default function DesignPage() {
  const [copiedText, setCopiedText] = useState('')

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
  }

  return (
    <div className="min-h-screen bg-xhub-reel-bg">
      <Navigation />

      {/* Page Header */}
      <div className="sticky top-0 z-30 pt-4 px-6 pb-4 xhub-reel-glass">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-xhub-reel-text">Design System</h1>
          <p className="text-sm text-xhub-reel-text-muted">
            XHubReel design - Mobile-first dark mode design system
          </p>
        </div>
      </div>

      <main className="px-6 pb-32 pt-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Design Principles */}
          <section className="xhub-reel-card">
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-xhub-reel-accent" />
              Design Principles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-xhub-reel-surface-elevated border border-xhub-reel-border">
                <h3 className="font-semibold text-xhub-reel-text mb-2">Video-centric</h3>
                <p className="text-sm text-xhub-reel-text-secondary">
                  Video chiếm 100% viewport, UI là &quot;bóng ma&quot; - chỉ xuất hiện khi cần
                </p>
              </div>
              <div className="p-4 rounded-xl bg-xhub-reel-surface-elevated border border-xhub-reel-border">
                <h3 className="font-semibold text-xhub-reel-text mb-2">Mobile-first</h3>
                <p className="text-sm text-xhub-reel-text-secondary">
                  Thiết kế cho mobile trước, OLED optimized với pitch black background
                </p>
              </div>
              <div className="p-4 rounded-xl bg-xhub-reel-surface-elevated border border-xhub-reel-border">
                <h3 className="font-semibold text-xhub-reel-text mb-2">Reachability</h3>
                <p className="text-sm text-xhub-reel-text-secondary">
                  Actions ở bottom 1/3 màn hình, dễ với tay khi dùng một tay
                </p>
              </div>
            </div>
          </section>

          {/* Colors */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-xhub-reel-accent" />
              Colors
            </h2>

            <div className="space-y-8">
              <div className="xhub-reel-card">
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-4">Primary / Surfaces</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {colors.primary.map((color) => (
                    <ColorSwatch key={color.name} color={color} onCopy={handleCopy} />
                  ))}
                </div>
              </div>

              <div className="xhub-reel-card">
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-4">Text</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {colors.text.map((color) => (
                    <ColorSwatch key={color.name} color={color} onCopy={handleCopy} />
                  ))}
                </div>
              </div>

              <div className="xhub-reel-card">
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-4">Accent</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {colors.accent.map((color) => (
                    <ColorSwatch key={color.name} color={color} onCopy={handleCopy} />
                  ))}
                </div>
              </div>

              <div className="xhub-reel-card">
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-4">Action Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {colors.action.map((color) => (
                    <ColorSwatch key={color.name} color={color} onCopy={handleCopy} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6 flex items-center gap-2">
              <Type className="w-5 h-5 text-xhub-reel-accent" />
              Typography
            </h2>

            <div className="xhub-reel-card space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-xhub-reel-surface-elevated border border-xhub-reel-border">
                <span className="text-sm text-xhub-reel-text-muted">Font Family:</span>
                <span className="font-semibold text-xhub-reel-text">Geist, Inter, system-ui</span>
              </div>

              <div className="space-y-4">
                {typography.map((type) => (
                  <div
                    key={type.name}
                    className="flex items-center justify-between p-4 rounded-xl bg-xhub-reel-surface-elevated border border-xhub-reel-border"
                  >
                    <div
                      className="text-xhub-reel-text"
                      style={{ fontSize: type.size, fontWeight: type.weight }}
                    >
                      {type.sample}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-xhub-reel-text">{type.name}</p>
                      <p className="text-xs text-xhub-reel-text-muted">
                        {type.size} / {type.weight}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Spacing */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6 flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-xhub-reel-accent" />
              Spacing (8pt Grid)
            </h2>

            <div className="xhub-reel-card">
              <div className="space-y-4">
                {spacingScale.map((space) => (
                  <div
                    key={space.name}
                    className="flex items-center gap-4"
                  >
                    <div className="w-16 text-sm text-xhub-reel-text-muted">{space.name}</div>
                    <div
                      className="h-6 bg-xhub-reel-accent rounded"
                      style={{ width: space.px * 2 }}
                    />
                    <div className="text-sm text-xhub-reel-text font-mono">{space.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Border Radius */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6 flex items-center gap-2">
              <Box className="w-5 h-5 text-xhub-reel-accent" />
              Border Radius
            </h2>

            <div className="xhub-reel-card">
              <div className="flex flex-wrap gap-6">
                {radiusScale.map((radius) => (
                  <div key={radius.name} className="text-center">
                    <div
                      className="w-20 h-20 bg-xhub-reel-accent mb-2"
                      style={{ borderRadius: radius.value }}
                    />
                    <p className="text-sm font-medium text-xhub-reel-text">{radius.name}</p>
                    <p className="text-xs text-xhub-reel-text-muted">{radius.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Animations */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-xhub-reel-accent" />
              Animation
            </h2>

            <div className="xhub-reel-card space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {animations.map((anim) => (
                  <div
                    key={anim.name}
                    className="p-4 rounded-xl bg-xhub-reel-surface-elevated border border-xhub-reel-border"
                  >
                    <p className="text-sm font-medium text-xhub-reel-text">{anim.name}</p>
                    <p className="text-xs text-xhub-reel-text-muted font-mono mt-1">{anim.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-medium text-xhub-reel-text-muted mb-4">Animation Preview</h3>
                <div className="flex flex-wrap gap-6">
                  <div className="text-center">
                    <motion.div
                      className="w-16 h-16 bg-xhub-reel-accent rounded-xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1], repeat: Infinity, repeatDelay: 1 }}
                    />
                    <p className="text-xs text-xhub-reel-text-muted mt-2">Spring Scale</p>
                  </div>

                  <div className="text-center">
                    <motion.div
                      className="w-16 h-16 bg-xhub-reel-like rounded-xl"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], repeat: Infinity, repeatDelay: 0.5 }}
                    />
                    <p className="text-xs text-xhub-reel-text-muted mt-2">Bounce</p>
                  </div>

                  <div className="text-center">
                    <motion.div
                      className="w-16 h-16 bg-xhub-reel-success rounded-xl"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
                    />
                    <p className="text-xs text-xhub-reel-text-muted mt-2">Spin</p>
                  </div>

                  <div className="text-center">
                    <motion.div
                      className="w-16 h-16 bg-xhub-reel-warning rounded-xl"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
                    />
                    <p className="text-xs text-xhub-reel-text-muted mt-2">Pulse</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Glassmorphism */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6">Glassmorphism</h2>
            <div className="relative h-[300px] rounded-2xl overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-xhub-reel-accent/30 via-pink-500/20 to-orange-500/30" />

              {/* Glass card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 p-6 rounded-2xl xhub-reel-glass border border-xhub-reel-border">
                <h3 className="text-lg font-semibold text-xhub-reel-text mb-2">Glass Card</h3>
                <p className="text-sm text-xhub-reel-text-secondary">
                  Using backdrop-filter: blur(20px) with semi-transparent background
                </p>
                <div className="mt-4 p-3 rounded-lg bg-xhub-reel-glass-light">
                  <code className="text-xs font-mono text-xhub-reel-text-muted">
                    bg-black/80 backdrop-blur-xl
                  </code>
                </div>
              </div>
            </div>
          </section>

          {/* Shadows */}
          <section>
            <h2 className="text-xl font-semibold text-xhub-reel-text mb-6">Shadows</h2>
            <div className="xhub-reel-card">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div
                    className="w-24 h-24 mx-auto bg-xhub-reel-surface-elevated rounded-xl mb-3"
                    style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
                  />
                  <p className="text-sm text-xhub-reel-text">shadow-sm</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-24 h-24 mx-auto bg-xhub-reel-surface-elevated rounded-xl mb-3"
                    style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)' }}
                  />
                  <p className="text-sm text-xhub-reel-text">shadow-md</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-24 h-24 mx-auto bg-xhub-reel-surface-elevated rounded-xl mb-3"
                    style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)' }}
                  />
                  <p className="text-sm text-xhub-reel-text">shadow-lg</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-24 h-24 mx-auto bg-xhub-reel-accent rounded-xl mb-3"
                    style={{ boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}
                  />
                  <p className="text-sm text-xhub-reel-text">shadow-glow</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Copy notification */}
      {copiedText && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full xhub-reel-glass animate-xhub-reel-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-xhub-reel-success" />
            <span className="text-sm text-xhub-reel-text">Copied: {copiedText}</span>
          </div>
        </div>
      )}
    </div>
  )
}

