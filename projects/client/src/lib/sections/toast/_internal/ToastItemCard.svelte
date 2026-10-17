<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { LastWatchedItem } from "$lib/features/toast/models/LastWatchedItem";
  import type { NowPlayingItem } from "$lib/requests/models/NowPlayingItem";
  import ToastEpisodeCover from "./ToastEpisodeCover.svelte";
  import ToastMediaCover from "./ToastMediaCover.svelte";

  const { item }: { item: NowPlayingItem | LastWatchedItem } = $props();
</script>

<Card
  variant="transparent"
  --width-card="var(--width-toast-card)"
  --height-card="var(--height-toast-card)"
  --height-card-cover="var(--height-toast-card)"
>
  {#if item.type === "movie"}
    <ToastMediaCover type="movie" media={item.media} />
  {/if}

  {#if item.type === "episode"}
    <ToastEpisodeCover episode={item.media} show={item.show} />
  {/if}

  {#if item.type === "show"}
    <ToastMediaCover type="show" media={item.media} />
  {/if}
</Card>
