'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Play,
  Layers,
  Hand,
  Palette,
  Zap,
  Smartphone,
  Shield,
  ArrowRight,
  Star,
  Github,
  BookOpen,
} from 'lucide-react'
import { Navigation } from '@/components/Navigation'

const features = [
  {
    icon: Play,
    title: 'Video Feed',
    description: 'High-performance video carousel với gesture-based navigation',
    href: '/feed',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Layers,
    title: 'UI Components',
    description: 'Bộ components thiết kế theo XHubReel design System',
    href: '/components',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Hand,
    title: 'Gesture System',
    description: 'Touch-optimized interactions cho video player',
    href: '/gestures',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Palette,
    title: 'Design System',
    description: 'XHubReel design - Mobile-first dark mode design',
    href: '/design',
    color: 'from-amber-500 to-orange-500',
  },
]

const stats = [
  { label: 'Bundle Size', value: '<150KB', suffix: 'gzip' },
  { label: 'LCP', value: '<1.5s', suffix: 'target' },
  { label: 'Scroll', value: '60fps', suffix: 'smooth' },
  { label: 'TTI', value: '<2s', suffix: 'target' },
]

const highlights = [
  {
    icon: Zap,
    title: 'Tối ưu hiệu năng',
    description: 'Chỉ 3 DOM nodes trong feed, direct DOM manipulation, RAF batching',
  },
  {
    icon: Smartphone,
    title: 'Mobile-first',
    description: '100% viewport video, OLED optimized, touch gestures',
  },
  {
    icon: Shield,
    title: 'TypeScript',
    description: 'Strict mode, full type safety, excellent DX',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-xhub-reel-bg">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-xhub-reel-accent/20 rounded-full blur-[128px] animate-xhub-reel-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-[100px] animate-xhub-reel-pulse" style={{ animationDelay: '1s' }} />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-xhub-reel-border bg-xhub-reel-surface/50 backdrop-blur-sm mb-8"
          >
            <Star className="w-4 h-4 text-xhub-reel-accent fill-xhub-reel-accent" />
            <span className="text-sm text-xhub-reel-text-secondary">
              XHubReel Demo v0.0.1
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-xhub-reel-text">Short-form</span>
            <br />
            <span className="bg-linear-to-r from-xhub-reel-accent via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Video Platform
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-xhub-reel-text-secondary max-w-2xl mx-auto mb-10"
          >
            High-performance video feed với{' '}
            <span className="text-xhub-reel-text font-medium">gesture-based navigation</span>,{' '}
            <span className="text-xhub-reel-text font-medium">HLS streaming</span>, và{' '}
            <span className="text-xhub-reel-text font-medium">mobile-first design</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/feed"
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-linear-to-r from-xhub-reel-accent to-purple-600 text-white font-semibold text-lg xhub-reel-transition hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-105"
            >
              <Play className="w-5 h-5 fill-white" />
              Xem Demo Feed
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 xhub-reel-transition" />
            </Link>
            <Link
              href="/components"
              className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-xhub-reel-border bg-xhub-reel-surface/50 backdrop-blur-sm text-xhub-reel-text font-semibold text-lg xhub-reel-transition hover:border-xhub-reel-accent hover:bg-xhub-reel-surface"
            >
              <Layers className="w-5 h-5" />
              Components
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-xhub-reel-border"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.6 + index * 0.1,
                  }}
                  className="text-3xl md:text-4xl font-bold text-xhub-reel-text mb-1"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-xhub-reel-text-muted">
                  {stat.label}
                  <span className="text-xhub-reel-accent ml-1">{stat.suffix}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-xhub-reel-text-muted">
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-xhub-reel-border flex items-start justify-center p-2"
            >
              <div className="w-1 h-2 rounded-full bg-xhub-reel-accent" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-xhub-reel-text mb-4">
              Khám phá Features
            </h2>
            <p className="text-lg text-xhub-reel-text-secondary max-w-2xl mx-auto">
              Tất cả các tính năng được thiết kế cho trải nghiệm video mobile-first tốt nhất
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={feature.href}
                    className="group block p-6 rounded-2xl border border-xhub-reel-border bg-xhub-reel-surface/50 backdrop-blur-sm xhub-reel-transition hover:border-xhub-reel-accent hover:bg-xhub-reel-surface"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-xhub-reel-text mb-2 group-hover:text-xhub-reel-accent xhub-reel-transition">
                          {feature.title}
                        </h3>
                        <p className="text-xhub-reel-text-secondary">
                          {feature.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-xhub-reel-text-muted group-hover:text-xhub-reel-accent group-hover:translate-x-1 xhub-reel-transition" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 px-6 bg-xhub-reel-surface/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-xhub-reel-text mb-4">
              Tại sao chọn XHubReel?
            </h2>
            <p className="text-lg text-xhub-reel-text-secondary max-w-2xl mx-auto">
              Được xây dựng với focus vào performance và developer experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-xhub-reel-accent/10 border border-xhub-reel-accent/20 mb-6">
                    <Icon className="w-8 h-8 text-xhub-reel-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-xhub-reel-text mb-3">
                    {highlight.title}
                  </h3>
                  <p className="text-xhub-reel-text-secondary">
                    {highlight.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-xhub-reel-text mb-4">
              Đơn giản để tích hợp
            </h2>
            <p className="text-lg text-xhub-reel-text-secondary">
              Chỉ với vài dòng code để có một video feed hoàn chỉnh
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-xhub-reel-border bg-xhub-reel-surface overflow-hidden"
          >
            {/* Code Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-xhub-reel-border">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-sm text-xhub-reel-text-muted">
                App.tsx
              </span>
            </div>

            {/* Code Content */}
            <pre className="p-6 overflow-x-auto text-sm">
              <code className="font-mono">
                <span className="text-purple-400">import</span>{' '}
                <span className="text-cyan-400">{'{ VideoFeed }'}</span>{' '}
                <span className="text-purple-400">from</span>{' '}
                <span className="text-green-400">&apos;@xhub-reel/feed&apos;</span>
                {'\n'}
                <span className="text-purple-400">import</span>{' '}
                <span className="text-cyan-400">{'{ videos }'}</span>{' '}
                <span className="text-purple-400">from</span>{' '}
                <span className="text-green-400">&apos;./data&apos;</span>
                {'\n\n'}
                <span className="text-purple-400">export default function</span>{' '}
                <span className="text-yellow-400">App</span>
                <span className="text-gray-400">() {'{'}</span>
                {'\n'}
                {'  '}
                <span className="text-purple-400">return</span>{' '}
                <span className="text-gray-400">(</span>
                {'\n'}
                {'    '}
                <span className="text-cyan-400">{'<VideoFeed'}</span>
                {'\n'}
                {'      '}
                <span className="text-orange-400">videos</span>
                <span className="text-gray-400">=</span>
                <span className="text-cyan-400">{'{videos}'}</span>
                {'\n'}
                {'      '}
                <span className="text-orange-400">onLike</span>
                <span className="text-gray-400">=</span>
                <span className="text-cyan-400">{'{handleLike}'}</span>
                {'\n'}
                {'      '}
                <span className="text-orange-400">onComment</span>
                <span className="text-gray-400">=</span>
                <span className="text-cyan-400">{'{handleComment}'}</span>
                {'\n'}
                {'      '}
                <span className="text-orange-400">onShare</span>
                <span className="text-gray-400">=</span>
                <span className="text-cyan-400">{'{handleShare}'}</span>
                {'\n'}
                {'    '}
                <span className="text-cyan-400">{'/>'}</span>
                {'\n'}
                {'  '}
                <span className="text-gray-400">)</span>
                {'\n'}
                <span className="text-gray-400">{'}'}</span>
              </code>
            </pre>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-linear-to-br from-xhub-reel-accent/20 via-purple-600/10 to-pink-500/20" />
            <div className="absolute inset-0 bg-xhub-reel-surface/80 backdrop-blur-xl" />

            {/* Content */}
            <div className="relative p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-xhub-reel-text mb-4">
                Sẵn sàng để bắt đầu?
              </h2>
              <p className="text-lg text-xhub-reel-text-secondary max-w-xl mx-auto mb-8">
                Khám phá tất cả các tính năng và bắt đầu xây dựng ứng dụng video của bạn ngay hôm nay.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/feed"
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-xhub-reel-accent text-white font-semibold text-lg xhub-reel-transition hover:bg-xhub-reel-accent-hover hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Trải nghiệm Demo
                </Link>
                <a
                  href="https://github.com/your-org/xhubreel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-xhub-reel-border text-xhub-reel-text font-semibold text-lg xhub-reel-transition hover:border-xhub-reel-accent"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-xhub-reel-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-xhub-reel-accent to-purple-600 flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-semibold text-xhub-reel-text">
                XHubReel
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/your-org/xhubreel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xhub-reel-text-muted hover:text-xhub-reel-text xhub-reel-transition"
              >
                <Github className="w-5 h-5" />
              </a>
              <Link
                href="/docs"
                className="text-xhub-reel-text-muted hover:text-xhub-reel-text xhub-reel-transition"
              >
                <BookOpen className="w-5 h-5" />
              </Link>
            </div>

            <p className="text-sm text-xhub-reel-text-muted">
              © 2024 XHubReel. Demo App.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

