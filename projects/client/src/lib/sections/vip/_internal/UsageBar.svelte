<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { revealOnView } from "$lib/utils/actions/revealOnView";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { calculateLimitProgress } from "./utils/calculateLimitProgress";

  const lowPercentageThreshold = 5;

  const {
    current,
    freeLimit,
    vipLimit,
    variant: externalVariant = "vip",
    isLoading = false,
    fillOnView = false,
    index = 0,
  }: {
    current: number;
    freeLimit: number;
    vipLimit: number;
    variant?: "vip" | "free";
    isLoading?: boolean;
    fillOnView?: boolean;
    index?: number;
  } = $props();

  const isEqualLimit = $derived(freeLimit === vipLimit);
  const variant = $derived(isEqualLimit ? "vip" : externalVariant);

  const { limitedPercentage, progress, isOverLimit } = $derived(
    calculateLimitProgress({ current, freeLimit, vipLimit, variant }),
  );

  const isLowPercentage = $derived(
    progress > 0 && progress < lowPercentageThreshold,
  );
</script>

<div
  class="trakt-usage-bar"
  data-variant={variant}
  data-fill-on-view={fillOnView}
  use:revealOnView={{ delay: Math.min(index * 150, 400) }}
>
  {#if limitedPercentage}
    <div
      class="trakt-limit-zone free-limit"
      style:width="{limitedPercentage}%"
    ></div>
    <div
      class="trakt-limit-zone vip-limit"
      style:inset-inline-start="{limitedPercentage}%"
    >
      <span class="vip-limit-label tag secondary">
        {toHumanNumber(vipLimit, languageTag())}
      </span>
    </div>
  {/if}

  <div class="trakt-usage-fill">
    <DistributionBar
      track={false}
      fraction={(isLoading ? 0 : progress) / 100}
      minVisible={isLowPercentage ? 0.06 : 0}
      color={isOverLimit ? "var(--viz-negative)" : "var(--color-usage-bar)"}
      --distribution-bar-thickness="100%"
    />
  </div>
</div>

<style>
  .trakt-usage-bar {
    --bar-border-color: color-mix(
      in srgb,
      var(--color-usage-bar) 30%,
      transparent
    );
    position: relative;

    height: var(--ni-16);
    width: 100%;

    border-radius: var(--border-radius-xxl);
    overflow: hidden;

    &:global([data-reveal]) {
      transition: none;
    }

    &:global([data-reveal="pending"]) {
      opacity: 1;
      translate: none;
    }

    &[data-variant="vip"] {
      background-color: var(--color-usage-bar-background);
      box-shadow: inset 0 0 0 var(--ni-1) var(--bar-border-color);
    }

    &[data-variant="free"] .trakt-limit-zone {
      background-color: var(--color-usage-bar-background);

      box-sizing: border-box;
      border: var(--ni-1) solid var(--bar-border-color);
      border-radius: var(--border-radius-xxl);
    }

    &[data-variant="free"] {
      .free-limit {
        z-index: var(--layer-raised);
      }

      .vip-limit {
        inset-inline-end: 0;
        margin-inline-start: var(--ni-neg-24);

        border-inline-start: none;
        border-style: dashed;

        background-color: transparent;
      }
    }
  }

  .trakt-limit-zone {
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
  }

  .vip-limit-label {
    position: absolute;
    inset-inline-end: var(--ni-8);
    top: 50%;
    transform: translateY(-50%);
  }

  .trakt-usage-fill {
    z-index: var(--layer-raised);
    position: absolute;
    inset: 0;

    clip-path: inset(0 0 0 0 round var(--border-radius-xxl));
  }

  .trakt-usage-bar[data-fill-on-view="true"] {
    .trakt-usage-fill {
      transition: clip-path 900ms cubic-bezier(0.22, 1, 0.36, 1)
        var(--reveal-delay, 0ms);
    }

    .vip-limit {
      transition: opacity 500ms ease-out calc(var(--reveal-delay, 0ms) + 250ms);
    }

    &:global([data-reveal="pending"]) .trakt-usage-fill {
      clip-path: inset(0 100% 0 0 round var(--border-radius-xxl));
    }

    &:global([data-reveal="pending"]):dir(rtl) .trakt-usage-fill {
      clip-path: inset(0 0 0 100% round var(--border-radius-xxl));
    }

    &:global([data-reveal="pending"]) .vip-limit {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-usage-bar[data-fill-on-view="true"] {
      .trakt-usage-fill,
      .vip-limit {
        transition: none;
      }
    }
  }
</style>
