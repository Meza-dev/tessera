import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../packages/ui/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: { name: '@storybook/react-vite', options: {} },
  viteFinal(config) {
    return mergeConfig(config, {
      optimizeDeps: { include: ['react', 'react-dom'] },
    });
  },
};
export default config;
