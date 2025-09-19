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
  externalUrl,
  repoUrl,
  stack,
  cover,
  slug
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="group block rounded-2xl border border-neutral-200 dark:border-white/10 overflow-hidden hover:shadow-2xl transition-shadow"
    >
      {cover && (
        <div className="relative h-44 w-full">
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-lg font-semibold tracking-tight group-hover:opacity-90 transition-opacity">
          {title}
        </h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          {summary}
        </p>
        {stack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {stack.map((tech) => (
              <span 
                key={tech} 
                className="text-xs rounded-full px-2 py-1 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">
            {date}
          </span>
          <div className="flex items-center gap-3">
            {repoUrl && (
              <span className="text-neutral-500 dark:text-neutral-400 hover:opacity-80">
                Code
              </span>
            )}
            {externalUrl && (
              <span className="text-neutral-500 dark:text-neutral-400 hover:opacity-80">
                Demo
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
