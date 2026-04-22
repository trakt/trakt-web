<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "../../../_internal/summaryDrawerNavigation.ts";
  import SentimentSummary from "./SentimentSummary.svelte";

  const { sentiment }: { sentiment: SentimentAnalysis } = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();

  const pros = $derived(sentiment.aspect.pros);
  const cons = $derived(sentiment.aspect.cons);

  const { track } = useTrack(AnalyticsEvent.Drilldown);
</script>

<div class="trakt-sentiment-card">
  <Link
    {...buildDrawerLink(SummaryDrawers.Sentiment)}
    label={m.button_label_view_sentiment_analysis()}
    color="inherit"
    onclick={() => track({ source: "sentiment" })}
  >
    <Card
      --width-card="var(--width-sentiment-card)"
      --height-card="var(--height-sentiment-card)"
      variant="transparent"
    >
      <div class="trakt-sentiment-container">
        <SentimentSummary {pros} {cons} />
      </div>
    </Card>
  </Link>
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
