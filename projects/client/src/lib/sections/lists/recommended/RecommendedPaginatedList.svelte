<script lang="ts">
  import { page } from "$app/state";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useRecommendationMode } from "$lib/features/recommendations/useRecommendationMode";
  import type { Snippet } from "svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { extractWatchWindowParam } from "./extractWatchWindowParam";
  import RecommendedListItem from "./RecommendedListItem.svelte";
  import { toModeFilter } from "./toModeFilter";
  import { useRecommendedList } from "./useRecommendedList";

  type RecommendedListProps = {
    title?: string;
    type: DiscoverMode;
    actions?: Snippet;
  };

  const { title, type, actions }: RecommendedListProps = $props();
  const { filterMap } = useFilter();
  const { requestMode } = useRecommendationMode();
</script>

<DrilledMediaList
  id="view-all-recommended-{type}"
  {title}
  {type}
  filter={{
    ...$filterMap,
    ...extractWatchWindowParam(page.url.searchParams),
    ...toModeFilter($requestMode),
  }}
  useList={(params) => useRecommendedList(params)}
  {actions}
>
  {#snippet item(media)}
    <RecommendedListItem
      type={media.type}
      {media}
      style="summary"
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrilledMediaList>
