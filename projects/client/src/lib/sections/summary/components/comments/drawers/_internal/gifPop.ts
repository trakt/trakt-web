import { backOut } from 'svelte/easing';

type GifPopProps = {
  delay?: number;
  duration?: number;
};

export function gifPop(
  _node: Element,
  { delay = 0, duration = 400 }: GifPopProps = {},
) {
  return {
    delay,
    duration,
    easing: backOut,
    css: (t: number, u: number) =>
      `transform: translateX(calc(${u * 24}px * var(--rtl-sign))) ` +
      `scale(${0.6 + 0.4 * t}) rotate(calc(${u * 8}deg * var(--rtl-sign)));` +
      `opacity: ${Math.min(t * 2, 1)};`,
  };
}
