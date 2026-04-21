<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { Snippet } from "svelte";
  import DefaultMediaItem from "../../components/DefaultMediaItem.svelte";
  import StartWatchingItem from "./StartWatchingItem.svelte";

  const {
    intent = "default",
    style = "cover",
    type,
    media,
    mode,
    sortTag,
  }: {
    intent?: "default" | "start";
    style?: "cover" | "summary";
    type: MediaType;
    media: MediaEntry;
    mode?: DiscoverMode;
    sortTag?: Snippet;
  } = $props();
</script>

{#if intent === "start"}
  <StartWatchingItem entry={media} {style} {sortTag} />
{:else}
  <DefaultMediaItem
    mode={mode === "media" ? "mixed" : "standalone"}
    {type}
    {media}
    {style}
    {sortTag}
    source="watchlist"
  />
{/if}
