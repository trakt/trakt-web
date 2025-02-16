<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import WatchlistList from "./WatchlistList.svelte";
</script>

<WatchlistList
  title={m.out_now_title()}
  drilldownLabel={m.view_all_movies_out_now()}
  type="movie"
  status="out-now"
/>
