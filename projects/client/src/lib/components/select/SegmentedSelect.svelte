<script lang="ts">
  import { goto } from "$app/navigation";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { appendGlobalParameters } from "$lib/features/parameters/appendGlobalParameters.ts";
  import type { SegmentedSelectOption } from "./models/SegmentedSelectOption.ts";
  import type { SegmentedSelectProps } from "./models/SegmentedSelectProps.ts";

  const UNFOLD_STAGGER_MS = 60;

  const {
    options,
    value,
    variant = "regular",
    disabled = false,
    ariaLabel,
    icon,
    expandable = false,
    collapsedCount = 0,
    expanded = false,
    extension,
    onChange,
  }: SegmentedSelectProps = $props();

  const selectedIndex = $derived(
    Math.max(
      0,
      options.findIndex((option) => option.value === value),
    ),
  );

  // Index at/after which trailing options fold away until `expanded`.
  const collapseFrom = $derived(
    expandable ? options.length - collapsedCount : options.length,
  );
  const isCollapsed = (index: number) => !expanded && index >= collapseFrom;

  // Trailing options unfold with a small per-item stagger and refold in reverse
  // order. The delay is scoped to the unfold properties only (never color).
  const unfoldDelay = (index: number) => {
    if (index < collapseFrom) return "0ms";
    const step = expanded ? index - collapseFrom : options.length - 1 - index;
    return `${step * UNFOLD_STAGGER_MS}ms`;
  };

  // Link segments keep native anchor semantics but navigate client-side, exactly
  // like the legacy Toggler: commit the value, then goto the parameter-merged
  // href (set on the element by appendGlobalParameters) without spamming history.
  const navigate = (option: SegmentedSelectOption, event: MouseEvent) => {
    event.preventDefault();
    onChange(option.value);

    const resolvedHref = (event.currentTarget as HTMLAnchorElement).href;
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(resolvedHref, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  };

  // Expandable-only: measure the selected segment so the sliding selector tracks
  // segments of any width (columns aren't equal once trailing items unfold). The
  // default (non-expandable) path keeps its SSR-correct pure-CSS positioning and
  // never runs this effect.
  let trackEl = $state<HTMLDivElement>();
  let rowEl = $state<HTMLDivElement>();

  // Fluid layouts (expandable panel, selected-label) have variable-width
  // segments, so the selector must be measured rather than grid-computed.
  const isFluid = $derived(expandable || variant === "selected-label");

  const measure = () => {
    const track = trackEl;
    const row = rowEl;
    if (!track || !row) return;
    // While a selection tween owns the selector vars (selected-label), stray
    // measurements (value-change effect, ResizeObserver, fonts.ready) must not
    // snap the selector to the target's live rect mid-morph.
    if (track.classList.contains("is-tracking")) return;

    const selected = row.querySelector<HTMLElement>(
      '.segment[aria-checked="true"]',
    );
    if (!selected) return;

    const rowRect = row.getBoundingClientRect();
    const rect = selected.getBoundingClientRect();
    // Pure physical screen coords, paired with `left: 0` + translateX on the
    // selector. Measurement and transform are BOTH physical, so it is correct
    // under LTR and RTL with no mirror math - and translateX is compositor-
    // driven, so the slide stays smooth (animating inset/left reflows instead).
    row.style.setProperty("--selector-x", `${rect.left - rowRect.left}px`);
    row.style.setProperty("--selector-w", `${rect.width}px`);
    // Direct DOM write (like the style props above) instead of $state - keeps
    // the imperative measure path together and avoids a template re-render.
    track.classList.add("is-measured");
  };

  // Every selection change in selected-label morphs neighbouring widths, so
  // the selector must travel to a target that is ITSELF animating. A CSS
  // transition chasing re-measured targets restarts mid-flight (a dropped
  // frame reads as a teleport), and hard-riding the live rect snaps to the
  // target's pre-morph position. Instead: tween from the selector's current
  // rendered rect toward the LIVE target rect, easing the blend factor - a
  // continuous start that converges exactly on the settled geometry.
  const TRACK_MORPH_MS = 300;
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  $effect(() => {
    if (variant !== "selected-label") return;
    void value;
    const track = trackEl;
    const row = rowEl;
    if (!track || !row) return;

    const selector = row.querySelector<HTMLElement>(".segment-selector");
    if (!selector) return;

    const rowRect = row.getBoundingClientRect();
    const selectorRect = selector.getBoundingClientRect();
    const from = { x: selectorRect.left - rowRect.left, w: selectorRect.width };

    track.classList.add("is-tracking");
    const start = performance.now();

    let raf = requestAnimationFrame(function follow() {
      const selected = row.querySelector<HTMLElement>(
        '.segment[aria-checked="true"]',
      );
      if (!selected) {
        track.classList.remove("is-tracking");
        return;
      }

      const liveRow = row.getBoundingClientRect();
      const target = selected.getBoundingClientRect();
      const progress = easeOutCubic(
        Math.min((performance.now() - start) / TRACK_MORPH_MS, 1),
      );

      const x = from.x + (target.left - liveRow.left - from.x) * progress;
      const w = from.w + (target.width - from.w) * progress;
      row.style.setProperty("--selector-x", `${x}px`);
      row.style.setProperty("--selector-w", `${w}px`);

      if (progress < 1) {
        raf = requestAnimationFrame(follow);
        return;
      }
      track.classList.remove("is-tracking");
      measure();
    });

    return () => {
      cancelAnimationFrame(raf);
      track.classList.remove("is-tracking");
    };
  });

  $effect(() => {
    if (!isFluid) return;
    const track = trackEl;
    const row = rowEl;
    if (!track || !row) return;

    // Re-measure when the selection, expansion, or option count changes.
    void value;
    void expanded;
    void options.length;

    measure();
    // Label widths shift when the webfont lands after first paint - take one
    // more measurement when fonts are ready so the selector never wraps a
    // fallback-font-sized segment.
    document.fonts?.ready.then(() => measure());
    // Arm the selector's movement transitions one frame AFTER the first
    // measurement: a fresh mount then paints in place instead of visibly
    // sliding in from x=0 (mobile instances remount on every navigation).
    const settle = requestAnimationFrame(() =>
      track.classList.add("is-settled")
    );
    // A ResizeObserver keeps the selector glued through the unfold animation and
    // any layout/resize, without a per-frame rAF loop.
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => {
      cancelAnimationFrame(settle);
      observer.disconnect();
    };
  });

</script>

{#snippet body(option: SegmentedSelectOption)}
  {#if icon}
    <span class="segment-icon">{@render icon(option)}</span>
  {/if}
  {#if variant !== "compact" || !icon}
    <!-- Outer span is the (animatable) layout box, inner clips the text - lets
         selected-label morph the label to its REAL width via 0fr<->1fr. -->
    <span class="segment-label">
      <span class="label-text bold ellipsis capitalize">{option.label}</span>
    </span>
  {/if}
{/snippet}

<div
  class="trakt-segmented-select"
  bind:this={trackEl}
  role="radiogroup"
  aria-label={ariaLabel}
  data-variant={variant}
  data-expandable={expandable ? "true" : undefined}
  class:is-expanded={expandable && expanded}
  style:--segment-count={options.length}
  style:--selected-index={selectedIndex}
>
  <div
    class="segment-row"
    bind:this={rowEl}
    data-dpad-navigation={DpadNavigationType.List}
  >
    <div class="segment-selector" aria-hidden="true"></div>

    {#each options as option, index (option.value)}
      {@const collapsed = isCollapsed(index)}
      {#if option.href}
        <!-- Same collapsed/disabled contract as the button branch: anchors cannot
           carry [disabled], so aria-disabled + tabindex + a click guard stand in
           (CSS adds pointer-events: none). The element persists across
           collapse/expand so the unfold transitions instead of remounting. -->
        <a
          class="segment"
          class:is-selected={!collapsed && index === selectedIndex}
          class:is-collapsed={collapsed}
          style:--unfold-delay={unfoldDelay(index)}
          role={collapsed ? undefined : "radio"}
          aria-checked={collapsed ? undefined : index === selectedIndex}
          aria-hidden={collapsed ? "true" : undefined}
          aria-disabled={disabled ? "true" : undefined}
          aria-label={option.label}
          tabindex={collapsed || disabled ? -1 : undefined}
          data-dpad-navigation={collapsed ? undefined : DpadNavigationType.Item}
          href={option.href}
          use:appendGlobalParameters={option.href}
          onclick={(event) => {
            if (disabled || collapsed) {
              event.preventDefault();
              return;
            }
            navigate(option, event);
          }}
        >
          {@render body(option)}
        </a>
      {:else}
        <!--
        Collapsible items keep the SAME element across collapse/expand (only the
        is-collapsed class + a11y attrs toggle) so the unfold actually transitions
        instead of remounting. While collapsed they are disabled + aria-hidden +
        out of the tab/dpad order, so nothing can focus a folded-away pill.
      -->
        <button
          type="button"
          class="segment"
          class:is-selected={!collapsed && index === selectedIndex}
          class:is-collapsed={collapsed}
          style:--unfold-delay={unfoldDelay(index)}
          role={collapsed ? undefined : "radio"}
          aria-checked={collapsed ? undefined : index === selectedIndex}
          aria-hidden={collapsed ? "true" : undefined}
          aria-label={option.label}
          tabindex={collapsed ? -1 : undefined}
          data-dpad-navigation={collapsed ? undefined : DpadNavigationType.Item}
          disabled={collapsed || disabled}
          onclick={() => onChange(option.value)}
        >
          {@render body(option)}
        </button>
      {/if}
    {/each}
  </div>

  <!-- Deliberately NO vertical animation in either direction: the row appears/
       disappears in a single layout pass so any consumer's recentering
       compensation cancels exactly (animating height against a transform can
       tear by a frame and read as a dip). All motion lives on the X axis. -->
  {#if expandable && extension && expanded}
    <div class="segment-extension">
      <div class="extension-divider"></div>
      <div class="extension-content">
        {@render extension()}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-segmented-select {
    --segment-height: var(--ni-32);
    --segment-inset: var(--ni-4);
    --segment-gap: var(--ni-2);
    // Overridable per call site (e.g. drawer surfaces standardise on
    // --border-radius-m) via `--segmented-select-radius`.
    --track-base-radius: var(
      --segmented-select-radius,
      var(--border-radius-l)
    );
    --track-radius: var(--track-base-radius);
    // Inner radius concentric with the COLLAPSED track (base − inset) and
    // deliberately pinned there: deriving it from the live track radius made
    // the selector's corners snap 12->16 when the panel expanded - a visible
    // deformation on a pill that isn't otherwise moving.
    --segment-radius: calc(var(--track-base-radius) - var(--segment-inset));
    --segment-font-size: var(--font-size-text);

    position: relative;
    box-sizing: border-box;
    // Hug content (like the legacy toggler) so it never stretches inside a flex
    // actions row. Never overflow a narrow parent.
    width: fit-content;
    max-width: 100%;

    display: flex;
    flex-direction: column;

    padding: var(--segment-inset);
    border-radius: var(--track-radius);
    background-color: var(--color-segmented-track-background);
    backdrop-filter: blur(var(--ni-8));
    overflow: hidden;

    // Same duration + curve as the extension slide and the navbar shift, so
    // every panel-open motion shares one clock.
    transition: border-radius 240ms cubic-bezier(0.215, 0.61, 0.355, 1);

    &[data-variant="compact"] {
      --track-base-radius: var(
        --segmented-select-radius,
        var(--border-radius-m)
      );
    }

    // The taller two-row panel reads better with a slightly larger radius.
    &.is-expanded {
      --track-radius: var(--border-radius-xl);
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }

    .segment-row {
      position: relative;

      display: grid;
      grid-template-columns: repeat(var(--segment-count), 1fr);
      gap: var(--segment-gap);

      // Width of a single equal segment (matches one grid column). Reused by
      // the sliding selector so its travel is exact for any option count.
      --selector-width: calc(
        (100% - var(--segment-gap) * (var(--segment-count) - 1)) /
          var(--segment-count)
      );
    }

    &[data-variant="compact"] .segment-row {
      grid-template-columns: repeat(
        var(--segment-count),
        var(--segment-height)
      );
    }
  }

  .segment-selector {
    position: absolute;
    z-index: 0;
    top: 0;
    bottom: 0;
    inset-inline-start: 0;
    width: var(--selector-width);

    // The selector's own width equals one column, so 100% here (own-width
    // relative for translate) advances exactly one segment; add the gap for the
    // track pitch. translateX is not direction-aware, so mirror it in RTL.
    transform: translateX(
      calc(
        var(--rtl-sign, 1) * var(--selected-index) * (100% + var(--segment-gap))
      )
    );

    border-radius: var(--segment-radius);
    background: var(--color-segmented-selector-background);
    box-shadow: var(--ni-0) var(--ni-2) var(--ni-8) var(--ni-0)
      color-mix(in srgb, var(--color-shadow) 30%, transparent);

    transition: transform var(--transition-increment) ease-in-out;

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  .segment {
    all: unset;

    position: relative;
    z-index: var(--layer-raised);
    box-sizing: border-box;

    min-width: 0;
    height: var(--segment-height);

    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);

    padding-inline: var(--ni-12);
    cursor: pointer;

    color: var(--color-text-secondary);
    font-size: var(--segment-font-size);
    border-radius: var(--segment-radius);

    -webkit-tap-highlight-color: transparent;

    transition: color var(--transition-increment) ease-in-out;

    .segment-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      :global(svg) {
        display: block;
        width: var(--ni-16);
        height: var(--ni-16);
      }
    }

    &.is-selected {
      color: var(--color-segmented-selector-foreground);
      cursor: default;
    }

    &:not(.is-selected) {
      @include for-mouse {
        &:hover {
          color: var(--color-text-primary);
        }
      }
    }

    &:focus-visible {
      outline: var(--ni-2) solid var(--color-segmented-selector-foreground);
      outline-offset: calc(-1 * var(--ni-2));
    }

    &[disabled],
    &[aria-disabled="true"] {
      cursor: not-allowed;
      color: var(--color-foreground-button-disabled);
    }

    // Anchors cannot be [disabled]; block their pointer interaction instead.
    &[aria-disabled="true"] {
      pointer-events: none;
    }
  }

  .trakt-segmented-select[data-variant="compact"] .segment {
    padding-inline: 0;
  }

  // ---------------------------------------------------------------------------
  // Fluid layouts (opt-in): a flex row with variable-width segments and a
  // JS-measured selector. Used by the expandable panel (trailing items fold
  // away; optional extension row below the options) and by the selected-label
  // variant (only the active option shows its label). The default grid +
  // pure-CSS selector above is left completely untouched.
  // ---------------------------------------------------------------------------
  .trakt-segmented-select[data-expandable="true"],
  .trakt-segmented-select[data-variant="selected-label"] {
    --expand-duration: 360ms;
    --expand-slide: 300ms;
    --expand-ease: cubic-bezier(0.22, 1, 0.36, 1);
    // The selector chases re-measured targets (the ResizeObserver restarts its
    // transition while neighbours morph), so it needs a fast-START curve -
    // every restart makes immediate progress. Kept separate from
    // --expand-ease so variants can slow the label morph without lagging the
    // selector.
    --selector-ease: cubic-bezier(0.22, 1, 0.36, 1);

    .segment-row {
      display: inline-flex;
      align-items: center;
      gap: 0;
    }

    .segment {
      flex: none;
      max-inline-size: var(--ni-160);
      white-space: nowrap;
      overflow: hidden;

      transition:
        color var(--transition-increment) ease-in-out,
        max-inline-size var(--expand-duration) var(--expand-ease)
          var(--unfold-delay, 0ms),
        opacity var(--expand-duration) var(--expand-ease)
          var(--unfold-delay, 0ms),
        padding-inline var(--expand-duration) var(--expand-ease)
          var(--unfold-delay, 0ms),
        margin-inline-start var(--expand-duration) var(--expand-ease)
          var(--unfold-delay, 0ms);
    }

    .segment + .segment {
      margin-inline-start: var(--segment-gap);
    }

    .segment.is-collapsed {
      max-inline-size: 0;
      padding-inline: 0;
      margin-inline-start: 0;
      opacity: 0;
      pointer-events: none;
    }

    .segment-selector {
      // Physical `left: 0` origin + translateX(measured physical offset): GPU-
      // composited so the slide glides. Correct in RTL because measurement and
      // transform are both physical screen-space - the sanctioned
      // getBoundingClientRect exception to logical properties.
      inset-inline: auto;
      left: 0;
      width: var(--selector-w, 0);
      transform: translateX(var(--selector-x, 0));
      // Hidden until the first measurement lands so it never flashes at x=0 on
      // SSR/hydration or a /search deep-link.
      opacity: 0;

      // Movement transitions live under .is-settled below - a fresh mount must
      // apply its first measured position WITHOUT animating.
      transition: opacity var(--transition-increment) ease-in-out;
    }

    // :global - these classes are added at runtime by the measuring effect, so
    // the compiler would otherwise prune the "unused" selectors (same idiom as
    // the Toggler's .moving class).
    &:global(.is-measured) .segment-selector {
      opacity: 1;
    }

    &:global(.is-settled) .segment-selector {
      transition:
        transform var(--expand-slide) var(--selector-ease),
        width var(--expand-slide) var(--selector-ease),
        opacity var(--transition-increment) ease-in-out;
    }

    // While frame-tracking a morph the selector follows real geometry - its
    // own easing would fight the per-frame updates and tear on slow frames.
    &:global(.is-tracking) .segment-selector {
      transition: opacity var(--transition-increment) ease-in-out;
    }

    @media (prefers-reduced-motion: reduce) {
      .segment,
      .segment-selector {
        transition: none;
      }
    }
  }

  // Selected-label: icon-only squares, except the active option which grows to
  // reveal its label. The flex gap is moved onto the label's margin so it can
  // collapse to zero along with the label's width.
  .trakt-segmented-select[data-variant="selected-label"] {
    // Snappier than the desktop unfold: a long ease-out tail reads sluggish on
    // a small label morph, so land decisively. The selector clock matches the
    // morph duration so it arrives with the label, not after it.
    --expand-duration: 240ms;
    --expand-slide: 240ms;
    --expand-ease: cubic-bezier(0.3, 0, 0.2, 1);

    .segment {
      gap: 0;
      padding-inline: var(--ni-8);

      .segment-label {
        display: grid;
        // 1fr tracks the label's REAL width, so expand and collapse stay
        // symmetric. Animating a fixed max-inline-size instead overshoots:
        // the track grows past the text early, then visibly snaps back while
        // the outgoing label burns through its unused headroom.
        grid-template-columns: 1fr;
        margin-inline-start: var(--gap-xs);

        transition:
          grid-template-columns var(--expand-duration) var(--expand-ease),
          margin-inline-start var(--expand-duration) var(--expand-ease),
          opacity var(--expand-duration) var(--expand-ease);

        .label-text {
          min-width: 0;
          overflow: hidden;
          white-space: nowrap;
          // Plain clip while the column animates - an ellipsis would render
          // "Med…" mid-morph and only swap to the full word at the very end
          // of the ease-out tail, reading as a delay.
          text-overflow: clip;
        }
      }

      &.is-selected {
        padding-inline: var(--ni-12);
      }

      &:not(.is-selected) .segment-label {
        grid-template-columns: 0fr;
        margin-inline-start: 0;
        opacity: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .segment .segment-label {
        transition: none;
      }
    }
  }

  .segment-extension {
    // Keep in sync with the shift compensation in NavbarContentToggle and the
    // results clearance on the search page.
    --extension-height: calc(var(--ni-40) + var(--ni-4));

    box-sizing: border-box;
    height: var(--extension-height);

    display: flex;
    flex-direction: column;
  }

  .extension-divider {
    flex-shrink: 0;
    height: var(--border-thickness-xxs);
    margin-block-start: var(--segment-inset);
    background: var(--color-segmented-track-border);
  }

  .extension-content {
    flex: 1;
    min-height: 0;

    display: flex;
    // Bottom-anchored (not centered) so the embedded row sits toward the
    // panel's lower edge, with the extra air above it.
    align-items: flex-end;

    padding-inline: var(--ni-8);
  }
</style>
