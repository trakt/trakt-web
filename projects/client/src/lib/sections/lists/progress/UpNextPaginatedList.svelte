<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import DrilledMediaList from "$lib/sections/lists/drilldown/DrilledMediaList.svelte";
  import type { UpNextSortProps } from "$lib/sections/lists/progress/UpNextSortProps";
  import { useUpNextList } from "$lib/sections/lists/progress/useUpNextList";
  import { useStablePaginated } from "$lib/sections/lists/stores/useStablePaginated";
  import DropNotePromptProvider from "$lib/sections/media-actions/drop/DropNotePromptProvider.svelte";
  import ContinueWatchingItem from "./_internal/ContinueWatchingItem.svelte";

  const { sortBy, sortHow }: UpNextSortProps = $props();

  const { mode } = useDiscover();
  const { filterMap } = useFilter();
</script>

<DropNotePromptProvider>
  <DrilledMediaList
    id={`view-all-up-next-${$mode}`}
    type={$mode}
    cardOrientation="landscape"
    filter={$filterMap}
    useList={(listParams) =>
      useStablePaginated({
        ...listParams,
        useList: (params) => useUpNextList({ ...params, sortBy, sortHow }),
        compareFn: (l, r) => {
          const isComparingEpisodes = "show" in l && "show" in r;
          return isComparingEpisodes ? l.show.id === r.show.id : l.id === r.id;
        },
      })}
  >
    {#snippet item(progressEntry)}
      <ContinueWatchingItem style="summary" entry={progressEntry} />
    {/snippet}
  </DrilledMediaList>
</DropNotePromptProvider>
