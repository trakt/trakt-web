<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import WatchList from "./WatchList.svelte";
</script>

<WatchList
  title={m.list_title_coming_soon()}
  drilldownLabel={m.view_all_unreleased_movies()}
  type="movie"
  status="unreleased"
/>
