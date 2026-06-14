import { cubicInOut } from 'svelte/easing';

export const splitTransition = (t: number): [number, number] => {
  const half = 0.5;
  const slideT = t < half ? t / half : 1;
  const opacityT = t < half ? 0 : (t - half) / half;

  return [slideT, opacityT];
};

type SlideFadeProps = {
  delay?: number;
  duration?: number;
  axis?: 'x' | 'y';
};

export function slideFade(
  node: Element,
  { delay = 0, duration = 150, axis = 'x' }: SlideFadeProps = {},
) {
  const style = getComputedStyle(node);

  const opacity = +style.opacity;

  const primary_property = axis === 'y' ? 'height' : 'width';
  const distance = parseFloat(style[primary_property]);

  return {
    delay,
    duration,
    easing: cubicInOut,
    css: (t: number) => {
      const [slideT, opacityT] = splitTransition(t);
      const offset = (1 - slideT) * distance;
      const translate = axis === 'y' ? `0, ${offset}px` : `${offset}px, 0`;

      return (
        `transform: translate(${translate});` +
        `opacity: ${opacityT * opacity};`
      );
    },
  };
}
