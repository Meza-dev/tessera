import type { AnchorHTMLAttributes, ReactElement } from 'react';
import { mergeMotionHandlers, useInteractiveMotion } from './motion.js';

export type LinkRenderProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  ref?: ((element: HTMLAnchorElement | null) => void) | { current: HTMLAnchorElement | null };
};
export type LinkRenderer = (props: LinkRenderProps) => ReactElement;
export type ActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: 'primary' | 'secondary';
  renderLink?: LinkRenderer;
};

export function ActionLink({ href, variant = 'primary', className = '', renderLink, ...props }: ActionLinkProps) {
  const feedback = useInteractiveMotion<HTMLAnchorElement>();
  const linkProps: LinkRenderProps = {
    ...props, ...mergeMotionHandlers(props, feedback.handlers), href, ref: feedback.ref,
    className: `jl-btn jl-btn--${variant} jl-motion-control ${className}`.trim(),
  };
  return renderLink ? renderLink(linkProps) : <a {...linkProps} />;
}
