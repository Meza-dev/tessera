import { createContext, useContext, useEffect, useId, useRef, type DOMAttributes, type ReactNode, type SyntheticEvent } from 'react';
import { LayoutGroup, MotionConfig, motion, useAnimate, useReducedMotion } from 'motion/react';
import tokens from '@tessera/motion/tokens.json' with { type: 'json' };

type MotionPreference = 'user' | 'always';
const MotionPreferenceContext = createContext<MotionPreference>('user');
const easeOut = tokens.easeOut as [number, number, number, number];
const transition = { duration: tokens.durationMs.base / 1000, ease: easeOut };

export type MotionProviderProps = { children: ReactNode; reducedMotion?: MotionPreference };
export function MotionProvider({ children, reducedMotion = 'user' }: MotionProviderProps) {
  const parentPreference = useContext(MotionPreferenceContext);
  const preference = parentPreference === 'always' ? 'always' : reducedMotion;
  const id = useId();
  return <MotionPreferenceContext.Provider value={preference}>
    <MotionConfig reducedMotion={preference} transition={transition}>
      <LayoutGroup id={id}>{children}</LayoutGroup>
    </MotionConfig>
  </MotionPreferenceContext.Provider>;
}

export function canAnimate(systemPreference: boolean | null, preference: MotionPreference) {
  return systemPreference === false && preference !== 'always';
}

function useMotionAllowed() {
  return canAnimate(useReducedMotion(), useContext(MotionPreferenceContext));
}

export type ContentTransitionProps = { children: ReactNode; className?: string };
export function ContentTransition({ children, className = '' }: ContentTransitionProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const enabled = useMotionAllowed();
  useEffect(() => {
    if (!scope.current) return;
    if (!enabled) {
      scope.current.style.removeProperty('transform');
      return;
    }
    const playback = animate(scope.current, { y: [tokens.distancePx.entrance, 0] }, {
      duration: tokens.durationMs.slow / 1000, ease: easeOut,
    });
    return () => playback.stop();
  }, [enabled, animate, scope]);
  return <div ref={scope} className={`jl-motion-content ${className}`.trim()}>{children}</div>;
}

export type ActiveIndicatorProps = { id: string };
export function ActiveIndicator({ id }: ActiveIndicatorProps) {
  const enabled = useMotionAllowed();
  if (!enabled) return <span aria-hidden="true" className="jl-active-indicator" />;
  return <motion.span aria-hidden="true" className="jl-active-indicator"
    initial={false} layoutId={id} transition={transition} />;
}

export function useInteractiveMotion<T extends HTMLElement>(disabled = false) {
  const [scope, animate] = useAnimate<T>();
  const playback = useRef<ReturnType<typeof animate> | null>(null);
  const enabled = useMotionAllowed() && !disabled;
  useEffect(() => {
    if (!enabled) {
      playback.current?.stop();
      scope.current?.style.removeProperty('transform');
    }
    return () => playback.current?.stop();
  }, [enabled, scope]);
  const feedback = (y: number, scale: number) => {
    if (enabled && scope.current) {
      playback.current?.stop();
      playback.current = animate(scope.current, { y, scale }, {
        duration: tokens.durationMs.fast / 1000, ease: easeOut,
      });
    }
  };
  const handlers: DOMAttributes<T> = {
    onPointerEnter: event => { if (event.pointerType !== 'touch') feedback(tokens.distancePx.hoverLift, 1); },
    onPointerLeave: () => feedback(0, 1),
    onPointerDown: () => feedback(0, tokens.pressScale),
    onPointerUp: () => feedback(0, 1),
    onPointerCancel: () => feedback(0, 1),
    onKeyDown: event => { if (event.key === 'Enter' || event.key === ' ') feedback(0, tokens.pressScale); },
    onKeyUp: () => feedback(0, 1),
    onBlur: () => feedback(0, 1),
  };
  return { ref: scope, handlers };
}

function compose<E extends SyntheticEvent>(user: ((event: E) => void) | undefined, internal: ((event: E) => void) | undefined) {
  return (event: E) => {
    user?.(event);
    if (!event.defaultPrevented) internal?.(event);
  };
}

export function mergeMotionHandlers<T extends HTMLElement>(props: DOMAttributes<T>, handlers: DOMAttributes<T>): DOMAttributes<T> {
  return {
    onPointerEnter: compose(props.onPointerEnter, handlers.onPointerEnter),
    onPointerLeave: compose(props.onPointerLeave, handlers.onPointerLeave),
    onPointerDown: compose(props.onPointerDown, handlers.onPointerDown),
    onPointerUp: compose(props.onPointerUp, handlers.onPointerUp),
    onPointerCancel: compose(props.onPointerCancel, handlers.onPointerCancel),
    onKeyDown: compose(props.onKeyDown, handlers.onKeyDown),
    onKeyUp: compose(props.onKeyUp, handlers.onKeyUp),
    onBlur: compose(props.onBlur, handlers.onBlur),
  };
}
