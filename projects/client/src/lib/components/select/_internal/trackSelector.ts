export type TrackSelectorParams = {
  isFluid: boolean;
  shouldMorph: boolean;
  value: string;
  expanded: boolean;
  optionCount: number;
};

const MORPH_MS = 300;

const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

export function trackSelector(
  track: HTMLElement,
  initial: TrackSelectorParams,
) {
  let params = initial;
  let isMorphing = false;
  let morphFrame = 0;
  let settleFrame = 0;
  let isDestroyed = false;

  const getRow = () => track.querySelector<HTMLElement>('.segment-row');

  const getSelected = (row: HTMLElement) =>
    row.querySelector<HTMLElement>('.segment[aria-checked="true"]');

  const write = (row: HTMLElement, x: number, width: number) => {
    row.style.setProperty('--selector-x', `${x}px`);
    row.style.setProperty('--selector-w', `${width}px`);
  };

  function measure() {
    if (isMorphing || isDestroyed) return;

    const row = getRow();
    if (!row) return;

    const selected = getSelected(row);
    if (!selected) return;

    const rowRect = row.getBoundingClientRect();
    const rect = selected.getBoundingClientRect();

    write(row, rect.left - rowRect.left, rect.width);
    track.classList.add('is-measured');
  }

  const observer = new ResizeObserver(() => measure());

  const endMorph = () => {
    cancelAnimationFrame(morphFrame);
    isMorphing = false;
    track.classList.remove('is-tracking');
  };

  const morph = () => {
    const row = getRow();
    const selector = row?.querySelector<HTMLElement>('.segment-selector');
    if (!row || !selector) return;

    const rowRect = row.getBoundingClientRect();
    const selectorRect = selector.getBoundingClientRect();
    const from = {
      x: selectorRect.left - rowRect.left,
      width: selectorRect.width,
    };
    const startedAt = performance.now();

    endMorph();
    isMorphing = true;
    track.classList.add('is-tracking');

    const step = () => {
      const selected = getSelected(row);
      if (!selected || isDestroyed) {
        endMorph();
        return;
      }

      const liveRow = row.getBoundingClientRect();
      const target = selected.getBoundingClientRect();
      const progress = easeOutCubic(
        Math.min((performance.now() - startedAt) / MORPH_MS, 1),
      );

      write(
        row,
        from.x + (target.left - liveRow.left - from.x) * progress,
        from.width + (target.width - from.width) * progress,
      );

      if (progress < 1) {
        morphFrame = requestAnimationFrame(step);
        return;
      }

      endMorph();
      measure();
    };

    morphFrame = requestAnimationFrame(step);
  };

  const start = () => {
    const row = getRow();
    if (!row) return;

    measure();
    document.fonts?.ready.then(() => measure());

    settleFrame = requestAnimationFrame(() =>
      track.classList.add('is-settled')
    );
    observer.observe(row);
  };

  if (params.isFluid) start();

  return {
    update(next: TrackSelectorParams) {
      const previous = params;
      params = next;

      if (!next.isFluid) {
        endMorph();
        observer.disconnect();
        return;
      }

      if (!previous.isFluid) {
        start();
        return;
      }

      if (next.shouldMorph && next.value !== previous.value) {
        morph();
        return;
      }

      if (
        next.value !== previous.value ||
        next.expanded !== previous.expanded ||
        next.optionCount !== previous.optionCount
      ) {
        measure();
      }
    },
    destroy() {
      isDestroyed = true;
      cancelAnimationFrame(settleFrame);
      endMorph();
      observer.disconnect();
    },
  };
}
