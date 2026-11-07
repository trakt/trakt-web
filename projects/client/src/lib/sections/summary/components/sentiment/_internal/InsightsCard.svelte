<script lang="ts">
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import type { SentimentCardProps } from "./SentimentCardProps.ts";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import InsightsCardBody from "./InsightsCardBody.svelte";
  import { useMatch } from "../useMatch.ts";

  const { sentiment, realityCheck, type, id }: SentimentCardProps = $props();

  const isLoading = $derived(
    sentiment === undefined || realityCheck === undefined,
  );

  const {
    match,
    kind,
    basis,
    isLoading: isMatchLoading,
    isAvailable,
  } = useMatch(fromRune(() => ({ type, id })));
  const score = $derived(isLoading ? null : $match);
  const ring = $derived.by(() => {
    if (score !== null) return "score";
    if (!$isAvailable) return "none";
    return isLoading || $isMatchLoading ? "loading" : "empty";
  });
  const hasRing = $derived(ring !== "none");
  const isMatchOnly = $derived(
    hasRing && sentiment === null && realityCheck === null,
  );
  const hasDrawer = $derived(!isLoading && (!isMatchOnly || score !== null));

  const source = $derived.by(() => {
    if (isMatchOnly) return "match";
    return sentiment ? "sentiment" : "reality-check";
  });

  const { buildDrawerLink } = summaryDrawerNavigation();

  const { track } = useTrack(AnalyticsEvent.Drilldown);

</script>

{#snippet card()}
  <InsightsCardBody
    {sentiment}
    {realityCheck}
    {hasRing}
    {hasDrawer}
    {score}
    kind={$kind}
    basis={$basis}
    isMatchLoading={ring === "loading"}
  />
{/snippet}

<div class="trakt-sentiment-card">
  {#if !hasDrawer}
    {@render card()}
  {:else}
    <Link
      {...buildDrawerLink(SummaryDrawers.Sentiment)}
      label={isMatchOnly
        ? m.button_label_view_match()
        : sentiment
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
</style>
