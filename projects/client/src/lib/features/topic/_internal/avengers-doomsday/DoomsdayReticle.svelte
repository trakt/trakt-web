<script lang="ts">
  const TARGETS =
    'a[href], button, [role="button"], [role="radio"], [role="tab"], summary';
  const MAX_WIDTH = 640;
  const MAX_HEIGHT = 420;

  type Lock = {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
  };

  let box = $state<Lock>({ x: 0, y: 0, width: 0, height: 0, radius: 0 });
  let locked = $state(false);

  const lockBox = (element: Element) =>
    element.closest(".trakt-card")?.querySelector(".trakt-card-cover") ??
    element
      .closest(".trakt-calendar-poster-tile")
      ?.querySelector(".tile-poster") ??
    element;

  const cornerRadius = (element: Element, rect: DOMRect) => {
    const value = getComputedStyle(element).borderTopLeftRadius;
    const amount = parseFloat(value) || 0;
    const pixels = value.endsWith("%")
      ? (Math.min(rect.width, rect.height) * amount) / 100
      : amount;
    return Math.min(pixels, rect.width / 2, rect.height / 2);
  };

  const measure = (element: Element | null): Lock | null => {
    if (!element?.isConnected) return null;
    const target = lockBox(element);
    const rect = target.getBoundingClientRect();
    if (rect.width === 0 || rect.width > MAX_WIDTH || rect.height > MAX_HEIGHT)
      return null;
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      radius: cornerRadius(target, rect),
    };
  };

  $effect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    const state: { target: Element | null; frame: number } = {
      target: null,
      frame: 0,
    };

    const update = () => {
      const next = measure(state.target);
      locked = next !== null;
      if (next) box = next;
    };

    const onOver = (event: PointerEvent) => {
      const next =
        event.target instanceof Element ? event.target.closest(TARGETS) : null;
      if (next === state.target) return;
      state.target = next;
      update();
    };

    const onScroll = () => {
      if (!state.target) return;
      cancelAnimationFrame(state.frame);
      state.frame = requestAnimationFrame(update);
    };

    const onLeave = () => {
      state.target = null;
      update();
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      cancelAnimationFrame(state.frame);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll, { capture: true });
    };
  });
</script>

<div
  class="doom-lock"
  class:is-locked={locked}
  style:--lock-x="{box.x}px"
  style:--lock-y="{box.y}px"
  style:--lock-w="{box.width}px"
  style:--lock-h="{box.height}px"
  style:--lock-r="{box.radius}px"
  aria-hidden="true"
></div>
