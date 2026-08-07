import { time } from '$lib/utils/timing/time.ts';

export type TrackSelectorParams = {
  isFluid: boolean;
  shouldMorph: boolean;
  value: string;
  expanded: boolean;
  optionCount: number;
};

const morphDuration = time.seconds(0.3);

const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

export function trackSelector(
  track: HTMLElement,
  initial: TrackSelectorParams,
) {
  const row = track.querySelector<HTMLElement>('.segment-row');
  if (!row) return;

  let params = initial;
  let isMorphing = false;
  let morphFrame = 0;
  let settleFrame = 0;

  const getSelected = () =>
    row.querySelector<HTMLElement>('.segment[aria-checked="true"]');

  const offsetOf = (element: HTMLElement) => {
    const rowRect = row.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    return { x: rect.left - rowRect.left, width: rect.width };
  };

  const write = ({ x, width }: { x: number; width: number }) => {
    row.style.setProperty('--selector-x', `${x}px`);
    row.style.setProperty('--selector-w', `${width}px`);
  };

  const measure = () => {
    if (isMorphing || !row.isConnected) return;

    const selected = getSelected();
    if (!selected) return;

    write(offsetOf(selected));
    track.classList.add('is-measured');
  };

  const stopMorph = () => {
    cancelAnimationFrame(morphFrame);
    isMorphing = false;
    track.classList.remove('is-tracking');
  };

  const morph = () => {
    const selected = getSelected();
    const selector = row.querySelector<HTMLElement>('.segment-selector');
    if (!selected || !selector) return;

    stopMorph();

    const from = offsetOf(selector);
    const startedAt = performance.now();

    isMorphing = true;
    track.classList.add('is-tracking');

    const step = () => {
      const to = offsetOf(selected);
      const progress = easeOutCubic(
        Math.min((performance.now() - startedAt) / morphDuration, 1),
      );

      write({
        x: from.x + (to.x - from.x) * progress,
        width: from.width + (to.width - from.width) * progress,
      });

      if (progress < 1) {
        morphFrame = requestAnimationFrame(step);
        return;
      }

      stopMorph();
      measure();
    };

    morphFrame = requestAnimationFrame(step);
  };

  const start = () => {
    measure();
    document.fonts?.ready.then(measure);

    settleFrame = requestAnimationFrame(() =>
      track.classList.add('is-settled')
    );
    observer.observe(row);
  };

  const observer = new ResizeObserver(measure);

  if (params.isFluid) start();

  return {
    update(next: TrackSelectorParams) {
      const previous = params;
      params = next;

      if (!next.isFluid) {
        stopMorph();
        observer.disconnect();
        return;
      }

      if (!previous.isFluid) {
        start();
        return;
      }

      const hasNewValue = next.value !== previous.value;

      if (next.shouldMorph && hasNewValue) {
        morph();
        return;
      }

      if (
        hasNewValue ||
        next.expanded !== previous.expanded ||
        next.optionCount !== previous.optionCount
      ) {
        measure();
      }
    },
    destroy() {
      cancelAnimationFrame(settleFrame);
      stopMorph();
      observer.disconnect();
    },
  };
}
