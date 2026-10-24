<script lang="ts">
  import SegmentMeter from "$lib/components/meter/SegmentMeter.svelte";
  import type { RealityTier } from "$lib/requests/models/RealityTier.ts";
  import { toTranslatedRealityTier } from "$lib/utils/formatting/string/toTranslatedRealityTier.ts";
  import {
    REALITY_SEGMENT_COUNT,
    toRealitySegments,
  } from "$lib/utils/reality/toRealitySegments.ts";

  type RealityTierPillProps = {
    tier: RealityTier;
    variant?: "card" | "compact";
  };

  const { tier, variant = "card" }: RealityTierPillProps = $props();
</script>

<span class="trakt-reality-tier-pill" data-variant={variant} data-tier={tier}>
  <SegmentMeter
    filled={toRealitySegments(tier)}
    total={REALITY_SEGMENT_COUNT}
  />
  <span class="bold ellipsis" class:uppercase={variant === "compact"}>
    {toTranslatedRealityTier(tier)}
  </span>
</span>

<style lang="scss">
  .trakt-reality-tier-pill {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: var(--gap-xs);

    box-sizing: border-box;
    height: var(--ni-24);
    max-width: 100%;
    white-space: nowrap;

    color: var(--color-text-emphasis);
    background: color-mix(in srgb, var(--color-text-emphasis) 14%, transparent);
    border-radius: var(--border-radius-xxl);

    span {
      color: inherit;
    }

    &[data-variant="card"] {
      padding: 0 var(--ni-10);

      span.bold {
        font-size: var(--font-size-text-small);
      }
    }

    &[data-variant="compact"] {
      padding: 0 var(--ni-10);

      span.bold {
        font-size: var(--font-size-tag);
      }
    }
  }
</style>
