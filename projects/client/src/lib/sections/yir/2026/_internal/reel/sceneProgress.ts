import { clamp } from '$lib/utils/number/clamp.ts';

type SceneProgressProps = {
  scrollTop: number;
  sceneTop: number;
  sceneHeight: number;
  viewportHeight: number;
  isPinnedOnly?: boolean;
};

const LEAD = 0.6;
const PINNED_SHARE = 0.85;

export function sceneProgress(
  { scrollTop, sceneTop, sceneHeight, viewportHeight, isPinnedOnly = false }:
    SceneProgressProps,
): number {
  const pinned = Math.max(1, sceneHeight - viewportHeight);
  const scrolled = scrollTop - sceneTop;

  if (isPinnedOnly) return clamp({ value: scrolled / pinned, min: 0, max: 1 });

  const lead = viewportHeight * LEAD;
  return clamp({
    value: (scrolled + lead) / (lead + pinned * PINNED_SHARE),
    min: 0,
    max: 1,
  });
}
