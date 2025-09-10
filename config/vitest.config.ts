import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
    },
    include: ['./src/**/*.test.ts', './src/**/*.test-d.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './node_modules/.coverage',
      exclude: [
        './dist',
        './config',
        './api-docs',
        './dev',
        './src/**/*.test.ts',
        './src/**/*.test-d.ts',
      ],
    },
  },
})
