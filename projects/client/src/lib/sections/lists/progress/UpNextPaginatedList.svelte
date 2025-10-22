<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { type MediaType } from "$lib/requests/models/MediaType";
  import DrilledMediaList from "$lib/sections/lists/drilldown/DrilledMediaList.svelte";
  import UpNextItem from "$lib/sections/lists/progress/UpNextItem.svelte";
  import { useHiddenShows } from "$lib/sections/lists/progress/useHiddenShows";
  import { useUpNextList } from "$lib/sections/lists/progress/useUpNextList";
  import { useStablePaginated } from "$lib/sections/lists/stores/useStablePaginated";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  const { list: hidden } = $derived(useHiddenShows());

  const { intent }: { intent: "continue" | "start" } = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const style = $derived($isMobile ? "summary" : "cover");
  const { mode } = useDiscover();
</script>

{#snippet content(type: MediaType, upNextIntent: "all" | "continue" | "start")}
  <DrilledMediaList
    id={`view-all-up-next-${type}-${upNextIntent}`}
    {type}
    cardOrientation="landscape"
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
    {#snippet item(mediaItem)}
      {#if "show" in mediaItem}
        <UpNextItem
          episode={mediaItem}
          {style}
          show={mediaItem.show}
          status={$hidden.includes(mediaItem.show.id) ? "hidden" : "watching"}
        />
      {:else}
        <UpNextItem movie={mediaItem} {style} />
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
