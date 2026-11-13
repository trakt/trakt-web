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

const resizeSettleDelay = time.seconds(0.08);

export function trackSelector(row: HTMLElement, initial: TrackSelectorParams) {
  let params = initial;
  let isMorphing = false;
  let morphFrame = 0;
  let settleFrame = 0;
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;

  /*
    Rects come back scaled while an ancestor animates a transform (the
    navbar surface scales in around the toggle). Dividing by the row's
    layout width undoes that, so a measure taken on such a frame still
    lands on the segment instead of settling short of it.
  */
  const rowMetrics = () => {
    const rect = row.getBoundingClientRect();
    const ratio = row.offsetWidth > 0 ? rect.width / row.offsetWidth : 1;
    const scale = Math.abs(ratio - 1) < 0.01 ? 1 : ratio;

    return { left: rect.left, width: rect.width / scale, scale };
  };

  const offsetOf = (element: HTMLElement) => {
    const { left, scale } = rowMetrics();
    const rect = element.getBoundingClientRect();

    return { x: (rect.left - left) / scale, width: rect.width / scale };
  };

  const containInRow = ({ x, width }: { x: number; width: number }) => {
    const start = Math.max(x, 0);
    const end = Math.min(x + width, rowMetrics().width);

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
    if (row.dataset.measured != null) return;

    row.dataset.measured = '';
    settleFrame = requestAnimationFrame(() => {
      row.dataset.settled = '';
    });
  };

  /*
    While the row itself is resizing (a segment folding, the leading slot
    opening) the segment moves a little every frame; the selector follows
    each measure directly instead of springing after it, and the spring
    comes back once the row has held still.
  */
  const followResize = () => {
    if (isMorphing) return;

    row.dataset.tracking = '';
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!isMorphing) delete row.dataset.tracking;
    }, resizeSettleDelay);
    measure();
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

  const observer = new ResizeObserver(followResize);

  const start = () => {
    measure();
    document.fonts?.ready.then(measure);
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
      clearTimeout(resizeTimer);
      stopMorph();
      observer.disconnect();
    },
  };
}
