<script lang="ts">
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import { movieIntlQuery } from "$lib/requests/queries/movies/movieIntlQuery.ts";
  import { moviePeopleQuery } from "$lib/requests/queries/movies/moviePeopleQuery.ts";
  import { movieSummaryQuery } from "$lib/requests/queries/movies/movieSummaryQuery.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { showIntlQuery } from "$lib/requests/queries/shows/showIntlQuery.ts";
  import { showPeopleQuery } from "$lib/requests/queries/shows/showPeopleQuery.ts";
  import { showSummaryQuery } from "$lib/requests/queries/shows/showSummaryQuery.ts";
  import type { MediaGlanceTarget } from "../MediaGlanceTarget.ts";
  import MediaGlanceDetails from "./MediaGlanceDetails.svelte";
  import MediaGlanceLoader from "./MediaGlanceLoader.svelte";
  import type { MediaGlanceQueries } from "./useMediaGlance.ts";

  const { type, slug }: MediaGlanceTarget = $props();

  const movieQueries: MediaGlanceQueries<MovieEntry> = {
    type: "movie",
    summary: movieSummaryQuery,
    people: moviePeopleQuery,
    intl: movieIntlQuery,
  };

  const showQueries: MediaGlanceQueries<ShowEntry> = {
    type: "show",
    summary: showSummaryQuery,
    people: showPeopleQuery,
    intl: showIntlQuery,
  };
</script>

{#if type === "show"}
  <MediaGlanceLoader {slug} queries={showQueries}>
    {#snippet details(media, crew, intl)}
      <MediaGlanceDetails type="show" {media} {crew} {intl} />
    {/snippet}
  </MediaGlanceLoader>
{:else}
  <MediaGlanceLoader {slug} queries={movieQueries}>
    {#snippet details(media, crew, intl)}
      <MediaGlanceDetails type="movie" {media} {crew} {intl} />
    {/snippet}
  </MediaGlanceLoader>
{/if}
