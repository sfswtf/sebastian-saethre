import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://sebastiansaethre.no',
      dynamicRoutes: [
        '/portfolio',
        '/blog',
        '/courses',
        '/resources',
        '/community',
        '/services',
        '/contact',
        '/onboarding',
        // Add more routes as needed
      ],
      readable: true, // Makes sitemap more readable
      // Generate robots.txt instead of trying to read existing one
      robots: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
      // Don't try to read existing robots.txt - generate it fresh
      changefreq: 'daily',
      priority: 1.0,
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Ensure dist directory is created before plugins run
    emptyOutDir: true,
  },
});
