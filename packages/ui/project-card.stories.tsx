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
  parameters: {
    docs: { description: { component: 'Use href to make the whole card a link. Supply renderLink for router integration while retaining a single anchor.' } },
  },
} satisfies Meta<typeof ProjectCard>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Linked: Story = { args: { href: '#example-experiment' } };
export const Editorial: Story = {
  decorators: [Story => <div data-tessera-theme="editorial" style={{ maxWidth: 440 }}><Story /></div>],
  args: { variant: 'editorial', tone: 'sage', href: '#example-experiment', visual: '◇' },
};
export const EditorialWarm: Story = { ...Editorial, args: { ...Editorial.args, tone: 'warm' } };
export const EditorialPlum: Story = { ...Editorial, args: { ...Editorial.args, tone: 'plum' } };
