/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },


      '/roles': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) {
            return req.url;
          }
        },
      },
      '/permissions': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) {
            return req.url;
          }
        },
      },
      '/tickets': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) {
            return req.url;
          }
        },
      },
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept?.includes('text/html')) {
            return req.url;
          }
        },
      },
      '/categories': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/subcategorias': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/departments': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/priorities': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/companies': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/documents': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/workflows': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
