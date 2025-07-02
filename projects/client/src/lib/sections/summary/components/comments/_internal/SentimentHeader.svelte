<script lang="ts">
  import CircularLogo from "$lib/components/icons/CircularLogo.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { SimpleRating } from "$lib/models/SimpleRating";
  import type { Sentiments } from "$lib/requests/models/Sentiments";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage";

  const { comment }: { comment: Sentiments } = $props();

  const sentimentCount = $derived(comment.good.length + comment.bad.length);
  const goodFactor = $derived(
    sentimentCount > 0 ? comment.good.length / sentimentCount : 0,
  );
  const badFactor = $derived(1.0 - goodFactor);
</script>

<div class="trakt-sentiment-header">
  <CircularLogo variant="gradient" />
  <div class="trakt-sentiment-details">
    <p>{m.header_community_sentiment()}</p>
    <div class="trakt-sentiment-distribution">
      <p class="meta-info sentiment-good">
        {toPercentage(goodFactor, languageTag())}
      </p>
      <p class="meta-info">/</p>
      <p data-rating={SimpleRating.Bad} class="meta-info sentiment-bad">
        {toPercentage(badFactor, languageTag())}
      </p>
    </div>
  </div>
</div>

<style>
  .trakt-sentiment-header {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    height: var(--ni-32);

    position: relative;
  }

  .trakt-sentiment-distribution {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);
  }

  .sentiment-good {
    color: var(--color-text-sentiment-good);
  }

  .sentiment-bad {
    color: var(--color-text-sentiment-bad);
  }
</style>
