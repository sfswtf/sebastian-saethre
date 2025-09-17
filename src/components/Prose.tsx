import React from 'react'

interface ProseProps {
  children: React.ReactNode
  className?: string
}

export default function Prose({ children, className = '' }: ProseProps) {
  return (
    <div className={`prose prose-lg prose-gray max-w-none ${className}`}>
      {children}
    </div>
  )
}
