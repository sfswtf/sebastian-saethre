import React from 'react'

interface ProseProps {
  children: React.ReactNode
  className?: string
}

export default function Prose({ children, className = '' }: ProseProps) {
  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      {children}
    </div>
  )
}
