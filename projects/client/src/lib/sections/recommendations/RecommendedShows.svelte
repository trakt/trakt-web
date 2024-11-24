<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { recommendedShowsQuery } from "$lib/requests/queries/recommendations/recommendedShowsQuery";
  import { addToWatchlistRequest } from "$lib/requests/sync/addToWatchlistRequest";
  import RecommendationList from "$lib/sections/recommendations/RecommendationList.svelte";
</script>

<RecommendationList
  queryOptions={() => recommendedShowsQuery()}
  title={m.recommended_shows()}
  onAddToWatchlist={(id) =>
    addToWatchlistRequest({
      body: {
        shows: [{ ids: { trakt: id } }],
      },
    })}
/>
