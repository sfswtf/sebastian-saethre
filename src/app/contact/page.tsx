'use client'

import React from 'react'
import Section from '@/components/Section'
import ContactForm from '@/components/ContactForm'

export default function ContactPage() {
  return (
    <Section>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-600">
            I&apos;m always interested in new opportunities and exciting projects. 
            Let&apos;s discuss how we can work together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Let&apos;s Connect</h2>
            <p className="text-gray-600 mb-6">
              Whether you have a project in mind, want to collaborate, or just want to say hello,
              I&apos;d love to hear from you. Fill out the form and I&apos;ll get back to you as soon as possible.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <a 
                  href="mailto:sebastian.saethre@gmail.com"
                  className="text-blue-600 hover:text-blue-800"
                >
                  sebastian.saethre@gmail.com
                </a>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Social</h3>
                <div className="flex space-x-4 mt-2">
                  <a
                    href="https://github.com/sfswtf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/sebastian-saethre"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Response Time</h3>
                <p className="text-gray-600">
                  I typically respond within 24-48 hours during business days.
                </p>
              </div>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  )
}
