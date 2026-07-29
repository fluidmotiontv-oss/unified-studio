import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detect if building for GitHub Pages subdirectory
const base = process.env.GITHUB_PAGES === 'true' 
  ? '/D9Enigma/unified-studio/' 
  : '/';

export default defineConfig({
  plugins: [react()],
  base: base,
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
