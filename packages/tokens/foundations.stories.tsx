import type { Meta, StoryObj } from '@storybook/react-vite';

const colors = ['bg', 'surface', 'surface-raised', 'border', 'text', 'text-muted', 'accent', 'violet'];
const spaces = [1, 2, 3, 4, 6, 8, 12];

function Foundations({ theme }: { theme?: 'violet' | 'editorial' }) {
  return <div className="token-example" data-jl-theme={theme}>
    <h2>Colors</h2>
    <ul className="token-example__palette">
      {colors.map(color => <li key={color}>
        <span aria-hidden="true" style={{ backgroundColor: `var(--jl-${color})` }} />
        <code>--jl-{color}</code>
      </li>)}
    </ul>
    <h2>Typography</h2>
    <p>Geist Sans for interface text</p>
    <p><code>Geist Mono for code and short labels</code></p>
    <h2>Spacing</h2>
    <ul className="token-example__spacing">
      {spaces.map(space => <li key={space}>
        <span aria-hidden="true" style={{ width: `var(--jl-space-${space})` }} />
        <code>--jl-space-{space}</code>
      </li>)}
    </ul>
  </div>;
}

const meta = {
  title: 'Foundations/Design tokens',
  component: Foundations,
  parameters: {
    docs: { description: { component: 'CSS custom properties from @tessera/tokens/theme.css. Import fonts.css for Geist Sans and Geist Mono.' } },
  },
} satisfies Meta<typeof Foundations>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Dark: Story = {};
export const Violet: Story = { args: { theme: 'violet' } };
export const Editorial: Story = { args: { theme: 'editorial' } };
