import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://hovdenmusikklubb.no',
      dynamicRoutes: [
        '/',
        '/musikkfest',
        '/events',
        '/membership',
        '/gallery',
        '/contact',
        // Add more routes as needed
      ],
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
