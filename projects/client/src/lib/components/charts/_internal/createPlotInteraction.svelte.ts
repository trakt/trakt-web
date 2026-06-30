type IndexResolver = (clientX: number, rect: DOMRect) => number;

type PlotInteractionConfig = {
  /** Map a pointer's client x (and the plot rect) onto a data-point index. */
  resolveIndex: IndexResolver;
  /** Current data-point count, for clamping keyboard navigation. */
  count: () => number;
};

/**
 * Shared pointer plumbing for the chart primitives, covering the mobile a11y
 * contract:
 *
 * - Mouse: hover scrubs, leaving the plot clears the readout.
 * - Touch: a tap pins a tooltip; dragging scrubs the pin; tapping the pinned
 *   point dismisses it; tapping elsewhere moves it.
 * - The browser fires a synthetic `pointerleave` after a touch tap - we ignore
 *   non-mouse leaves so a pinned tooltip survives it.
 * - Keyboard: arrow keys / Home / End scrub the active point, Enter or Space
 *   pins it, Escape clears, and blurring the plot clears an unpinned readout.
 *
 * Returns reactive getters plus a ready-to-spread handler bag so every chart
 * gets identical behaviour without forking it.
 */
export function createPlotInteraction(
  { resolveIndex, count }: PlotInteractionConfig,
) {
  let activeIndex = $state<number | null>(null);
  let pinned = $state(false);
  let dragging = $state(false);

  const rectOf = (event: PointerEvent): DOMRect =>
    (event.currentTarget as Element).getBoundingClientRect();

  function pointerdown(event: PointerEvent) {
    const index = resolveIndex(event.clientX, rectOf(event));

    if (event.pointerType !== 'mouse') {
      // Tap the already-pinned point to dismiss; otherwise (re)pin here.
      if (pinned && activeIndex === index) {
        pinned = false;
        activeIndex = null;
        return;
      }
      pinned = true;
    }

    dragging = true;
    activeIndex = index;
  }

  function pointermove(event: PointerEvent) {
    // Touch only scrubs while a finger is down; mouse tracks freely.
    if (event.pointerType !== 'mouse' && !dragging) {
      return;
    }

    activeIndex = resolveIndex(event.clientX, rectOf(event));
  }

  function pointerup() {
    dragging = false;
  }

  function pointerleave(event: PointerEvent) {
    // Synthetic touch leaves must not vanish a pinned tooltip.
    if (event.pointerType !== 'mouse') {
      return;
    }

    dragging = false;
    activeIndex = null;
  }

  function step(delta: number) {
    const total = count();
    if (total <= 0) {
      return;
    }
    const current = activeIndex ?? (delta > 0 ? -1 : total);
    activeIndex = Math.min(Math.max(current + delta, 0), total - 1);
  }

  function keydown(event: KeyboardEvent) {
    const total = count();
    if (total <= 0) {
      return;
    }

    // Horizontal arrows follow the reading direction; mirror them in RTL so
    // ArrowRight always moves toward the visual start. Vertical arrows don't flip.
    const target = event.currentTarget;
    const rtl = target instanceof Element &&
      getComputedStyle(target).direction === 'rtl';
    const forward = rtl ? -1 : 1;

    switch (event.key) {
      case 'ArrowRight':
        step(forward);
        break;
      case 'ArrowUp':
        step(1);
        break;
      case 'ArrowLeft':
        step(-forward);
        break;
      case 'ArrowDown':
        step(-1);
        break;
      case 'Home':
        activeIndex = 0;
        break;
      case 'End':
        activeIndex = total - 1;
        break;
      case 'Enter':
      case ' ':
        if (activeIndex == null) {
          activeIndex = 0;
        }
        pinned = !pinned;
        break;
      case 'Escape':
        activeIndex = null;
        pinned = false;
        break;
      default:
        return;
    }

    // We handled it - stop the key from scrolling the page.
    event.preventDefault();
  }

  function blur() {
    // Leaving the plot clears a keyboard/hover readout unless it's pinned.
    if (!pinned) {
      activeIndex = null;
    }
  }

  return {
    get activeIndex() {
      return activeIndex;
    },
    get isActive() {
      return activeIndex !== null;
    },
    get pinned() {
      return pinned;
    },
    handlers: {
      pointerdown,
      pointermove,
      pointerup,
      pointerleave,
      keydown,
      blur,
    },
  };
}
