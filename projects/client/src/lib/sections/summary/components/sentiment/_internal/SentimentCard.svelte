<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import {
    Drawers,
    summaryDrawerNavigation,
  } from "../../../_internal/summaryDrawerNavigation.ts";
  import SentimentAspects from "./SentimentAspects.svelte";

  const {
    sentiment,
    isPartial,
  }: { sentiment: SentimentAnalysis; isPartial: boolean } = $props();

  const heightCard = $derived(
    isPartial
      ? "calc(0.5 * var(--height-sentiment-card))"
      : "var(--height-sentiment-card)",
  );

  const { buildDrawerLink } = summaryDrawerNavigation();
</script>

<div class="trakt-sentiment-card">
  <Link href={buildDrawerLink(Drawers.Sentiment)} noscroll color="inherit">
    <Card
      --width-card="var(--width-sentiment-card)"
      --height-card={heightCard}
      variant="transparent"
    >
      <div class="trakt-sentiment-container">
        <SentimentAspects
          pros={sentiment.aspect.pros}
          cons={sentiment.aspect.cons}
        />
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
    height: 100%;
    width: 100%;

    position: relative;
    display: flex;
  }
</style>
