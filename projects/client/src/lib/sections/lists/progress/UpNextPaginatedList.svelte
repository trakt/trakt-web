<script>
  import * as m from "$lib/features/i18n/messages.ts";

  import DrilledMediaList from "$lib/sections/lists/drilldown/DrilledMediaList.svelte";
  import UpNextItem from "$lib/sections/lists/progress/UpNextItem.svelte";
  import { useHiddenShows } from "$lib/sections/lists/progress/useHiddenShows";
  import { useUpNextList } from "$lib/sections/lists/progress/useUpNextList";
  import { useStablePaginated } from "$lib/sections/lists/stores/useStablePaginated";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";

  const { list: hidden } = $derived(useHiddenShows());

  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-up-next"
  type="episode"
  useList={(params) =>
    useStablePaginated({
      ...params,
      type: "episode",
      useList: (params) =>
        useUpNextList({ limit: params.limit, page: params.page }),
      compareFn: (l, r) => l.show.id === r.show.id,
    })}
  title={m.list_title_up_next()}
>
  {#snippet item(episode)}
    <UpNextItem
      {episode}
      {style}
      show={episode.show}
      status={$hidden.includes(episode.show.id) ? "hidden" : "watching"}
    />
  {/snippet}
</DrilledMediaList>
