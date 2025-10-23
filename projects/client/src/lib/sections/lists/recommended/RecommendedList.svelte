<script lang="ts">
  import { page } from "$app/state";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { extractWatchWindowParam } from "./extractWatchWindowParam";
  import RecommendedListItem from "./RecommendedListItem.svelte";
  import { useRecommendedList } from "./useRecommendedList";

  type RecommendationListProps = {
    title: string;
    drilldownLabel: string;
    type: DiscoverMode;
  };

  const { title, drilldownLabel, type }: RecommendationListProps = $props();
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  id="recommended-list-{type}"
  source={{ id: "recommended", type }}
  {title}
  {drilldownLabel}
  {type}
  filter={{
    ...$filterMap,
    ...extractWatchWindowParam(page.url.searchParams),
  }}
  useList={useRecommendedList}
  urlBuilder={UrlBuilder.recommended}
>
  {#snippet item(media)}
    <RecommendedListItem
      type={media.type}
      {media}
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrillableMediaList>
