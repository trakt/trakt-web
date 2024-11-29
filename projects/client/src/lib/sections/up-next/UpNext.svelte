<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpNextItem from "./UpNextItem.svelte";
  import { useUpNextEpisodes } from "./useUpNextEpisodes";

  const { list, reload } = useUpNextEpisodes();
</script>

<SectionList
  title={m.up_next_title()}
  --height-section-list="var(--height-episode-list)"
>
  {#each $list as episode (episode.show.id)}
    <UpNextItem {episode} onMarkAsWatched={reload} />
  {/each}
</SectionList>
