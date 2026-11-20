import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { mergeMotionHandlers, useInteractiveMotion } from './motion.js';
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary'; children: ReactNode };
export function Button({ variant = 'primary', type = 'button', className = '', children, ...props }: ButtonProps) {
 const feedback = useInteractiveMotion<HTMLButtonElement>(props.disabled);
 return <button {...props} {...mergeMotionHandlers(props, feedback.handlers)} ref={feedback.ref}
   type={type} className={`jl-btn jl-btn--${variant} jl-motion-control tessera-btn tessera-btn--${variant} tessera-motion-control ${className}`.trim()}>{children}</button>;
}
