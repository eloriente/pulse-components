/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],

  // Do not copy public/ assets into the library dist
  publicDir: false,

  // Library build configuration
  build: {
    lib: {
      entry: path.resolve(dirname, 'src/index.ts'),
      name: 'PulseComponents',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      // Exclude peer dependencies from the bundle
      external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'lucide-react': 'LucideReact',
        },
        // Keep CSS Modules as separate files so consumers can opt-in
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'style.css';
          return assetInfo.name ?? 'asset';
        },
      },
    },
    // Generate sourcemaps for better debugging experience
    sourcemap: true,
    // Clean output dir before each build
    emptyOutDir: true,
  },

  // Vitest configuration
  // Project 1 — storybook: runs stories as interaction tests in real Chromium via Playwright
  // Project 2 — unit: runs .test.tsx files with jsdom for fast unit/logic tests
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/components/**/*.{ts,tsx}'],
      exclude: ['src/components/**/*.stories.{ts,tsx}', 'src/components/**/*.module.css'],
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    projects: [
      // Project 1: Storybook interaction tests in real browser
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      // Project 2: Unit tests with jsdom environment
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          setupFiles: ['src/test-setup.ts'],
          clearMocks: true,
          restoreMocks: true,
        },
      },
    ],
  },
});
