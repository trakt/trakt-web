<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import WatchList from "./WatchList.svelte";
</script>

<WatchList
  title={m.unreleased_movies_title()}
  drilldownLabel={m.view_all_unreleased_movies()}
  type="movie"
  status="unreleased"
/>
