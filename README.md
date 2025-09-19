# Sebastian Sæthre - Personal Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, Tailwind CSS, and MDX.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **MDX Content**: Blog-style project pages with rich content support
- **Responsive Design**: Mobile-first approach with clean, accessible UI
- **Contact Integration**: Supabase-powered contact form with email notifications
- **SEO Optimized**: Proper meta tags, sitemap, and robots.txt
- **Performance**: Optimized images, fonts, and static generation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX for project pages
- **Database**: Supabase
- **Deployment**: Netlify
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── projects/          # Projects listing and individual project pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── not-found.tsx      # 404 page
├── components/            # Reusable React components
│   ├── Nav.tsx           # Navigation component
│   ├── Footer.tsx        # Footer component
│   ├── Section.tsx       # Layout section wrapper
│   ├── Prose.tsx         # Typography wrapper
│   ├── ProjectCard.tsx   # Project card component
│   ├── CTA.tsx           # Call-to-action component
│   └── ContactForm.tsx   # Contact form with Supabase integration
├── content/              # MDX content files
│   └── projects/         # Project MDX files
├── lib/                  # Utility functions and configurations
│   ├── projects.ts       # Project data fetching utilities
│   └── supabase.ts       # Supabase client configuration
└── mdx-components.tsx    # MDX component mappings
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for contact form)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sfswtf/sebastian-saethre.git
cd sebastian-saethre
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EMAIL_FROM=your_email@example.com
EMAIL_TO=recipient@example.com
```

4. Set up Supabase database:

Create a `contact_messages` table in your Supabase project:
```sql
CREATE TABLE contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserting contact messages
CREATE POLICY "Allow inserting contact messages" ON contact_messages
FOR INSERT WITH CHECK (true);
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 📝 Content Management

### Adding Projects

1. Create a new MDX file in `src/content/projects/`
2. Add frontmatter with required fields:

```mdx
---
title: "Project Title"
summary: "Brief project description"
date: "2024-01-15"
tags: ["React", "TypeScript", "Tailwind"]
externalUrl: "https://project-demo.com"
repoUrl: "https://github.com/username/project"
stack: ["Next.js", "TypeScript", "Tailwind CSS"]
cover: "/images/project-cover.jpg"
---

# Project Content

Your project description and details go here...
```

3. The project will automatically appear on the projects page

### Updating Content

- **About Page**: Edit `src/app/about/page.tsx`
- **Homepage**: Edit `src/app/page.tsx`
- **Contact Info**: Update `src/app/contact/page.tsx`

## 🚀 Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Add environment variables in Netlify dashboard
5. Deploy!

The site is configured for static export and will work seamlessly with Netlify.

### Environment Variables for Production

Make sure to set these in your Netlify dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `EMAIL_FROM`
- `EMAIL_TO`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## 📱 Features

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly navigation

### Accessibility
- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly

### Performance
- Static site generation
- Optimized images
- Minimal JavaScript bundle
- Fast loading times

### SEO
- Meta tags and Open Graph
- Structured data
- Sitemap generation
- Robots.txt

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Sebastian Sæthre - [sebastian.saethre@gmail.com](mailto:sebastian.saethre@gmail.com)

Project Link: [https://github.com/sfswtf/sebastian-saethre](https://github.com/sfswtf/sebastian-saethre)

---

Built with ❤️ using Next.js and deployed on Netlify
