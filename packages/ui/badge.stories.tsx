import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './src/badge.js';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Concept' },
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
