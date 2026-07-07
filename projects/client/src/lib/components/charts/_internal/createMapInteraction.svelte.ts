type Point = { x: number; y: number };

type MapInteractionConfig = {
  /** Ordered, deduped countries the keyboard steps through (identity = code). */
  stops: () => ReadonlyArray<{ code: string }>;
  /** Country code under the pointer, or null over gaps / unwatched land. */
  resolvePointer: (event: PointerEvent) => string | null;
  /** On-screen centre of a country's shape, anchoring keyboard tooltips. */
  centreOf: (code: string) => Point | null;
};

/**
 * Shared interaction plumbing for the country map, mirroring
 * `createPlotInteraction` but keyed by country code (the map isn't a linear
 * axis, so there's no index to scrub):
 *
 * - Pointer: hovering a watched country shows its tooltip at the cursor;
 *   leaving with a mouse clears it. A synthetic non-mouse leave (fired right
 *   after a touch tap) is ignored so the pin survives.
 * - Keyboard: arrow keys / Home / End step between watched countries, anchoring
 *   the tooltip at the country's centre; Escape clears and blurs.
 *
 * Countries are matched by code, never object reference: assigning to `$state`
 * proxies the value, so it's never identity-equal to the raw rendered entries.
 */
export function createMapInteraction(
  { stops, resolvePointer, centreOf }: MapInteractionConfig,
) {
  let activeCode = $state<string | null>(null);
  let pointer = $state<Point>({ x: 0, y: 0 });

  function activate(code: string) {
    activeCode = code;
    const centre = centreOf(code);
    if (centre) pointer = centre;
  }

  function step(delta: number) {
    const list = stops();
    if (list.length === 0) return;
    const current = activeCode != null
      ? list.findIndex((stop) => stop.code === activeCode)
      : -1;
    const next = current === -1
      ? (delta > 0 ? 0 : list.length - 1)
      : Math.min(Math.max(current + delta, 0), list.length - 1);
    const stop = list.at(next);
    if (stop) activate(stop.code);
  }

  // Pointer coordinates relative to the element the handler is bound to, so the
  // tooltip anchors to the chart (position: absolute) and tracks it on scroll,
  // rather than pinning to the viewport.
  function localPoint(event: PointerEvent): Point {
    const rect = (event.currentTarget as Element).getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function track(event: PointerEvent) {
    const code = resolvePointer(event);
    // Over a gap, the background, or an unwatched country: drop the tooltip.
    // Safe to always clear since the tooltip is pointer-events: none.
    if (code == null) {
      activeCode = null;
      return;
    }
    activeCode = code;
    pointer = localPoint(event);
  }

  function move(event: PointerEvent) {
    if (activeCode != null) pointer = localPoint(event);
  }

  function leave(event: PointerEvent) {
    // Touch fires a synthetic leave right after a tap; keep the tooltip pinned
    // there (mirrors the other charts). Only a real mouse leave clears it.
    if (event.pointerType !== 'mouse') return;
    activeCode = null;
  }

  function keydown(event: KeyboardEvent) {
    const list = stops();
    if (list.length === 0) return;

    // Horizontal arrows follow the reading direction; mirror them in RTL so
    // ArrowRight always moves toward the visual start.
    const target = event.currentTarget;
    const rtl = target instanceof Element &&
      getComputedStyle(target).direction === 'rtl';
    const forward = rtl ? -1 : 1;

    switch (event.key) {
      case 'ArrowRight':
        step(forward);
        break;
      case 'ArrowDown':
        step(1);
        break;
      case 'ArrowLeft':
        step(-forward);
        break;
      case 'ArrowUp':
        step(-1);
        break;
      case 'Home': {
        const stop = list.at(0);
        if (stop) activate(stop.code);
        break;
      }
      case 'End': {
        const stop = list.at(-1);
        if (stop) activate(stop.code);
        break;
      }
      case 'Escape':
        activeCode = null;
        if (target instanceof SVGElement) target.blur();
        break;
      default:
        return;
    }

    // We handled it, stop the key from scrolling the page.
    event.preventDefault();
  }

  function blur() {
    activeCode = null;
  }

  return {
    get activeCode() {
      return activeCode;
    },
    get pointer() {
      return pointer;
    },
    handlers: {
      // Pointer down doubles as a tap on touch, matching the hover entry point.
      pointerover: track,
      pointerdown: track,
      pointermove: move,
      pointerleave: leave,
      keydown,
      blur,
    },
  };
}
