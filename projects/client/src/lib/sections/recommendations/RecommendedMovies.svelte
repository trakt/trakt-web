<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { recommendedMoviesQuery } from "$lib/requests/queries/recommendations/recommendedMoviesQuery";
  import { addToWatchlistRequest } from "$lib/requests/sync/addToWatchlistRequest";
  import RecommendationList from "$lib/sections/recommendations/RecommendationList.svelte";
</script>

<RecommendationList
  queryOptions={() => recommendedMoviesQuery()}
  title={m.recommended_movies()}
  onAddToWatchlist={(id) =>
    addToWatchlistRequest({
      body: {
        movies: [{ ids: { trakt: id } }],
      },
    })}
/>
