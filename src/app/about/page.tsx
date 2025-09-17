import React from 'react'
import Section from '@/components/Section'
import Prose from '@/components/Prose'

export default function AboutPage() {
  return (
    <Section>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Me</h1>
        
        <Prose>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <h2>Hello, I&apos;m Sebastian Sæthre</h2>
              <p>
                I&apos;m a passionate full stack developer with a love for creating exceptional digital experiences. 
                My journey in software development began several years ago, and since then, I&apos;ve been dedicated 
                to mastering modern web technologies and best practices.
              </p>
              
              <p>
                I specialize in building scalable web applications using React, Next.js, TypeScript, and Node.js. 
                I believe in writing clean, maintainable code and following industry best practices to deliver 
                high-quality solutions.
              </p>

              <h3>What I Do</h3>
              <ul>
                <li>Full stack web application development</li>
                <li>Frontend development with React and Next.js</li>
                <li>Backend API development with Node.js</li>
                <li>Database design and optimization</li>
                <li>UI/UX implementation with modern CSS frameworks</li>
                <li>Performance optimization and SEO</li>
              </ul>

              <h3>My Approach</h3>
              <p>
                I believe in user-centered design and development. Every project I work on starts with 
                understanding the user&apos;s needs and business goals. I then translate these requirements 
                into technical solutions that are both functional and delightful to use.
              </p>
            </div>

            <div>
              <h3>Technologies I Use</h3>
              
              <h4>Frontend</h4>
              <ul>
                <li>React &amp; Next.js</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>HTML5 &amp; CSS3</li>
              </ul>

              <h4>Backend</h4>
              <ul>
                <li>Node.js</li>
                <li>Express.js</li>
                <li>PostgreSQL</li>
                <li>Supabase</li>
                <li>RESTful APIs</li>
              </ul>

              <h4>Tools & Others</h4>
              <ul>
                <li>Git &amp; GitHub</li>
                <li>VS Code</li>
                <li>Figma</li>
                <li>Netlify &amp; Vercel</li>
                <li>Docker</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h3>Beyond Coding</h3>
            <p>
              When I&apos;m not coding, I enjoy exploring new technologies, contributing to open source projects, 
              and sharing knowledge with the developer community. I&apos;m always eager to learn and stay up-to-date 
              with the latest trends in web development.
            </p>
            <p>
              I believe in continuous learning and improvement, and I&apos;m always looking for new challenges 
              that push me to grow as a developer and problem solver.
            </p>
          </div>
        </Prose>
      </div>
    </Section>
  )
}
