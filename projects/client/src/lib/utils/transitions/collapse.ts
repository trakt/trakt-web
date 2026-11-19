import { cubicOut, sineInOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { time } from '$lib/utils/timing/time.ts';

type CollapseProps = {
  duration?: number;
  axis?: 'x' | 'y';
};

const FADE_SHARE = 0.6;
const SHRUNK_SCALE = 0.6;

function px(value: string | undefined): number {
  return Number.parseFloat(value ?? '') || 0;
}

export function collapse(
  node: Element,
  { duration = time.seconds(0.32), axis = 'y' }: CollapseProps = {},
): TransitionConfig {
  const style = getComputedStyle(node);
  const parent = node.parentElement && getComputedStyle(node.parentElement);
  const isVertical = axis === 'y';

  const size = isVertical
    ? node.getBoundingClientRect().height
    : node.getBoundingClientRect().width;
  const paddingStart = px(
    isVertical ? style.paddingBlockStart : style.paddingInlineStart,
  );
  const paddingEnd = px(
    isVertical ? style.paddingBlockEnd : style.paddingInlineEnd,
  );
  const gap = px(isVertical ? parent?.rowGap : parent?.columnGap);

  const sizeProperty = isVertical ? 'height' : 'width';
  const paddingProperty = isVertical ? 'padding-block' : 'padding-inline';
  const marginProperty = isVertical ? 'margin-block-end' : 'margin-inline-end';

  return {
    duration,
    css: (t) => {
      const progress = 1 - t;
      const fade = cubicOut(Math.min(1, progress / FADE_SHARE));
      const shut = sineInOut(progress);
      const open = 1 - shut;

      return [
        `overflow: clip`,
        `min-${sizeProperty}: 0`,
        `opacity: ${1 - fade}`,
        `transform: scale(${1 - (1 - SHRUNK_SCALE) * fade})`,
        `${sizeProperty}: ${size * open}px`,
        `${paddingProperty}: ${paddingStart * open}px ${paddingEnd * open}px`,
        `${marginProperty}: ${-gap * shut}px`,
      ].join('; ');
    },
  };
}
