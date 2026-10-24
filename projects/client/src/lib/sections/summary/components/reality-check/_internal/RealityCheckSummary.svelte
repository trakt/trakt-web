<script lang="ts">
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import SegmentMeter from "$lib/components/meter/SegmentMeter.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RealityCheck } from "$lib/requests/models/RealityCheck.ts";
  import { toTranslatedRealityTier } from "$lib/utils/formatting/string/toTranslatedRealityTier.ts";
  import { toRealitySegments } from "$lib/utils/reality/toRealitySegments.ts";
  import InfoCard from "../../_internal/InfoCard.svelte";
  import { hasUnclearTier } from "./hasUnclearTier.ts";
  import RealityCheckRows from "./RealityCheckRows.svelte";

  const { realityCheck }: { realityCheck: RealityCheck } = $props();
</script>

<div class="trakt-reality-check-summary">
  <div class="reality-hero">
    <h2 class="reality-verdict">
      {toTranslatedRealityTier(realityCheck.verdict)}
    </h2>
    <p class="small secondary">{m.text_reality_check_basis()}</p>
    <SegmentMeter
      size="large"
      filled={toRealitySegments(realityCheck.verdict)}
    />
    {#if hasUnclearTier(realityCheck)}
      <p class="small secondary">{m.text_reality_early_verdict()}</p>
    {/if}
  </div>

  <InfoCard>
    <RealityCheckRows {realityCheck} />
  </InfoCard>

  <p class="reality-summary"><InlineMarkdown text={realityCheck.summary} /></p>
</div>

<style lang="scss">
  .trakt-reality-check-summary {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    .reality-hero {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
    }

    .reality-summary {
      line-height: 1.6;
    }

    .reality-verdict {
      font-size: var(--ni-24);
    }
  }
</style>
