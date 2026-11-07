<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { MatchKind } from "$lib/requests/models/MatchKind.ts";
  import type { RealityCheck } from "$lib/requests/models/RealityCheck.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import InsightsSummary from "./InsightsSummary.svelte";
  import MatchRingSlot from "./MatchRingSlot.svelte";

  const {
    sentiment,
    realityCheck,
    hasRing,
    hasDrawer,
    score,
    kind,
    isMatchLoading,
  }: {
    sentiment: SentimentAnalysis | Nil;
    realityCheck: RealityCheck | null | undefined;
    hasRing: boolean;
    hasDrawer: boolean;
    score: number | null;
    kind: MatchKind;
    isMatchLoading: boolean;
  } = $props();
</script>

<Card
  --width-card="var(--width-sentiment-card)"
  --height-card="var(--height-sentiment-card)"
  variant="transparent"
>
  <div class="trakt-sentiment-container">
    <InsightsSummary
      {sentiment}
      {realityCheck}
      {hasRing}
      {hasDrawer}
      match={isMatchLoading ? undefined : score}
      {kind}
    />
    {#if hasRing}
      <div class="trakt-sentiment-match">
        <MatchRingSlot {score} {kind} isLoading={isMatchLoading} />
      </div>
    {/if}
  </div>
</Card>

<style>
  .trakt-sentiment-match {
    position: absolute;
    top: var(--ni-10);
    inset-inline-end: var(--ni-10);
  }

  .trakt-sentiment-container {
    box-shadow: var(--shadow-base);

    height: 100%;
    width: 100%;

    position: relative;
    display: flex;

    padding: var(--ni-16);
    box-sizing: border-box;

    border-radius: var(--border-radius-m);
    background: var(--background-vip-drawer);
  }
</style>
