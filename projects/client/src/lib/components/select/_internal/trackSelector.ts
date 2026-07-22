import { WellKnownMediaQuery } from '$lib/stores/css/useMedia';
import { time } from '$lib/utils/timing/time.ts';

export type TrackSelectorParams = {
  isFluid: boolean;
  shouldMorph: boolean;
  selector: HTMLElement | Nil;
  target: HTMLElement | Nil;
};

const morphDuration = time.seconds(0.3);

const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

const prefersReducedMotion = () =>
  globalThis.matchMedia?.(WellKnownMediaQuery.reducedMotion).matches ?? false;

export function trackSelector(
  row: HTMLElement,
  initial: TrackSelectorParams,
) {
  let params = initial;
  let isMorphing = false;
  let morphFrame = 0;
  let settleFrame = 0;

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
    const { target } = params;
    if (isMorphing || !target || !row.isConnected) return;

    write(offsetOf(target));
    row.dataset.measured = '';
  };

  const stopMorph = () => {
    cancelAnimationFrame(morphFrame);
    isMorphing = false;
    delete row.dataset.tracking;
  };

  const morph = () => {
    const { selector, target } = params;
    if (!selector || !target) return;

    if (prefersReducedMotion()) {
      measure();
      return;
    }

    stopMorph();

    const from = offsetOf(selector);
    const startedAt = performance.now();

    isMorphing = true;
    row.dataset.tracking = '';

    const step = () => {
      const to = offsetOf(target);
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

  const observer = new ResizeObserver(measure);

  const start = () => {
    measure();
    document.fonts?.ready.then(measure);

    settleFrame = requestAnimationFrame(() => {
      row.dataset.settled = '';
    });
    observer.observe(row);
  };

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

      if (next.shouldMorph && next.target !== previous.target) {
        morph();
        return;
      }

      measure();
    },
    destroy() {
      cancelAnimationFrame(settleFrame);
      stopMorph();
      observer.disconnect();
    },
  };
}
