<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import PosterCard from "$lib/components/poster/card/PosterCard.svelte";
  import PosterCover from "$lib/components/poster/card/PosterCover.svelte";
  import DurationTag from "$lib/components/poster/tags/DurationTag.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { type RecommendedMovie } from "$lib/requests/recommendations/recommendMovies";
  import type { RecommendedShow } from "$lib/requests/recommendations/recommendShows";
  import { toHumanDuration } from "$lib/utils/date/toHumanDuration";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  type RecommendedMedia = Array<RecommendedMovie | RecommendedShow>;

  type RecommendationListProps = {
    title: string;
    dataSourceFactory: () => Promise<RecommendedMedia>;
  };

  const { dataSourceFactory, title }: RecommendationListProps = $props();

  const recommendations = writable<RecommendedMedia>([]);

  onMount(async () => {
    const entries = await dataSourceFactory();
    recommendations.set(entries);
  });
</script>

<SectionList {title} --height-section-list="19rem">
  {#each $recommendations as recommendation (recommendation.id)}
    <PosterCard>
      <PosterCover
        src={recommendation.poster.url}
        alt={`${recommendation.title} poster`}
      >
        {#snippet tags()}
          <DurationTag>
            {toHumanDuration(
              { minutes: recommendation.runtime },
              languageTag(),
            )}
          </DurationTag>
        {/snippet}
      </PosterCover>

      <CardFooter>
        <p class="recommendation-title ellipsis">{recommendation.title}</p>
      </CardFooter>
    </PosterCard>
  {/each}
</SectionList>

<style>
  .recommendation-title {
    margin: 0;
    padding: 0;

    color: var(--color-text-secondary);

    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
</style>
