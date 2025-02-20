<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import WatchList from "./WatchList.svelte";
</script>

<WatchList
  title={m.released_movies_title()}
  drilldownLabel={m.view_all_released_movies()}
  type="movie"
  status="released"
/>
