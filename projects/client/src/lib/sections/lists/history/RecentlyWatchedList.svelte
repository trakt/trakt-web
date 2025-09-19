<script lang="ts">
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import MediaList from "../drilldown/MediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  type RecentlyWatchedListProps = {
    title: string;
    drilldownLabel: string;
    slug: string;
  };

  const { title, drilldownLabel, slug }: RecentlyWatchedListProps = $props();

  // FIXME: add drill down support for other users
  const isCurrentUser = $derived(slug === "me");

  const commonProps = $derived({
    title,
    id: `recently-watched-list-${slug}`,
    type: "episode" as const,
    useList: ({ limit, page }: { limit: number; page: number }) =>
      useRecentlyWatchedList({
        type: "all",
        limit,
        page,
        slug,
      }),
  });
</script>

{#if isCurrentUser}
  <DrillableMediaList
    {...commonProps}
    {drilldownLabel}
    source={{ id: "recently-watched" }}
    urlBuilder={UrlBuilder.history.all}
  >
    {#snippet item(media)}
      <RecentlyWatchedItem {media} isActionable />
    {/snippet}
  </DrillableMediaList>
{:else}
  <MediaList {...commonProps}>
    {#snippet item(media)}
      <RecentlyWatchedItem {media} />
    {/snippet}
  </MediaList>
{/if}
