<script lang="ts">
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import PopularListItem from "./PopularListItem.svelte";
  import { usePopularList } from "./usePopularList";

  type PopularListProps = {
    title: string;
    type: MediaType;
  };

  const { title, type }: PopularListProps = $props();
  const { filterMap } = useFilter();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-popular-${type}"
  {title}
  {type}
  filter={$filterMap}
  useList={usePopularList}
>
  {#snippet item(media)}
    <PopularListItem {type} {media} {style} />
  {/snippet}
</DrilledMediaList>
