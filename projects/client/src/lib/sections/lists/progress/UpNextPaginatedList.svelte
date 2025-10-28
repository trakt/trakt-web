<script lang="ts">
  import { type DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
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

{#snippet content(
  type: DiscoverMode,
  upNextIntent: "all" | "continue" | "start",
)}
  <DrilledMediaList
    id={`view-all-up-next-${type}-${upNextIntent}`}
    {type}
    cardOrientation={intent === "start" ? "portrait" : "landscape"}
    useList={(params) =>
      useStablePaginated({
        ...params,
        useList: (params) =>
          useUpNextList({
            limit: params.limit,
            page: params.page,
            type,
            intent: upNextIntent,
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
      {#if upNextIntent === "start"}
        <StartWatchingItem {style} entry={progressEntry} />
      {:else}
        <ContinueWatchingItem {style} entry={progressEntry} />
      {/if}
    {/snippet}
  </DrilledMediaList>
{/snippet}

<RenderForFeature flag={FeatureFlag.Discover}>
  {#snippet enabled()}
    {@render content($mode, intent)}
  {/snippet}

  {@render content("show", "all")}
</RenderForFeature>
