<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import MediaCard from "../components/MediaCard.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import EmptyWatchlist from "./EmptyWatchlist.svelte";
  import { statusToStore } from "./statusToStore";

  type WatchListProps = {
    title: string;
    type: MediaType;
    drilldownLabel: string;
    empty?: Snippet;
    status: "all" | "released" | "unreleased";
  };

  const { title, type, status, drilldownLabel }: WatchListProps = $props();

  const useList = $derived.by(() => statusToStore(status));
</script>

<DrillableMediaList
  id="watch-list-{type}"
  {title}
  {drilldownLabel}
  {type}
  {useList}
  urlBuilder={(params) =>
    `${UrlBuilder.watchlistPage(params)}?status=${status}`}
>
  {#snippet item(media)}
    {#if status === "released"}
      <MediaCard type={media.type} {media}>
        {#snippet action()}
          <RenderFor audience="authenticated">
            <MarkAsWatchedAction
              style="action"
              size="small"
              title={media.title}
              type={media.type}
              {media}
            />
          </RenderFor>
        {/snippet}
      </MediaCard>
    {:else}
      <MediaCard {type} {media} />
    {/if}
  {/snippet}

  {#snippet empty()}
    <EmptyWatchlist {type} {status} />
  {/snippet}
</DrillableMediaList>
