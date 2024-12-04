<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UpNextEntry } from "$lib/requests/queries/sync/upNextQuery";
  import { onDestroy } from "svelte";
  import NextEpisodeItem from "./NextEpisodeItem.svelte";
  import { useStableArray } from "./stores/useStableArray";
  import { useUpNextEpisodes } from "./useUpNextEpisodes";

  const { list: unstable } = useUpNextEpisodes();
  const { list, set } = useStableArray<UpNextEntry>(
    (l, r) => l.show.id === r.show.id,
  );

  const unsubscribe = unstable.subscribe(set);
  onDestroy(() => unsubscribe());
</script>

<SectionList
  title={m.up_next_title()}
  --height-section-list="var(--height-episode-list)"
>
  {#each $list as episode (episode.show.id)}
    <NextEpisodeItem {episode} show={episode.show} />
  {/each}
</SectionList>
