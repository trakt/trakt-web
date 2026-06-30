<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { calculateLimitProgress } from "./utils/calculateLimitProgress";

  const lowPercentageThreshold = 5;

  const {
    current,
    freeLimit,
    vipLimit,
    variant: externalVariant = "vip",
    isLoading = false,
  }: {
    current: number;
    freeLimit: number;
    vipLimit: number;
    variant?: "vip" | "free";
    isLoading?: boolean;
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

<div class="trakt-usage-bar" data-variant={variant}>
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
  }
</style>
