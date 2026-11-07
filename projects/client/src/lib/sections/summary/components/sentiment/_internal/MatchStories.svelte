<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery";
  import type { MatchTaste } from "$lib/requests/models/MatchTaste.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import { recommendationReasonsQuery } from "$lib/requests/queries/recommendations/recommendationReasonsQuery.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import InsightsStory from "./InsightsStory.svelte";
  import InsightsStorySkeleton from "./InsightsStorySkeleton.svelte";
  import StoryPoster from "./StoryPoster.svelte";
  import { filter, map } from "rxjs";

  const MAX_POSTERS = 4;
  const LIKED_FROM = 0.7;
  const LOVED_FROM = 0.8;
  const MIN_VOTES = 500;

  const {
    taste,
    media,
    hasSources,
  }: {
    taste: MatchTaste[];
    media: MediaEntry;
    hasSources: boolean;
  } = $props();

  const target$ = fromRune(() => ({
    type: media.type,
    id: media.id,
    hasSources,
  }));
  const reasons = useQuery(
    target$.pipe(
      filter((target) => target.hasSources),
      map(({ type, id }) => recommendationReasonsQuery({ type, id })),
    ),
  );

  const sources = $derived(
    hasSources ? ($reasons?.data?.sources ?? []).slice(0, MAX_POSTERS) : [],
  );
  const likedTitles = $derived(
    new Intl.ListFormat(getLocale(), { type: "conjunction" }).format(
      sources.map(({ media }) => media.title),
    ),
  );

  const rating = $derived.by(() => {
    const { rating, votes } = media;
    if (rating == null || votes < MIN_VOTES || rating < LIKED_FROM) {
      return null;
    }
    return {
      percent: toPercentage(rating, getLocale()),
      votes: votes.toLocaleString(getLocale()),
      isLoved: rating >= LOVED_FROM,
    };
  });

  const isSourcesLoading = $derived(hasSources && ($reasons?.isLoading ?? true));
  const hasStories = $derived(
    isSourcesLoading ||
      sources.length > 0 ||
      taste.length > 0 ||
      rating !== null,
  );
</script>

{#if hasStories}
  <section class="trakt-match-stories">
    <p class="bold">{m.header_match_why()}</p>

    {#if isSourcesLoading}
      <InsightsStorySkeleton count={1} />
    {:else if sources.length > 0}
      <InsightsStory title={m.text_match_because_liked()} detail={likedTitles}>
        {#snippet art()}
          {#each sources as source (source.id)}
            <StoryPoster
              src={source.media.poster.url.thumb}
              title={source.media.title}
              stars={source.stars}
            />
          {/each}
        {/snippet}
      </InsightsStory>
    {/if}

    {#if taste.length > 0}
      <InsightsStory
        title={m.text_insights_taste()}
        detail={taste.map(({ label }) => label).join(" · ")}
      >
        {#snippet art()}
          <span class="trakt-insights-badge" aria-hidden="true">♥</span>
        {/snippet}
      </InsightsStory>
    {/if}

    {#if rating}
      <InsightsStory
        title={rating.isLoved ? m.text_match_rating_loved() : m.text_match_rating_liked()}
        detail={m.text_match_rating_votes({ count: rating.votes })}
      >
        {#snippet art()}
          <span class="trakt-insights-badge">{rating.percent}</span>
        {/snippet}
      </InsightsStory>
    {/if}
  </section>
{/if}

<style>
  .trakt-match-stories {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
