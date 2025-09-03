<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import WatchList from "./WatchList.svelte";
</script>

<WatchList
  drilldownLabel={m.button_label_view_all_unreleased_movies()}
  type="movie"
  status="unreleased"
/>
