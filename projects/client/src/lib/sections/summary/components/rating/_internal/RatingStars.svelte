<script lang="ts">
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { RatingGroup } from "bits-ui";
  import { fromEvent, merge, Subject } from "rxjs";
  import { takeUntil, tap } from "rxjs/operators";
  import { createScrubInteraction } from "./createScrubInteraction.ts";
  import { starFill } from "./starFill.ts";
  import { starsFromRects } from "./starsFromRects.ts";

  const {
    rating,
    isRating,
    onAddRating,
    onRemoveRating,
    variant = "half",
  }: {
    rating?: number;
    isRating: boolean;
    onAddRating: (rating: number, star?: HTMLElement) => void;
    onRemoveRating: () => void;
    // FIXME: remove when allowing half star filtering (https://github.com/trakt/trakt-web/issues/1466)
    variant?: "full" | "half";
  } = $props();

  const MAX_STARS = 5;
  const ITEM_SELECTOR = "[data-rating-group-item]";

  // Pointer travel (px) below which a gesture counts as a tap rather than a
  // drag. Taps commit a whole star; only drags can land on a half.
  const TAP_SLOP = 8;

  // bits-ui works on a 1..MAX_STARS scale (0.5 steps); the app stores ratings
  // on a 0-10 scale, so we convert at the boundary.
  const toStars = (value: number) => value / 2;
  const toRating = (stars: number) => stars * 2;

  const allowHalf = $derived(variant === "half");
  const committedStars = $derived(toStars(rating ?? 0));

  // Root element the RxJS pointer pipeline attaches to.
  let rootEl: HTMLElement | null = $state(null);

  // Live "what would this rating be right now" while dragging/hovering.
  // null === pointer isn't over the stars.
  let previewStars: number | null = $state(null);

  let previewX: number | null = $state(null);

  // Pointer gestures commit on pointerup (a scrub-drag releases on a different
  // star than it pressed, so no `click` fires and bits-ui never commits). This
  // flag lets bits-ui's onValueChange own keyboard commits only, without
  // double-committing the pointer ones.
  let lastInputWasPointer = false;

  // True only while a touch gesture is actively scrubbing. Mouse hover never
  // sets it. Drives lifting the active star + tooltip clear of the thumb, which
  // would otherwise sit right on top of them.
  let isTouchScrub = $state(false);

  const displayStars = $derived(previewStars ?? committedStars);
  const isPreviewing = $derived(previewStars !== null);
  // Previewing the "no rating" state - tint the row red to signal removal.
  const isClearing = $derived(isPreviewing && displayStars <= 0);
  const highlightIndex = $derived(Math.ceil(displayStars) - 1);

  // Layout measured once per interaction and reused across pointermoves; reading
  // the DOM on every move would force a synchronous reflow (layout thrashing).
  // Cleared when the gesture ends so the next interaction re-measures.
  type StarLayout = {
    rects: ReadonlyArray<DOMRect>;
    rootCenter: number;
    isRtl: boolean;
  };
  let layout: StarLayout | null = null;

  function measureLayout(): StarLayout | null {
    if (!rootEl) return null;

    const items = Array.from(
      rootEl.querySelectorAll<HTMLElement>(ITEM_SELECTOR),
    );
    if (items.length === 0) return null;

    const rootRect = rootEl.getBoundingClientRect();

    return {
      rects: items.map((item) => item.getBoundingClientRect()),
      rootCenter: rootRect.left + rootRect.width / 2,
      isRtl: getComputedStyle(rootEl).direction === "rtl",
    };
  }

  function clearLayout() {
    layout = null;
  }

  // Measures the star rects from the DOM (cached), then delegates to the pure
  // geometry.
  function starsFromPointerX(clientX: number): number | null {
    layout ??= measureLayout();
    if (!layout) return null;

    return starsFromRects({
      rects: layout.rects,
      clientX,
      allowHalf,
      isRtl: layout.isRtl,
      max: MAX_STARS,
    });
  }

  const starIndex = (stars: number) =>
    Math.min(Math.max(Math.ceil(stars) - 1, 0), MAX_STARS - 1);

  function starCenterX(stars: number): number | null {
    layout ??= measureLayout();
    if (!layout) return null;

    const rect = layout.rects.at(starIndex(stars));
    if (!rect) return null;

    return rect.left + rect.width / 2 - layout.rootCenter;
  }

  function starItem(stars: number): HTMLElement | undefined {
    return rootEl?.querySelectorAll<HTMLElement>(ITEM_SELECTOR)
      .item(starIndex(stars)) ?? undefined;
  }

  function pulseStar(stars: number, scale: number) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    starItem(stars)?.firstElementChild?.animate?.(
      [
        { transform: "scale(1)" },
        { transform: `scale(${scale})` },
        { transform: "scale(1)" },
      ],
      { duration: 240, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
    );
  }

  function tickStep(stars: number) {
    pulseStar(stars, 1.2);
    if (isTouchScrub) navigator.vibrate?.(4);
  }

  function commit(stars: number) {
    if (isRating) return;

    // Keep previewX so the bubble recedes in place; only hide it.
    previewStars = null;
    clearLayout();

    // Scrubbing (or clicking) to the leading edge yields 0, which clears the
    // rating.
    if (stars <= 0) {
      onRemoveRating();
      return;
    }

    pulseStar(stars, 1.3);
    onAddRating(toRating(stars), starItem(stars));
  }

  // Live drag/hover preview: pointermove drives the value + bubble, pointerleave
  // clears them.
  function syncPreview(clientX: number | null) {
    if (clientX === null || isRating) {
      // Keep previewX so the bubble recedes under the current star, not center.
      previewStars = null;
      clearLayout();
      return;
    }

    const stars = starsFromPointerX(clientX);
    const isStep = previewStars !== null && stars !== null &&
      stars !== previewStars;

    previewStars = stars;
    if (isStep) tickStep(stars);
    if (stars !== null) previewX = starCenterX(stars);
  }

  // Commit a scrub gesture on release. Mouse is precise, so a click can land on
  // a half straight away; touch taps snap up to a whole star, only a drag keeps
  // the half there.
  function commitGesture(down: PointerEvent, up: PointerEvent) {
    const stars = starsFromPointerX(up.clientX);

    if (stars !== null) {
      const travelled = Math.abs(up.clientX - down.clientX) >= TAP_SLOP;
      const snapToWhole = up.pointerType !== "mouse" && !travelled;
      commit(snapToWhole ? Math.ceil(stars) : stars);
    }

    // Defer past the click this release triggers (which onValueChange skips via
    // the flag), then clear it so a later assistive-tech click - which fires no
    // keydown - still reaches onValueChange.
    setTimeout(() => (lastInputWasPointer = false), 0);
  }

  // RxJS owns the pointer interaction; bits-ui's onValueChange handles keyboard
  // commits only. The gesture wiring lives in createScrubInteraction (pure +
  // marble-tested); here we attach the DOM event sources, wire the side
  // effects, and fold everything into one subscription torn down by a single
  // destroy$.
  $effect(() => {
    if (!rootEl) return;

    const el = rootEl;
    const destroy$ = new Subject<void>();

    // Capture phase so the input-source flag lands before bits-ui reacts.
    const down$ = fromEvent<PointerEvent>(el, "pointerdown", { capture: true });
    const key$ = fromEvent<KeyboardEvent>(el, "keydown", { capture: true });

    const up$ = fromEvent<PointerEvent>(el, "pointerup");
    const cancel$ = fromEvent<PointerEvent>(el, "pointercancel");
    const leave$ = fromEvent<PointerEvent>(el, "pointerleave");

    const { preview$, commit$ } = createScrubInteraction({
      down$,
      move$: fromEvent<PointerEvent>(el, "pointermove"),
      up$,
      cancel$,
      leave$,
    });

    merge(
      down$.pipe(tap((event) => {
        lastInputWasPointer = true;
        isTouchScrub = event.pointerType === "touch";
        // Capture so a drag keeps scrubbing even if the pointer drifts off the
        // row. setPointerCapture can throw where unsupported (e.g. jsdom).
        try {
          el.setPointerCapture(event.pointerId);
        } catch {
          // No capture available; the gesture still works within the row.
        }
      })),
      preview$.pipe(tap(syncPreview)),
      commit$.pipe(tap(({ down, up }) => commitGesture(down, up))),
      merge(up$, cancel$, leave$).pipe(tap(() => (isTouchScrub = false))),
      key$.pipe(tap(() => (lastInputWasPointer = false))),
    )
      .pipe(takeUntil(destroy$))
      .subscribe();

    return () => {
      destroy$.next();
      destroy$.complete();
    };
  });

  function onValueChange(stars: number) {
    // Pointer commits are handled on pointerup; ignore the click that follows.
    if (lastInputWasPointer) return;
    commit(stars);
  }
