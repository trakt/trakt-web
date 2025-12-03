import { backIn } from 'svelte/easing';

type FallProps = {
  delay: number;
  duration: number;
  xStart: number;
  xEnd: number;
  scale: number;
};

export function fall(
  _node: HTMLElement,
  { delay, duration, xStart, xEnd, scale }: FallProps,
) {
  return {
    duration,
    delay,
    css: (t: number) => {
      const x_t = backIn(t);
      const y_t = t;

      const x_coord = (xEnd - xStart) * x_t + xStart;
      return `
          transform: scale(${scale}) rotate(${x_t * 720}deg);
          left: ${x_coord * 100}%;
          bottom: ${100 - y_t * 100}%;
        `;
    },
  };
}
