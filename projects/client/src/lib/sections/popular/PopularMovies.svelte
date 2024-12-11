<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import PopularList from "./PopularList.svelte";
</script>

<PopularList title={m.most_popular()} type="movie" />
