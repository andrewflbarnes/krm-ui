/// <reference types="vitest" />
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import viteConfig from './vite.config.js';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [...configDefaults.coverage.exclude, 'src/index.tsx', 'src/test/**', 'src/stories/**', '**/*.stories.tsx', '**/playwright/**']
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
        }
      },
      {
        extends: 'vite.config.ts',
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            storybookScript: 'pnpm storybook dev -p 6006 --no-open',
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        }
      }
    ]
  }
}));
