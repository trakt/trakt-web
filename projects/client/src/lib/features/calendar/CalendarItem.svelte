<script lang="ts">
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import CalendarMediaCard from "./CalendarMediaCard.svelte";
  import type { CalendarItem } from "./models/CalendarEntry";

  const { item }: { item: CalendarItem } = $props();
</script>

{#if "show" in item}
  <EpisodeItem
    episode={item}
    media={item.show}
    variant="upcoming"
    source="calendar"
  />
{/if}

{#if item.type === "movie"}
  <CalendarMediaCard media={item} type={item.type} />
{/if}
