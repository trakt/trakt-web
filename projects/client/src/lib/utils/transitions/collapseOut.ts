import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { time } from '$lib/utils/timing/time.ts';

type CollapseOutProps = {
  duration?: number;
};

const FADE_SHARE = 0.6;
const SHRUNK_SCALE = 0.6;
const GLIDE_EASING = 'cubic-bezier(0.37, 0, 0.63, 1)';

function siblingsOf(node: HTMLElement): ReadonlyArray<HTMLElement> {
  return Array.from(node.parentElement?.children ?? []).filter(
    (child): child is HTMLElement =>
      child !== node && child instanceof HTMLElement,
  );
}

function liftOut(node: HTMLElement) {
  const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = node;
  Object.assign(node.style, {
    position: 'absolute',
    top: `${offsetTop}px`,
    left: `${offsetLeft}px`,
    width: `${offsetWidth}px`,
    height: `${offsetHeight}px`,
    margin: '0',
  });
}

function glide({
  sibling,
  from,
  duration,
}: {
  sibling: HTMLElement;
  from: DOMRect;
  duration: number;
}) {
  const to = sibling.getBoundingClientRect();
  const dx = from.left - to.left;
  const dy = from.top - to.top;
  if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

  sibling.animate(
    [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
    { duration, easing: GLIDE_EASING },
  );
}

export function collapseOut(
  node: Element,
  { duration = time.seconds(0.32) }: CollapseOutProps = {},
): TransitionConfig {
  if (!(node instanceof HTMLElement)) return { duration: 0 };

  const siblings = siblingsOf(node);
  const before = siblings.map((sibling) => sibling.getBoundingClientRect());

  liftOut(node);
  siblings.forEach((sibling, index) => {
    const from = before.at(index);
    if (from) glide({ sibling, from, duration });
  });

  return {
    duration,
    css: (t) => {
      const fade = cubicOut(Math.min(1, (1 - t) / FADE_SHARE));
      return `opacity: ${1 - fade}; transform: scale(${1 - (1 - SHRUNK_SCALE) * fade});`;
    },
  };
}
