import React from 'react'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Section from '@/components/Section'
import Prose from '@/components/Prose'
import { getProjectBySlug, getAllProjects } from '@/lib/projects'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug)
  
  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} - Sebastian Sæthre`,
    description: project.summary,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  return (
    <Section>
      <div className="max-w-4xl mx-auto">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <time className="text-sm text-gray-500">{project.date}</time>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{project.summary}</p>
          
          {/* Tech Stack */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {/* Links */}
          <div className="flex space-x-4">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                View Code
              </a>
            )}
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Project Content */}
        <Prose>
          <MDXRemote source={project.content} />
        </Prose>
      </div>
    </Section>
  )
}
