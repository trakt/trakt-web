import { backIn } from 'svelte/easing';

type FallProps = {
  delay: number;
  duration: number;
  xStart: number;
  xEnd: number;
  scale: number;
};

export function snowfall(
  _: HTMLElement,
  { delay, duration, xStart, xEnd, scale }: FallProps,
) {
  return {
    duration,
    delay,
    css: (progress: number) => {
      const xEasedProgress = backIn(progress);
      const yProgress = progress;

      const xCoord = (xEnd - xStart) * xEasedProgress + xStart;
      return `
          transform: scale(${scale}) rotate(${xEasedProgress * 720}deg);
          left: ${xCoord * 100}%;
          bottom: ${100 - yProgress * 100}%;
        `;
    },
  };
}
