import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <p className="text-sm uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          Full Stack Developer
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">
          Systems that scale and experiences that delight.
        </h1>
        <p className="mt-4 max-w-2xl text-neutral-600 dark:text-neutral-300">
          I design and build modern web applications with clean architecture, exceptional user experience, and maintainable code that grows with your business.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link 
            href="/contact" 
            className="inline-flex items-center rounded-xl px-5 py-3 bg-neutral-900 text-white dark:bg-blue-500 dark:text-black shadow-lg hover:opacity-90 transition-opacity"
          >
            Start a project
          </Link>
          <Link 
            href="/projects" 
            className="inline-flex items-center rounded-xl px-5 py-3 border border-neutral-300 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
          >
            See my work
          </Link>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight mb-6">About Me</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              I&apos;m a full stack developer with a passion for creating exceptional digital experiences. 
              I specialize in modern web technologies including React, Next.js, TypeScript, and Node.js.
            </p>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              When I&apos;m not coding, you can find me exploring new technologies, contributing to open source projects, 
              or sharing knowledge with the developer community.
            </p>
            <Link
              href="/about"
              className="text-blue-500 hover:opacity-80 font-medium transition-opacity"
            >
              Learn more about me →
            </Link>
          </div>
          <div className="bg-neutral-50 dark:bg-slate-800 rounded-2xl p-8">
            <h3 className="text-xl font-semibold tracking-tight mb-4">Skills & Technologies</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Frontend</h4>
                <ul className="text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
                  <li>React &amp; Next.js</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Backend</h4>
                <ul className="text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
                  <li>Node.js</li>
                  <li>PostgreSQL</li>
                  <li>Supabase</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-neutral-50 dark:bg-slate-800 rounded-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl mx-auto">
            I&apos;m always interested in new opportunities and exciting projects. Let&apos;s discuss how we can bring your ideas to life.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-xl px-5 py-3 bg-neutral-900 text-white dark:bg-blue-500 dark:text-black shadow-lg hover:opacity-90 transition-opacity"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  )
}
