import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'html']
    },
    deps: {
      // externaliza o client pra não “quebrar” a classe
      external: ['@prisma/client', '.prisma/client']
    }
  },
  resolve: {
    alias: [
      { find: '@/prisma', replacement: path.resolve(__dirname, 'prisma') },
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  },
  // evita prebundle
  optimizeDeps: {
    exclude: ['@prisma/client', '.prisma/client']
  },
  // no SSR do Vite (usado por vitest), mantenha externo
  ssr: {
    external: ['@prisma/client', '.prisma/client']
  }
})
