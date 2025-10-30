<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import DrilledMediaList from "$lib/sections/lists/drilldown/DrilledMediaList.svelte";
  import { useUpNextList } from "$lib/sections/lists/progress/useUpNextList";
  import { useStablePaginated } from "$lib/sections/lists/stores/useStablePaginated";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import ContinueWatchingItem from "./_internal/ContinueWatchingItem.svelte";
  import StartWatchingItem from "./_internal/StartWatchingItem.svelte";

  const { intent }: { intent: "continue" | "start" } = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const style = $derived($isMobile ? "summary" : "cover");
  const { mode } = useDiscover();
</script>

<DrilledMediaList
  id={`view-all-up-next-${$mode}-${intent}`}
  type={$mode}
  cardOrientation={intent === "start" ? "portrait" : "landscape"}
  useList={(params) =>
    useStablePaginated({
      ...params,
      useList: (params) =>
        useUpNextList({
          limit: params.limit,
          page: params.page,
          type: $mode,
          intent,
        }),
      compareFn: (l, r) => {
        const isComparingEpisodes = "show" in l && "show" in r;
        return isComparingEpisodes ? l.show.id === r.show.id : l.id === r.id;
      },
    })}
  title={intent === "start"
    ? m.list_title_start_watching()
    : m.list_title_up_next()}
>
  {#snippet item(progressEntry)}
    {#if intent === "start"}
      <StartWatchingItem {style} entry={progressEntry} />
    {:else}
      <ContinueWatchingItem {style} entry={progressEntry} />
    {/if}
  {/snippet}
</DrilledMediaList>
