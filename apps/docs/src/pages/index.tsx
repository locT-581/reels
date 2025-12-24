import clsx from 'clsx'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'
import styles from './index.module.css'

const packages = [
  {
    name: '@vortex/core',
    description: 'Types, stores, hooks, và utilities cốt lõi',
    size: '< 5KB',
    href: '/docs/packages/core',
  },
  {
    name: '@vortex/player',
    description: 'HLS video player tối ưu cho short-form content',
    size: '< 70KB',
    href: '/docs/packages/player',
  },
  {
    name: '@vortex/feed',
    description: 'Virtualized video feed với infinite scroll',
    size: '< 8KB',
    href: '/docs/packages/feed',
  },
  {
    name: '@vortex/gestures',
    description: 'Hệ thống gesture: tap, swipe, long press',
    size: '< 15KB',
    href: '/docs/packages/gestures',
  },
  {
    name: '@vortex/ui',
    description: 'UI components với Vortex Design System',
    size: '< 15KB',
    href: '/docs/packages/ui',
  },
  {
    name: '@vortex/embed',
    description: 'All-in-one embeddable widget',
    size: '< 100KB',
    href: '/docs/packages/embed',
  },
]

const features = [
  {
    title: 'Video-Centric Design',
    emoji: '🎬',
    description:
      'Video chiếm 100% viewport, UI chỉ xuất hiện khi cần. Thiết kế OLED-optimized với nền đen thuần túy.',
  },
  {
    title: 'Physics-First Animation',
    emoji: '⚡',
    description:
      'Spring animations với Motion library. Mọi chuyển động đều có quán tính và độ đàn hồi tự nhiên.',
  },
  {
    title: 'Mobile-First',
    emoji: '📱',
    description:
      'Tối ưu cho touch với gesture system đầy đủ. Tap, double-tap, long press, swipe - tất cả đều mượt mà.',
  },
  {
    title: 'Lightweight',
    emoji: '🪶',
    description:
      'Total bundle < 150KB gzip. Tree-shakable packages - chỉ import những gì bạn cần.',
  },
  {
    title: 'HLS Streaming',
    emoji: '📡',
    description:
      'Adaptive bitrate với hls.js. Time to first frame < 500ms, buffering ratio < 1%.',
  },
  {
    title: 'Offline Support',
    emoji: '📴',
    description:
      'IndexedDB caching, Service Worker, và action queue cho trải nghiệm offline-first.',
  },
]

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          VortexStream
        </Heading>
        <p className="hero__subtitle">
          High-performance short-form video SDK cho React
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started/installation"
          >
            Bắt đầu ngay 🚀
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/"
            style={{ marginLeft: '1rem' }}
          >
            Tìm hiểu thêm
          </Link>
        </div>
        <div className={styles.codePreview}>
          <pre>
            <code>npm install @vortex/embed</code>
          </pre>
        </div>
      </div>
    </header>
  )
}

function PackagesSection() {
  return (
    <section className={styles.packages}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          📦 Packages
        </Heading>
        <p className={styles.sectionSubtitle}>
          Kiến trúc modular - import đúng những gì bạn cần
        </p>
        <div className={styles.packagesGrid}>
          {packages.map((pkg) => (
            <Link key={pkg.name} to={pkg.href} className={styles.packageCard}>
              <div className={styles.packageName}>{pkg.name}</div>
              <div className={styles.packageDescription}>{pkg.description}</div>
              <span className={styles.packageSize}>{pkg.size}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          ✨ Tính năng
        </Heading>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <div className={styles.featureEmoji}>{feature.emoji}</div>
              <Heading as="h3" className={styles.featureTitle}>
                {feature.title}
              </Heading>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuickStartSection() {
  return (
    <section className={styles.quickStart}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          🚀 Quick Start
        </Heading>
        <div className={styles.codeBlock}>
          <pre>
            <code>{`import { VortexEmbed } from '@vortex/embed'

function App() {
  return (
    <VortexEmbed
      videos={videos}
      config={{
        autoPlay: true,
        muted: true,
        showControls: true,
      }}
      onVideoChange={(video) => console.log('Now playing:', video.id)}
      onLike={(videoId) => handleLike(videoId)}
    />
  )
}`}</code>
          </pre>
        </div>
        <div className={styles.buttons} style={{ marginTop: '2rem' }}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started/quick-start"
          >
            Xem hướng dẫn đầy đủ
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`${siteConfig.title} - Short-form Video SDK`}
      description="High-performance short-form video SDK for React. TikTok-style video feed, HLS streaming, gesture system, and more."
    >
      <HomepageHeader />
      <main>
        <PackagesSection />
        <FeaturesSection />
        <QuickStartSection />
      </main>
    </Layout>
  )
}

