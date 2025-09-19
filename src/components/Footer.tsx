import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-200/60 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-neutral-500 dark:text-neutral-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} Sebastian Sæthre
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/sfswtf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/sebastian-saethre"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
