import React from 'react'
import Link from 'next/link'

interface CTAProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
  variant?: 'primary' | 'secondary'
}

export default function CTA({
  title,
  description,
  buttonText,
  buttonHref,
  variant = 'primary'
}: CTAProps) {
  const bgColor = variant === 'primary' ? 'bg-blue-600' : 'bg-gray-100'
  const textColor = variant === 'primary' ? 'text-white' : 'text-gray-900'
  const buttonColor = variant === 'primary' 
    ? 'bg-white text-blue-600 hover:bg-gray-50' 
    : 'bg-blue-600 text-white hover:bg-blue-700'

  return (
    <div className={`${bgColor} ${textColor} rounded-lg p-8 text-center`}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-lg mb-6 opacity-90">{description}</p>
      <Link
        href={buttonHref}
        className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${buttonColor}`}
      >
        {buttonText}
      </Link>
    </div>
  )
}
