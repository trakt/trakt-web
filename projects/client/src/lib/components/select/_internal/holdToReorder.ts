import { toReorderIndex } from './toReorderIndex.ts';

export type HoldToReorderParams = {
  /** Attribute carrying each segment's index, set on the segment element. */
  indexAttribute?: string;
  isEnabled: boolean;
  onHold: (index: number) => void;
  onPreview: (index: number) => void;
  onCommit: (from: number, to: number) => void;
  onRelease: () => void;
};

/** Long enough not to fight a tap, short enough to feel like a hold. */
const HOLD_MS = 400;
/** Movement before the hold lands reads as a scroll, not a reorder. */
const CANCEL_DISTANCE_PX = 10;

export function holdToReorder(node: HTMLElement, params: HoldToReorderParams) {
  let current = params;
  let holdTimer: ReturnType<typeof setTimeout> | null = null;
  let startX = 0;
  let fromIndex: number | null = null;
  let toIndex: number | null = null;
  let isHolding = false;

  const attribute = () => current.indexAttribute ?? 'data-segment-index';

  const segmentAt = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return null;
    const segment = target.closest(`[${attribute()}]`);
    if (!(segment instanceof HTMLElement)) return null;
    const index = Number(segment.getAttribute(attribute()));
    return Number.isFinite(index) ? index : null;
  };

  const bounds = () =>
    [...node.querySelectorAll(`[${attribute()}]`)].map((segment) => {
      const rect = segment.getBoundingClientRect();
      return { left: rect.left, width: rect.width };
    });

  const stopHold = () => {
    if (holdTimer !== null) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  };

  const reset = () => {
    stopHold();
    isHolding = false;
    fromIndex = null;
    toIndex = null;
    current.onRelease();
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!current.isEnabled || event.button !== 0) return;

    const index = segmentAt(event.target);
    if (index === null) return;

    startX = event.clientX;
    fromIndex = index;
    holdTimer = setTimeout(() => {
      isHolding = true;
      toIndex = index;
      node.setPointerCapture?.(event.pointerId);
      current.onHold(index);
    }, HOLD_MS);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (fromIndex === null) return;

    if (!isHolding) {
      if (Math.abs(event.clientX - startX) > CANCEL_DISTANCE_PX) stopHold();
      return;
    }

    // Holding owns the gesture, so the row must not scroll under it.
    event.preventDefault();
    toIndex = toReorderIndex({ segments: bounds(), pointerX: event.clientX });
    current.onPreview(toIndex);
  };

  const onPointerUp = () => {
    if (isHolding && fromIndex !== null && toIndex !== null) {
      current.onCommit(fromIndex, toIndex);
    }
    reset();
  };

  node.addEventListener('pointerdown', onPointerDown);
  node.addEventListener('pointermove', onPointerMove);
  node.addEventListener('pointerup', onPointerUp);
  node.addEventListener('pointercancel', reset);

  return {
    update(next: HoldToReorderParams) {
      current = next;
      if (!next.isEnabled) reset();
    },
    destroy() {
      stopHold();
      node.removeEventListener('pointerdown', onPointerDown);
      node.removeEventListener('pointermove', onPointerMove);
      node.removeEventListener('pointerup', onPointerUp);
      node.removeEventListener('pointercancel', reset);
    },
  };
}
