import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Sebastian Sæthre. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="https://github.com/sfswtf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/sebastian-saethre"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
