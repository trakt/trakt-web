<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { recommendationReasonsQuery } from "$lib/requests/queries/recommendations/recommendationReasonsQuery.ts";
  import RecommendationSourceItem from "$lib/sections/lists/recommended/RecommendationSourceItem.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { map } from "rxjs";

  type MatchReasonsProps = {
    type: MediaType;
    id: number;
  };

  const { type, id }: MatchReasonsProps = $props();

  const reasons = useQuery(
    fromRune(() => ({ type, id })).pipe(
      map((target) => recommendationReasonsQuery(target)),
    ),
  );
</script>

{#if $reasons.isLoading}
  <div class="trakt-match-reasons-loading">
    <LoadingIndicator size="large" />
  </div>
{:else if $reasons.data && $reasons.data.sources.length > 0}
  <section class="trakt-match-reasons">
    <p class="bold">{m.header_match_reasons()}</p>
    <div class="trakt-match-reasons-items">
      {#each $reasons.data.sources as source (source.id)}
        <RecommendationSourceItem {source} />
      {/each}
    </div>
  </section>
{/if}

<style>
  .trakt-match-reasons-loading {
    display: flex;
    justify-content: center;
    padding: var(--gap-xl) 0;
  }

  .trakt-match-reasons {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-match-reasons-items {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--gap-xs);
    container-type: inline-size;

    --width-override-card: calc((100cqi - 3 * var(--gap-xs)) / 4);
    --card-aspect-ratio: calc(
      var(--height-portrait-card-cover) / var(--width-portrait-card)
    );
    --height-override-card-cover: calc(
      var(--width-override-card) * var(--card-aspect-ratio)
    );
    --height-override-card: calc(
      var(--height-override-card-cover) + var(--gap-xxs)
    );
  }
</style>
