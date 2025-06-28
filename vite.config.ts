import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Ler a versão do package.json
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'build',
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    force: true,
  },
  define: {
    __DEV__: false,
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
  },
  envPrefix: 'VITE_',
})
