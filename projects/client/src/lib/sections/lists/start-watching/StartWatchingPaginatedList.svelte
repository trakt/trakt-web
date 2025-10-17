<script>
  import { useDiscover } from "$lib/features/discover/useDiscover";

  import DrilledMediaList from "$lib/sections/lists/drilldown/DrilledMediaList.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import WatchlistItem from "../watchlist/WatchlistItem.svelte";
  import { useStartWatchingList } from "./_internal/useStartWatchingList";

  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const style = $derived($isMobile ? "summary" : "cover");
  const { mode } = useDiscover();
</script>

<DrilledMediaList
  id="view-all-up-next"
  type={$mode}
  useList={useStartWatchingList}
  title="Start Watching"
>
  {#snippet item(media)}
    <WatchlistItem type={media.type} {media} {style} />
  {/snippet}
</DrilledMediaList>
