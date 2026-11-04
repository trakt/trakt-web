<script lang="ts">
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import type { SentimentCardProps } from "./SentimentCardProps.ts";
  import Card from "$lib/components/card/Card.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import MatchAvatar from "./MatchAvatar.svelte";
  import MatchRing from "./MatchRing.svelte";
  import MatchRingSkeleton from "./MatchRingSkeleton.svelte";
  import SentimentSummary from "./SentimentSummary.svelte";
  import { useMatch } from "../useMatch.ts";

  const { sentiment, realityCheck, type, id }: SentimentCardProps = $props();

  const isLoading = $derived(
    sentiment === undefined || realityCheck === undefined,
  );

  const {
    match,
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
  <Card
    --width-card={isMatchOnly
      ? "var(--width-match-card)"
      : "var(--width-sentiment-card)"}
    --height-card="var(--height-sentiment-card)"
    variant="transparent"
  >
    <div class="trakt-sentiment-container">
      {#if isMatchOnly}
        <div class="trakt-match-only">
          {#if ring === "loading"}
            <MatchRingSkeleton size="drawer" />
            <Skeleton width="80%" height="var(--ni-18)" />
          {:else}
            <MatchRing {score} size="drawer">
              {#snippet badge()}
                <MatchAvatar />
              {/snippet}
            </MatchRing>
            <p class="bold">
              {score === null
                ? m.text_match_not_enough_data()
                : m.text_match_better_than({ percent: score })}
            </p>
          {/if}
          {#if score !== null}
            <span class="trakt-match-only-arrow"><ArrowRightIcon /></span>
          {/if}
        </div>
      {:else}
        <SentimentSummary
          {sentiment}
          {realityCheck}
          {hasRing}
        />
      {/if}
      {#if hasRing && !isMatchOnly}
        <div class="trakt-sentiment-match">
          {#if ring === "loading"}
            <MatchRingSkeleton />
          {:else}
            <MatchRing {score}>
              {#snippet badge()}
                <MatchAvatar />
              {/snippet}
            </MatchRing>
          {/if}
        </div>
      {/if}
    </div>
  </Card>
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
    --width-match-card: var(--ni-240);

    :global(.trakt-link) {
      text-decoration: none;
    }

    @include for-mobile() {
      --width-override-card: calc(100dvw - 2 * var(--layout-distance-side));
    }
  }

  .trakt-match-only {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--gap-s);
    width: 100%;

    p {
      font-size: var(--font-size-text);
    }
  }

  .trakt-match-only-arrow {
    display: flex;
    align-self: flex-end;
  }

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
