import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mb-6">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-medium text-gray-900 mb-2 mt-4">{children}</h4>,
    p: ({ children }) => <p className="text-gray-600 mb-4 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
    pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4">{children}</blockquote>,
    a: ({ href, children }) => <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
    ...components,
  }
}
