<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import FindMoviesLink from "../components/FindMoviesLink.svelte";
  import FindShowsLink from "../components/FindShowsLink.svelte";
  import MediaCard from "../components/MediaCard.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { statusToStore } from "./statusToStore";

  type WatchListProps = {
    title: string;
    type: MediaType;
    drilldownLabel: string;
    empty?: Snippet;
    status: "all" | "out-now" | "coming-soon";
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
    {#if status === "out-now"}
      <MediaCard type={media.type} {media}>
        {#snippet action()}
          <RenderFor audience="authenticated">
            <MarkAsWatchedAction
              style="action"
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
    {#if type === "movie"}
      {#if status === "all"}
        <p class="small">{m.watchlist_movies_empty()}</p>
      {/if}

      {#if status === "out-now"}
        <p class="small">{m.out_now_empty()}</p>
      {/if}

      {#if status === "coming-soon"}
        <p class="small">{m.coming_soon_empty()}</p>
      {/if}

      <FindMoviesLink />
    {/if}

    {#if type === "show"}
      <p class="small">{m.watchlist_shows_empty()}</p>
      <FindShowsLink />
    {/if}
  {/snippet}
</DrillableMediaList>
