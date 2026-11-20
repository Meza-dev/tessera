import type { Preview } from '@storybook/react-vite';
import '../packages/tokens/fonts.css';
import '../packages/tokens/theme.css';
import '../packages/motion/motion.css';
import '../packages/ui/styles.css';
import './preview.css';
const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    backgrounds: { options: { dark: { name: 'Dark', value: 'var(--tessera-bg)' } } },
  },
  initialGlobals: { backgrounds: { value: 'dark' } },
};
export default preview;
