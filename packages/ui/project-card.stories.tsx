import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProjectCard } from './src/project-card.js';

const meta = {
  title: 'Components/ProjectCard',
  component: ProjectCard,
  args: {
    title: 'Example experiment',
    description: 'A fictional project showing the shared card layout.',
    tags: ['Concept', 'Interactive'],
  },
} satisfies Meta<typeof ProjectCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Linked: Story = { args: { href: '#example-experiment' } };
