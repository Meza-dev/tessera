import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { mergeMotionHandlers, useInteractiveMotion } from './motion.js';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary'; children: ReactNode };
export function Button({ variant = 'primary', type = 'button', className = '', children, ...props }: Props) {
 const feedback = useInteractiveMotion<HTMLButtonElement>(props.disabled);
 return <button {...props} {...mergeMotionHandlers(props, feedback.handlers)} ref={feedback.ref}
   type={type} className={`jl-btn jl-btn--${variant} jl-motion-control ${className}`.trim()}>{children}</button>;
}
