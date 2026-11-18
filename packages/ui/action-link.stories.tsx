import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActionLink } from './src/action-link.js';

const meta = {
  title: 'Components/ActionLink', component: ActionLink,
  args: { href: '#example', children: 'Explore concept' },
} satisfies Meta<typeof ActionLink>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const ExternalDestination: Story = {
  args: { href: 'https://example.com/project', children: 'Read the project notes ↗' },
};
