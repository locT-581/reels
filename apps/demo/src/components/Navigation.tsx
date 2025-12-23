'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import {
  Home,
  Play,
  Layers,
  Hand,
  Palette,
  BookOpen,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  description: string
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
    description: 'Landing page',
  },
  {
    label: 'Feed',
    href: '/feed',
    icon: Play,
    description: 'Video feed demo',
  },
  {
    label: 'Player',
    href: '/player',
    icon: Play,
    description: 'Single player demo',
  },
  {
    label: 'Components',
    href: '/components',
    icon: Layers,
    description: 'UI components showcase',
  },
  {
    label: 'Gestures',
    href: '/gestures',
    icon: Hand,
    description: 'Gesture system demo',
  },
  {
    label: 'Design',
    href: '/design',
    icon: Palette,
    description: 'Design system',
  },
  {
    label: 'Docs',
    href: '/docs',
    icon: BookOpen,
    description: 'Documentation',
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-100 p-3 rounded-full vortex-glass vortex-transition"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-vortex-text" />
        ) : (
          <Menu className="w-6 h-6 text-vortex-text" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-90"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation Panel */}
      <motion.nav
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-95 vortex-glass border-l border-vortex-border p-6 overflow-y-auto"
      >
        <div className="pt-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-vortex-accent to-purple-600 flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-vortex-text">
                VortexStream
              </h2>
              <p className="text-xs text-vortex-text-muted">Demo App</p>
            </div>
          </div>

          {/* Nav Items */}
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-4 p-4 rounded-xl vortex-transition
                      ${
                        isActive
                          ? 'bg-vortex-accent text-white'
                          : 'text-vortex-text-secondary hover:bg-vortex-glass-light hover:text-vortex-text'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div
                        className={`text-xs ${
                          isActive ? 'text-white/70' : 'text-vortex-text-muted'
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="ml-auto w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Version Badge */}
          <div className="mt-8 p-4 rounded-xl bg-vortex-surface border border-vortex-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-vortex-text-muted">Version</span>
              <span className="vortex-badge">v0.0.1</span>
            </div>
          </div>

          {/* External Links */}
          <div className="mt-6 space-y-2">
            <a
              href="https://github.com/your-org/vortexstream"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg text-vortex-text-muted hover:text-vortex-text vortex-transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href="/docs"
              className="flex items-center gap-3 p-3 rounded-lg text-vortex-text-muted hover:text-vortex-text vortex-transition"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">Documentation</span>
            </a>
          </div>
        </div>
      </motion.nav>
    </>
  )
}

