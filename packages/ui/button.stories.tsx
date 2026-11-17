import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './src/button.js';
const meta = {title:'Components/Button',component:Button,args:{children:'Explore experiments'}} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {};
export const Secondary: Story = { args:{variant:'secondary',children:'View projects'} };
export const Disabled: Story = { args: { disabled: true } };
