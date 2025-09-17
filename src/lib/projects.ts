import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Project {
  slug: string
  title: string
  summary: string
  date: string
  tags: string[]
  externalUrl?: string
  repoUrl?: string
  stack: string[]
  cover?: string
  content: string
}

const projectsDirectory = path.join(process.cwd(), 'src/content/projects')

export async function getAllProjects(): Promise<Project[]> {
  try {
    if (!fs.existsSync(projectsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(projectsDirectory)
    const projects = fileNames
      .filter(name => name.endsWith('.mdx'))
      .map(fileName => {
        const slug = fileName.replace(/\.mdx$/, '')
        const fullPath = path.join(projectsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          slug,
          title: data.title || '',
          summary: data.summary || '',
          date: data.date || '',
          tags: data.tags || [],
          externalUrl: data.externalUrl,
          repoUrl: data.repoUrl,
          stack: data.stack || [],
          cover: data.cover,
          content,
        } as Project
      })

    return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const fullPath = path.join(projectsDirectory, `${slug}.mdx`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || '',
      summary: data.summary || '',
      date: data.date || '',
      tags: data.tags || [],
      externalUrl: data.externalUrl,
      repoUrl: data.repoUrl,
      stack: data.stack || [],
      cover: data.cover,
      content,
    } as Project
  } catch (error) {
    console.error('Error loading project:', error)
    return null
  }
}
