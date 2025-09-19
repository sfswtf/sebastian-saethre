import React from 'react'
import Section from '@/components/Section'
import ProjectCard from '@/components/ProjectCard'
import { getAllProjects } from '@/lib/projects'

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <Section>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold tracking-tight mb-4">My Projects</h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          A collection of projects I&apos;ve worked on, showcasing my skills in full stack development, 
          modern web technologies, and problem-solving.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            title={project.title}
            summary={project.summary}
            date={project.date}
            tags={project.tags}
            externalUrl={project.externalUrl}
            repoUrl={project.repoUrl}
            stack={project.stack}
            cover={project.cover}
            slug={project.slug}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-300">No projects found. Check back soon for updates!</p>
        </div>
      )}
    </Section>
  )
}
