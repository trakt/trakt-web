<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import PosterCard from "$lib/components/poster/card/PosterCard.svelte";
  import PosterCover from "$lib/components/poster/card/PosterCover.svelte";
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import {
    recommendMovies,
    type RecommendedMovie,
  } from "$lib/requests/recommendations/recommendMovies";
  import { toHumanDuration } from "$lib/utils/date/toHumanDuration";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const recommendations = writable<RecommendedMovie[]>([]);

  onMount(async () => {
    const movies = await recommendMovies();
    recommendations.set(movies);
  });
</script>

<SectionList title={m.recommended_movies()} --height-section-list="19rem">
  {#each $recommendations as movie (movie.id)}
    <PosterCard>
      <PosterCover src={movie.poster.url} alt={`${movie.title} poster`} />

      <CardFooter>
        <p class="movie-runtime ellipsis">
          {toHumanDuration({ minutes: movie.runtime }, languageTag())}
        </p>
      </CardFooter>
    </PosterCard>
  {/each}
</SectionList>

<style>
  .movie-runtime {
    margin: 0;
    padding: 0;

    color: var(--color-text-secondary);

    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
</style>
