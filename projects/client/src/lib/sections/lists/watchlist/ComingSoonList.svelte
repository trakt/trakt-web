<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import WatchList from "./WatchList.svelte";
</script>

<WatchList
  title={m.coming_soon_title()}
  drilldownLabel={m.view_all_movies_coming_soon()}
  type="movie"
  status="coming-soon"
/>
