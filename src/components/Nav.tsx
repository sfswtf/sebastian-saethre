import React from 'react'
import Link from 'next/link'

export default function Nav() {
  return (
    <div className="sticky top-0 z-50 backdrop-blur border-b border-neutral-200/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60">
      <nav className="mx-auto max-w-7xl px-4 flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          sebastiansaethre.no
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/projects" className="hover:opacity-80 transition-opacity">
            Projects
          </Link>
          <Link href="/about" className="hover:opacity-80 transition-opacity">
            About
          </Link>
          <Link 
            href="/contact" 
            className="inline-flex items-center rounded-full px-3 py-1.5 bg-neutral-900 text-white dark:bg-blue-500 dark:text-black transition-colors"
          >
            Contact
          </Link>
        </div>
      </nav>
    </div>
  )
}
