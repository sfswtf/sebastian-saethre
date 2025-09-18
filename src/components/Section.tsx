import React from 'react'

interface SectionProps {
  children: React.ReactNode
  className?: string
}

export default function Section({ children, className = '' }: SectionProps) {
  return (
    <section className={`py-16 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4">
        {children}
      </div>
    </section>
  )
}
