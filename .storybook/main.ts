import path from 'path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from 'storybook-solidjs-vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getAbsolutePath = (packageName: string): string =>
    path.dirname(import.meta.resolve(path.join(packageName, 'package.json'))).replace(/^file:\/\//, '');

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs")
  ],
  managerHead: (head, { configType }) => {
    if (configType === "PRODUCTION") {
      return `
        ${head}
        <base href="/krm-ui-storybook/">
      `;
    }
  },
  viteFinal: (config, { configType }) => {
    if (configType === "PRODUCTION") {
      config.base = "/krm-ui-storybook/";
    }
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string>),
      "@": path.resolve(__dirname, "../src"),
    };
    return config
  },
  framework: {
    name: "storybook-solidjs-vite",
    options: {
      docgen: {
        savePropValueAsString: true,
        shouldExtractLiteralValuesFromEnum: true,
        propFilter: (prop) =>
          prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
      },
    },
  }
};
export default config;
