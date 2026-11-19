import type { ReactNode } from 'react';
import { Badge } from './badge.js';
import type { LinkRenderer, LinkRenderProps } from './action-link.js';
import { useInteractiveMotion } from './motion.js';
type Props = {
 title: string;
 description: string;
 tags: string[];
 visual?: ReactNode;
 href?: string;
 renderLink?: LinkRenderer;
 variant?: 'default' | 'editorial';
 tone?: 'warm' | 'sage' | 'plum';
};
export function ProjectCard({title,description,tags,visual,href,renderLink,variant='default',tone='warm'}: Props) {
 const feedback = useInteractiveMotion<HTMLAnchorElement>();
 const editorial = variant === 'editorial';
 const className = editorial ? 'jl-card jl-card--editorial' : 'jl-card';
 const surface = editorial ? { 'data-tone': tone } : {};
 const content = <>
  <div className="jl-card__visual" aria-hidden="true">{visual}</div>
  <div className="jl-card__heading"><h3>{title}</h3>{(!editorial || href) && <span className="jl-card__arrow" aria-hidden="true">↗</span>}</div>
  <p>{description}</p>
  {!editorial && <div className="jl-card__tags">{tags.map(t=><Badge key={t}>{t}</Badge>)}</div>}
 </>;
 if (!href) return <article className={className} {...surface}>{content}</article>;
 const linkProps: LinkRenderProps = { href, className: `${className} jl-motion-control`, children: content, ref: feedback.ref, ...surface, ...feedback.handlers };
 return renderLink ? renderLink(linkProps) : <a {...linkProps} />;
}
