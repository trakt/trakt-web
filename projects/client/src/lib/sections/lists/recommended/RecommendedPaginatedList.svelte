<script lang="ts">
  import { page } from "$app/state";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useRecommendedMode } from "$lib/features/recommendations/useRecommendedMode";
  import type { Snippet } from "svelte";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { extractWatchWindowParam } from "./extractWatchWindowParam";
  import RecommendedListItem from "./RecommendedListItem.svelte";
  import { useAnticipatedRecommendedList } from "./useAnticipatedRecommendedList";
  import { useRecommendedList } from "./useRecommendedList";

  type RecommendedListProps = {
    title?: string;
    type: DiscoverMode;
    actions?: Snippet;
  };

  const { title, type, actions }: RecommendedListProps = $props();
  const { filterMap } = useFilter();
  const { isAnticipated } = useRecommendedMode();
</script>

{#if $isAnticipated}
  <DrilledMediaList
    id="view-all-anticipated-recommended-{type}"
    {title}
    {type}
    filter={{
      ...$filterMap,
      ...extractWatchWindowParam(page.url.searchParams),
    }}
    useList={(params) => useAnticipatedRecommendedList(params)}
    {actions}
  >
    {#snippet item(media)}
      <DefaultMediaItem
        type={media.type}
        {media}
        style="summary"
        mode={type === "media" ? "mixed" : "standalone"}
        source="recommended"
        canDeemphasize
      />
    {/snippet}
  </DrilledMediaList>
{:else}
  <DrilledMediaList
    id="view-all-recommended-{type}"
    {title}
    {type}
    filter={{
      ...$filterMap,
      ...extractWatchWindowParam(page.url.searchParams),
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
{/if}
