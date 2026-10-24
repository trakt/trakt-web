<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RealityCheck } from "$lib/requests/models/RealityCheck.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import SentimentSummary from "./SentimentSummary.svelte";

  type SentimentCardProps = {
    sentiment: SentimentAnalysis | Nil;
    realityCheck: RealityCheck | null | undefined;
  };

  const { sentiment, realityCheck }: SentimentCardProps = $props();

  const isLoading = $derived(
    sentiment === undefined || realityCheck === undefined,
  );

  const { buildDrawerLink } = summaryDrawerNavigation();

  const { track } = useTrack(AnalyticsEvent.Drilldown);

  const source = $derived(sentiment ? "sentiment" : "reality-check");
</script>

{#snippet card()}
  <Card
    --width-card="var(--width-sentiment-card)"
    --height-card="var(--height-sentiment-card)"
    variant="transparent"
  >
    <div class="trakt-sentiment-container">
      <SentimentSummary {sentiment} {realityCheck} />
    </div>
  </Card>
{/snippet}

<div class="trakt-sentiment-card">
  {#if isLoading}
    {@render card()}
  {:else}
    <Link
      {...buildDrawerLink(SummaryDrawers.Sentiment)}
      label={sentiment
        ? m.button_label_view_sentiment_analysis()
        : m.button_label_view_reality_check()}
      color="inherit"
      onclick={() => track({ source })}
    >
      {@render card()}
    </Link>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-sentiment-card {
    :global(.trakt-link) {
      text-decoration: none;
    }

    @include for-mobile() {
      --width-override-card: calc(100dvw - 2 * var(--layout-distance-side));
    }
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
