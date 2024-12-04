<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import NextEpisodeItem from "./NextEpisodeItem.svelte";
  import { useUpNextEpisodes } from "./useUpNextEpisodes";

  const { list } = useUpNextEpisodes();
</script>

<SectionList
  title={m.up_next_title()}
  --height-section-list="var(--height-episode-list)"
>
  {#each $list as episode (episode.show.id)}
    <NextEpisodeItem {episode} show={episode.show} />
  {/each}
</SectionList>
