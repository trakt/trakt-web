<script lang="ts">
  import YirTooltip from "../../../_internal/YirTooltip.svelte";
  import { tooltipEdge } from "./tooltipEdge";

  type Bar = {
    value: number;
    label: string;
    main: string;
    sub: string;
  };

  const {
    bars,
    active,
    labelEvery = 1,
    height = "var(--ni-160)",
  }: {
    bars: ReadonlyArray<Bar>;
    active: boolean;
    labelEvery?: number;
    height?: string;
  } = $props();

  const max = $derived(Math.max(1, ...bars.map((bar) => bar.value)));
  const peak = $derived(bars.findIndex((bar) => bar.value === max));

  let hovered = $state<number | null>(null);


</script>

<div
  class="trakt-yir-bars"
  class:is-active={active}
  style:--bars={bars.length}
  style:--height={height}
>
  {#each bars as bar, index (index)}
    <div
      class="yir-bar"
      class:is-peak={index === peak}
      role="img"
      aria-label="{bar.sub}: {bar.main}"
      onpointerenter={(event) => {
        if (event.pointerType === "mouse") hovered = index;
      }}
      onpointerleave={() => (hovered = null)}
    >
      <div class="yir-bar-track" style:--v={bar.value / max}>
        <i style:--d="calc(var(--yir-beat) * {Math.min(index * 0.18, 9)})"></i>
        {#if index === peak}
          <b class="yir-bar-peak" aria-hidden="true"></b>
        {/if}
        {#if hovered === index}
          <div class="yir-bar-tooltip" data-edge={tooltipEdge(index, bars.length)} aria-hidden="true">
            <YirTooltip main={bar.main} sub={bar.sub} />
          </div>
        {/if}
      </div>
      <span
        class="yir-bar-label"
        class:is-hidden={index % labelEvery !== 0}
        class:is-minor={index % (labelEvery * 2) !== 0}
      >
        {bar.label}
      </span>
    </div>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-bars {
    display: grid;
    grid-template-columns: repeat(var(--bars), minmax(0, 1fr));
    gap: clamp(var(--ni-2), 0.4vw, var(--ni-6));
    width: 100%;
  }

  .yir-bar {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
    min-width: 0;
  }

  .yir-bar-track {
    height: var(--height);
    display: flex;
    align-items: flex-end;

    i {
      display: block;
      width: 100%;
      height: max(var(--ni-2), calc(var(--v) * 100%));
      border-radius: var(--ni-2) var(--ni-2) 0 0;
      background: color-mix(
        in srgb,
        var(--color-yir-accent) 45%,
        var(--color-yir-background)
      );
      transform-origin: bottom;
      transform: scaleY(0);
      transition: transform calc(var(--yir-beat) * 9) var(--yir-ease);
      transition-delay: var(--d);
    }
  }

  .is-peak .yir-bar-track i {
    background: var(--color-yir-accent);
  }

  .is-active .yir-bar-track i {
    transform: scaleY(1);
  }

  .yir-bar-label {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    color: var(--color-yir-text-muted);
    display: flex;
    justify-content: center;
    white-space: nowrap;

    &.is-hidden {
      visibility: hidden;
    }

    @include for-mobile {
      &.is-minor {
        visibility: hidden;
      }
    }
  }

  .is-peak .yir-bar-label {
    color: var(--color-yir-text-accent);
    visibility: visible;
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-bar-track i {
      transform: none;
      transition: none;
    }
  }

  .yir-bar-track {
    position: relative;

    i {
      transition:
        transform calc(var(--yir-beat) * 9) var(--yir-ease) var(--d),
        background-color var(--yir-t-quick) ease,
        opacity var(--yir-t-quick) ease;
    }
  }

  .yir-bar-peak {
    position: absolute;
    inset-inline-start: 50%;
    bottom: calc(var(--v) * 100% + var(--ni-6));
    width: var(--ni-8);
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--color-yir-accent);
    translate: -50% 0;
    transform: scale(0);
    transition: transform calc(var(--yir-beat) * 5) cubic-bezier(0.3, 1.6, 0.5, 1) calc(var(--yir-beat) * 11);
  }

  .is-active .yir-bar-peak {
    transform: scale(1);
    animation: peak-pulse 2.6s ease-out 1.6s infinite;
  }

  @keyframes peak-pulse {
    0% {
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-yir-accent) 60%, transparent);
    }
    70%,
    100% {
      box-shadow: 0 0 0 var(--ni-12) color-mix(in srgb, var(--color-yir-accent) 0%, transparent);
    }
  }

  @media (hover: hover) {
    .trakt-yir-bars:hover .yir-bar:not(:hover) i {
      opacity: 0.45;
    }

    .yir-bar:hover i {
      background: var(--color-yir-accent);
    }

    .yir-bar:hover .yir-bar-label {
      visibility: visible;
      color: var(--color-yir-text-primary);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-bar-peak {
      transform: scale(1);
      transition: none;
      animation: none;
    }
  }

  .yir-bar-tooltip {
    position: absolute;
    z-index: var(--layer-floating);
    bottom: calc(var(--v) * 100% + var(--ni-20));
    inset-inline-start: 50%;
    translate: -50% 0;
    pointer-events: none;
    animation: bar-tooltip-in calc(var(--yir-beat) * 1.8) var(--yir-ease) both;

    &[data-edge="start"] {
      inset-inline-start: 0;
      translate: 0 0;
    }

    &[data-edge="end"] {
      inset-inline-start: auto;
      inset-inline-end: 0;
      translate: 0 0;
    }
  }

  @keyframes bar-tooltip-in {
    from {
      opacity: 0;
      transform: translateY(var(--ni-4));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-bar-tooltip {
      animation: none;
    }
  }
</style>
