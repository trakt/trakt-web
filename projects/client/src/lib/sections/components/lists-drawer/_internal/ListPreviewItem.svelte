<script lang="ts">
  import type { ListItem } from "$lib/requests/models/ListItem";
  import DefaultMediaItem from "$lib/sections/lists/components/DefaultMediaItem.svelte";
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import MediaSummaryCard from "$lib/sections/lists/components/MediaSummaryCard.svelte";

  const { item, source }: { item: ListItem; source: string } = $props();
</script>

{#if item.type === "season"}
  <MediaSummaryCard
    type="season"
    season={item.entry.season}
    media={item.entry.show}
    layout="compact"
    {source}
  />
{:else if item.type === "episode"}
  <EpisodeItem
    episode={item.entry.episode}
    media={item.entry.show}
    variant="list-item"
    style="compact"
    {source}
  />
{:else}
  <DefaultMediaItem
    type={item.type}
    media={item.entry}
    style="compact"
    mode="mixed"
    popupActions={null}
    {source}
  />
{/if}
