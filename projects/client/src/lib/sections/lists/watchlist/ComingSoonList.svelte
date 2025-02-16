<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import WatchlistList from "./WatchlistList.svelte";
</script>

<WatchlistList
  title={m.coming_soon_title()}
  drilldownLabel={m.view_all_movies_coming_soon()}
  type="movie"
  status="coming-soon"
/>
