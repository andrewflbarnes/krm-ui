import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [...configDefaults.coverage.exclude, 'src/index.tsx', 'src/test/**', 'src/stories/**', '**/*.stories.tsx', '**/playwright/**']
    },
    projects: [
      {
        extends: true,
        test: {
          environment: 'jsdom'
        }
      },
    ]
  }
}));
