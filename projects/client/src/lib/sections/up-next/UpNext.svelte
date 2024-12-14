<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UpNextEntry } from "$lib/requests/queries/sync/upNextQuery";
  import { onMount } from "svelte";
  import NextEpisodeItem from "./NextEpisodeItem.svelte";
  import { useStableArray } from "./stores/useStableArray";
  import { useUpNextEpisodes } from "./useUpNextEpisodes";

  const { list: unstable } = useUpNextEpisodes();
  const { list, set } = useStableArray<UpNextEntry>(
    (l, r) => l.show.id === r.show.id,
  );

  onMount(() => {
    const unsubscribe = unstable.subscribe(set);

    return () => unsubscribe();
  });
</script>

<SectionList
  items={$list}
  title={m.up_next_title()}
  --height-section-list="var(--height-episode-list)"
>
  {#snippet item(episode)}
    <NextEpisodeItem {episode} show={episode.show} />
  {/snippet}
</SectionList>
