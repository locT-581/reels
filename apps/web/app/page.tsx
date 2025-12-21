'use client'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-vortex-black">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">
          <span className="text-vortex-violet">Vortex</span>Stream
        </h1>
        <p className="text-vortex-gray">The Infinite Flow - Coming Soon</p>

        {/* Test Vortex design system colors */}
        <div className="mt-8 flex gap-4">
          <div className="h-12 w-12 rounded-2xl bg-vortex-black ring-2 ring-white/20" />
          <div className="h-12 w-12 rounded-2xl bg-vortex-violet" />
          <div className="h-12 w-12 rounded-2xl bg-vortex-red" />
          <div className="h-12 w-12 rounded-2xl bg-vortex-gray" />
        </div>

        <p className="mt-4 text-xs text-vortex-gray">
          Phase 0: Project Setup Complete
        </p>
      </div>
    </main>
  )
}

