import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'html']
    },
    deps: {}
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  },
  // evita prebundle
  optimizeDeps: {},
  // no SSR do Vite (usado por vitest), mantenha externo
  ssr: {}
})
