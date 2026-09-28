<script lang="ts">
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import type { TodayForYouItem } from "../models/TodayForYouItem.ts";

  const { item }: { item: TodayForYouItem } = $props();
</script>

{#if item.type === "up-next"}
  <MarkAsWatchedAction
    style="action"
    type="episode"
    title={item.entry.show.title}
    show={item.entry.show}
    media={item.entry}
  />
{:else}
  <MarkAsWatchedAction
    style="action"
    type={item.media.type}
    title={item.media.title}
    media={item.media}
  />
{/if}