</script>

<div
  class="trakt-rating-stars"
  data-variant={variant}
  class:is-previewing={isPreviewing}
  class:is-clearing={isClearing}
  class:is-touch-scrub={isTouchScrub && isPreviewing}
  bind:this={rootEl}
>
  <span
    class="rating-preview"
    class:is-visible={isPreviewing}
    aria-hidden="true"
    style={previewX !== null ? `--preview-x: ${previewX}px` : undefined}
  >
    {displayStars <= 0 ? m.text_no_rating() : displayStars.toFixed(1)}
  </span>

  <RatingGroup.Root
    value={committedStars}
    {onValueChange}
    max={MAX_STARS}
    {allowHalf}
    hoverPreview={false}
    disabled={isRating}
    aria-label={m.header_rate_now()}
    class="rating-stars-row"
  >
    {#snippet children({ items })}
      {#each items as item (item.index)}
        <RatingGroup.Item
          index={item.index}
          class="star-item"
          aria-label={m.button_label_star_rating({ stars: item.index + 1 })}
          data-highlighted={highlightIndex === item.index ? "" : undefined}
        >
          <StarIcon
            fill={starFill({
              value: displayStars,
              index: item.index,
              allowHalf,
            })}
          />
        </RatingGroup.Item>
      {/each}
    {/snippet}
  </RatingGroup.Root>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-rating-stars {
    display: flex;
    align-items: center;
    position: relative;
    isolation: isolate;
    touch-action: pan-y;
    // Suppress the grey flash the mobile browser paints on tap.
    -webkit-tap-highlight-color: transparent;

    --ease-glide: cubic-bezier(0.16, 1, 0.3, 1);

    &::before {
      content: "";
      position: absolute;
      inset-block: calc((var(--ni-44) - 100%) / -2);
      inset-inline: 0;
      z-index: -1;
      cursor: pointer;
    }

    // Floats above the stars while scrubbing; snaps to the current star's
    // center via the JS-measured --preview-x (falls back to center). Absolute
    // so it never shifts the surrounding row; translate centering is
    // RTL-symmetric.
    // Mirrors the compact tooltip primitive (.trakt-tooltip-compact) so the
    // scrub value reads as a tooltip consistent with the rest of the app.
    .rating-preview {
      position: absolute;
      bottom: calc(100% + var(--gap-xs));
      left: 50%;
      translate: var(--preview-x, 0px) 0;
      transform: translateX(-50%) translateY(0.35rem) scale(0.85);
      transform-origin: bottom center;
      z-index: var(--layer-top);
      white-space: nowrap;

      background-color: var(--color-tooltip-background);
      color: var(--color-tooltip-text);
      font-size: var(--ni-12);
      line-height: 1;
      font-weight: 500;

      border-radius: var(--border-radius-xs);
      padding: var(--ni-6) var(--ni-8);
      box-shadow: var(--shadow-menu);

      pointer-events: none;
      opacity: 0;
      will-change: translate, transform, opacity;
      transition:
        translate var(--transition-increment) var(--ease-glide),
        transform var(--transition-increment) var(--ease-glide),
        opacity var(--transition-increment) ease;

      &.is-visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1);
      }
    }

    // bits-ui renders these nodes itself, so they carry no scope hash and must
    // be reached via :global (anchored to the scoped root to stay contained).
    :global(.rating-stars-row) {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
    }

    :global(.star-item) {
      display: inline-flex;
      cursor: pointer;
      will-change: transform;
      transition:
        transform var(--transition-increment) var(--ease-glide),
        color var(--transition-increment) var(--ease-glide);
    }

    &.is-previewing {
      --star-fill-duration: 0ms;

      :global(.star-item) {
        color: var(--orange-400);
      }

      :global(.star-item[data-highlighted]) {
        transform: scale(1.15);
      }
    }

    // Hovering the "no rating" zone: recolor the row red to flag removal.
    &.is-clearing :global(.star-item) {
      color: var(--red-500);
    }

    // Touch scrub: the thumb sits on the active star, so lift it and the
    // tooltip clear of the finger to keep both legible.
    &.is-touch-scrub {
      .rating-preview {
        bottom: calc(100% + var(--gap-l));
      }

      :global(.star-item[data-highlighted]) {
        transform: translateY(-0.75rem) scale(1.2);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .rating-preview,
      .rating-preview.is-visible {
        transform: translateX(-50%);
        transition: opacity var(--transition-increment) ease;
      }

      :global(.star-item) {
        transition: color var(--transition-increment) ease;
      }
    }
  }
</style>
