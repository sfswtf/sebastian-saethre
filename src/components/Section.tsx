import React from 'react'

interface SectionProps {
  children: React.ReactNode
  className?: string
}

export default function Section({ children, className = '' }: SectionProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}
