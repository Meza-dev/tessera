import type { ReactNode } from 'react';
import { Badge } from './badge.js';
import type { LinkRenderer, LinkRenderProps } from './action-link.js';
import { useInteractiveMotion } from './motion.js';
type Props = { title: string; description: string; tags: string[]; visual?: ReactNode; href?: string; renderLink?: LinkRenderer };
export function ProjectCard({title,description,tags,visual,href,renderLink}: Props) {
 const feedback = useInteractiveMotion<HTMLAnchorElement>();
 const content = <><div className="jl-card__visual" aria-hidden="true">{visual}</div><div className="jl-card__heading"><h3>{title}</h3><span aria-hidden="true">↗</span></div><p>{description}</p><div className="jl-card__tags">{tags.map(t=><Badge key={t}>{t}</Badge>)}</div></>;
 if (!href) return <article className="jl-card">{content}</article>;
 const linkProps: LinkRenderProps = { href, className: 'jl-card jl-motion-control', children: content, ref: feedback.ref, ...feedback.handlers };
 return renderLink ? renderLink(linkProps) : <a {...linkProps} />;
}
