import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActiveIndicator, ContentTransition, MotionProvider } from './src/motion.js';
import { Button } from './src/button.js';

function MotionExample({ reducedMotion = 'user' }: { reducedMotion?: 'user' | 'always' }) {
  const [active, setActive] = useState('Tokens');
  const [revision, setRevision] = useState(0);
  return <MotionProvider reducedMotion={reducedMotion}>
    <div className="motion-example">
      <nav aria-label="Example sections">{['Tokens', 'Components'].map(label => <button key={label}
        aria-pressed={active === label} onClick={() => setActive(label)}>
        {label}{active === label && <ActiveIndicator id="example-section" />}
      </button>)}</nav>
      <ContentTransition key={`${active}-${revision}`}><p>Visible content for {active.toLowerCase()}.</p></ContentTransition>
      <Button onClick={() => setRevision(value => value + 1)}>Replay content entrance</Button>
    </div>
  </MotionProvider>;
}

const meta = {
  title: 'Motion/Shared primitives',
  component: MotionExample,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'MotionProvider respects the system preference by default. Set reducedMotion to always to disable shared transform, layout and gesture effects.' } },
  },
} satisfies Meta<typeof MotionExample>;
export default meta;

type Story = StoryObj<typeof meta>;
export const UserPreference: Story = {};
export const ReducedMotion: Story = { args: { reducedMotion: 'always' } };
