import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ProjectCardProps {
  title: string
  summary: string
  date: string
  tags: string[]
  externalUrl?: string
  repoUrl?: string
  stack: string[]
  cover?: string
  slug: string
}

export default function ProjectCard({
  title,
  summary,
  date,
  tags,
  externalUrl,
  repoUrl,
  stack,
  cover,
  slug
}: ProjectCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {cover && (
        <div className="relative h-48 w-full">
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <time className="text-sm text-gray-500">{date}</time>
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{summary}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {stack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <Link
            href={`/projects/${slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Read more →
          </Link>
          <div className="flex space-x-3">
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Code
              </a>
            )}
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
