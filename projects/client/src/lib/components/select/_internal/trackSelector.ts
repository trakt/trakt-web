import { time } from '$lib/utils/timing/time.ts';

export type TrackSelectorParams = {
  isFluid: boolean;
  shouldMorph: boolean;
  isClipped: boolean;
  isReducedMotion: boolean;
  selector: HTMLElement | Nil;
  target: HTMLElement | Nil;
};

const morphDuration = time.seconds(0.42);

const springOvershoot = 1.70158;

const easeOutSpring = (progress: number) => {
  const remaining = progress - 1;
  return (
    1 +
    (springOvershoot + 1) * Math.pow(remaining, 3) +
    springOvershoot * Math.pow(remaining, 2)
  );
};

export function trackSelector(row: HTMLElement, initial: TrackSelectorParams) {
  let params = initial;
  let isMorphing = false;
  let morphFrame = 0;
  let settleFrame = 0;

  const offsetOf = (element: HTMLElement) => {
    const rowRect = row.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    return { x: rect.left - rowRect.left, width: rect.width };
  };

  const containInRow = ({ x, width }: { x: number; width: number }) => {
    const start = Math.max(x, 0);
    const end = Math.min(x + width, row.getBoundingClientRect().width);

    return { x: start, width: Math.max(end - start, 0) };
  };

  const write = ({ x, width }: { x: number; width: number }) => {
    const { selector } = params;
    if (!selector) return;

    selector.style.setProperty('--selector-x', `${x}px`);
    selector.style.setProperty('--selector-w', `${width}px`);
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
    const { selector, target, isReducedMotion } = params;
    if (!selector || !target) return;

    if (isReducedMotion) {
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
      const elapsed = Math.min(
        (performance.now() - startedAt) / morphDuration,
        1,
      );
      const progress = easeOutSpring(elapsed);

      const frame = {
        x: from.x + (to.x - from.x) * progress,
        width: from.width + (to.width - from.width) * progress,
      };

      write(params.isClipped ? containInRow(frame) : frame);

      if (elapsed < 1) {
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
