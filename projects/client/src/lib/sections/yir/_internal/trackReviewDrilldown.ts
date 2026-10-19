import type { ActionReturn } from 'svelte/action';
import { toReviewDrilldownType } from './toReviewDrilldownType.ts';

type TrackReviewDrilldownParams = {
  source: 'yir' | 'mir';
  track: (data: { source: string; type: string }) => void;
};

export function trackReviewDrilldown(
  node: HTMLElement,
  params: TrackReviewDrilldownParams,
): ActionReturn<TrackReviewDrilldownParams> {
  let current = params;

  const onClick = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const href = event.target.closest('a[href]')?.getAttribute('href');
    const type = toReviewDrilldownType(href);

    if (!type) {
      return;
    }

    current.track({ source: current.source, type });
  };

  node.addEventListener('click', onClick);

  return {
    update(next) {
      current = next;
    },
    destroy() {
      node.removeEventListener('click', onClick);
    },
  };
}
