<script lang="ts">
  import type { ListItem } from "$lib/requests/models/ListItem";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DefaultMediaItem from "../../components/DefaultMediaItem.svelte";
  import EpisodeItem from "../../components/EpisodeItem.svelte";
  import SeasonItem from "../../components/SeasonItem.svelte";
  import PopupActions from "./PopupActions.svelte";

  const {
    listedItem,
    style,
    list,
  }: {
    listedItem: ListItem;
    style: "summary" | "cover";
    list: MediaListSummary;
  } = $props();

  const commonProps = $derived({
    style,
    source: "user-list",
  });
</script>

{#snippet popupActions()}
  <PopupActions {list} {listedItem} />
{/snippet}

{#if listedItem.type === "season"}
  <SeasonItem
    media={listedItem.entry.show}
    season={listedItem.entry.season}
    urlBuilder={() =>
      UrlBuilder.show(listedItem.entry.show.slug, {
        season: listedItem.entry.season.number,
      })}
    variant="list-item"
    {popupActions}
    {...commonProps}
  />
{:else if listedItem.type === "episode"}
  <EpisodeItem
    episode={listedItem.entry.episode}
    media={listedItem.entry.show}
    variant="list-item"
    {popupActions}
    {...commonProps}
  />
{:else}
  <DefaultMediaItem
    type={listedItem.type}
    media={listedItem.entry}
    canDeemphasize
    {popupActions}
    {...commonProps}
  />
{/if}
