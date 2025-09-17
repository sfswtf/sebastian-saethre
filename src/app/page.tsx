import React from 'react'
import Link from 'next/link'
import Section from '@/components/Section'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Hi, I&apos;m <span className="text-blue-600">Sebastian Sæthre</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A passionate full stack developer who loves building modern web applications 
            with cutting-edge technologies and clean, maintainable code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View My Work
            </Link>
            <Link
              href="/contact"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </Section>

      {/* About Preview */}
      <Section>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Me</h2>
            <p className="text-gray-600 mb-4">
              I&apos;m a full stack developer with a passion for creating exceptional digital experiences. 
              I specialize in modern web technologies including React, Next.js, TypeScript, and Node.js.
            </p>
            <p className="text-gray-600 mb-6">
              When I&apos;m not coding, you can find me exploring new technologies, contributing to open source projects, 
              or sharing knowledge with the developer community.
            </p>
            <a
              href="/about"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Learn more about me →
            </a>
          </div>
          <div className="bg-gray-100 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills & Technologies</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Frontend</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>React &amp; Next.js</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Backend</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Node.js</li>
                  <li>PostgreSQL</li>
                  <li>Supabase</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gray-50">
        <CTA
          title="Let's Work Together"
          description="I'm always interested in new opportunities and exciting projects. Let's discuss how we can bring your ideas to life."
          buttonText="Start a Conversation"
          buttonHref="/contact"
          variant="primary"
        />
      </Section>
    </>
  )
}
