<script lang="ts">
  import { movieIntlQuery } from "$lib/requests/queries/movies/movieIntlQuery.ts";
  import { moviePeopleQuery } from "$lib/requests/queries/movies/moviePeopleQuery.ts";
  import { movieSummaryQuery } from "$lib/requests/queries/movies/movieSummaryQuery.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import MediaGlanceDetails from "./MediaGlanceDetails.svelte";
  import MediaGlanceSkeleton from "./MediaGlanceSkeleton.svelte";
  import { useMediaGlance } from "./useMediaGlance.ts";

  const { slug }: { slug: string } = $props();

  const { media, crew, intl, isLoading } = useMediaGlance(
    fromRune(() => slug),
    {
      type: "movie",
      summary: movieSummaryQuery,
      people: moviePeopleQuery,
      intl: movieIntlQuery,
    },
  );
</script>

{#if $isLoading || !$media}
  <MediaGlanceSkeleton />
{:else}
  <MediaGlanceDetails type="movie" media={$media} crew={$crew} intl={$intl} />
{/if}
