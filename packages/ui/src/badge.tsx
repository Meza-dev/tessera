import type { HTMLAttributes } from 'react';
export type BadgeProps = HTMLAttributes<HTMLSpanElement>;
export function Badge({className='',...props}: BadgeProps) {
 return <span {...props} className={`jl-badge ${className}`.trim()} />;
}
