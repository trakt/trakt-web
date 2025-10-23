<script lang="ts">
  import { page } from "$app/state";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { extractWatchWindowParam } from "./extractWatchWindowParam";
  import RecommendedListItem from "./RecommendedListItem.svelte";
  import { useRecommendedList } from "./useRecommendedList";

  type RecommendedListProps = {
    title: string;
    type: DiscoverMode;
  };

  const { title, type }: RecommendedListProps = $props();
  const { filterMap } = useFilter();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<DrilledMediaList
  id="view-all-recommended-${type}"
  {title}
  {type}
  filter={{
    ...$filterMap,
    ...extractWatchWindowParam(page.url.searchParams),
  }}
  useList={useRecommendedList}
>
  {#snippet item(media)}
    <RecommendedListItem
      type={media.type}
      {media}
      {style}
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrilledMediaList>
