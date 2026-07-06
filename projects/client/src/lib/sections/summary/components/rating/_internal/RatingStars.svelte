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
    onAddRating: (rating: number, ev?: MouseEvent) => void;
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

  // Inline offset of the active star's center, so the preview bubble snaps to
  // it. Retains its last value when the gesture ends so the bubble recedes in
  // place under the current star instead of gliding back to center. null only
  // before the first interaction (bubble falls back to center).
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
  const highlightIndex = $derived(Math.ceil(displayStars) - 1);

  // Layout measured once per interaction and reused across pointermoves; reading
  // the DOM on every move would force a synchronous reflow (layout thrashing).
  // Cleared when the gesture ends so the next interaction re-measures.
  type StarLayout = {
    rects: ReadonlyArray<DOMRect>;
    rootLeft: number;
    isRtl: boolean;
  };
  let layout: StarLayout | null = null;

  function measureLayout(): StarLayout | null {
    if (!rootEl) return null;

    const items = Array.from(
      rootEl.querySelectorAll<HTMLElement>(ITEM_SELECTOR),
    );
    if (items.length === 0) return null;

    return {
      rects: items.map((item) => item.getBoundingClientRect()),
      rootLeft: rootEl.getBoundingClientRect().left,
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

  // Center of the given star, relative to the root's inline-start, so the
  // preview bubble snaps to a star rather than the raw cursor.
  function starCenterX(stars: number): number | null {
    layout ??= measureLayout();
    if (!layout) return null;

    const index = Math.min(
      Math.max(Math.ceil(stars) - 1, 0),
      layout.rects.length - 1,
    );
    const rect = layout.rects.at(index);
    if (!rect) return null;

    return rect.left + rect.width / 2 - layout.rootLeft;
  }

  function commit(stars: number, ev?: MouseEvent) {
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

    onAddRating(toRating(stars), ev);
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
    previewStars = stars;
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
      commit(snapToWhole ? Math.ceil(stars) : stars, up);
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
    touch-action: none;
    // Suppress the grey flash the mobile browser paints on tap.
    -webkit-tap-highlight-color: transparent;

    // Premium easing curves shared across the interaction.
    --ease-glide: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

    // Floats above the stars while scrubbing; snaps to the current star's
    // center via the JS-measured --preview-x (falls back to center). Absolute
    // so it never shifts the surrounding row; translate centering is
    // RTL-symmetric.
    // Mirrors the compact tooltip primitive (.trakt-tooltip-compact) so the
    // scrub value reads as a tooltip consistent with the rest of the app.
    .rating-preview {
      position: absolute;
      bottom: calc(100% + var(--gap-xs));
      left: var(--preview-x, 50%);
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
      will-change: left, transform, opacity;
      transition:
        left var(--transition-increment) var(--ease-glide),
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
        transform var(--transition-increment) var(--ease-spring),
        color var(--transition-increment) var(--ease-glide),
        opacity var(--transition-increment) var(--ease-glide);
    }

    :global(.star-item[data-highlighted]) {
      transform: scale(1.3);
    }

    // Tint the whole row while scrubbing, and gently recede the stars that
    // aren't the active target so the highlight reads cleanly.
    &.is-previewing {
      :global(.star-item) {
        color: var(--orange-400);
      }

      :global(.star-item:not([data-highlighted])) {
        opacity: 0.75;
      }
    }

    // Touch scrub: the thumb sits on the active star, so lift it and the
    // tooltip clear of the finger to keep both legible.
    &.is-touch-scrub {
      .rating-preview {
        bottom: calc(100% + var(--gap-l));
      }

      :global(.star-item[data-highlighted]) {
        transform: translateY(-0.75rem) scale(1.3);
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
