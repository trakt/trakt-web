<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { NowPlayingItem } from "$lib/requests/models/NowPlayingItem";
  import NowPlayingEpisodeCover from "./NowPlayingEpisodeCover.svelte";
  import NowPlayingMovieCover from "./NowPlayingMovieCover.svelte";

  const { nowPlayingItem }: { nowPlayingItem: NowPlayingItem } = $props();
</script>

<Card
  variant="transparent"
  --width-card="var(--width-now-playing-card)"
  --height-card="var(--height-now-playing-card)"
  --height-card-cover="var(--height-now-playing-card)"
>
  {#if nowPlayingItem.type === "movie"}
    <NowPlayingMovieCover movie={nowPlayingItem.media} />
  {/if}

  {#if nowPlayingItem.type === "episode"}
    <NowPlayingEpisodeCover
      episode={nowPlayingItem.episode}
      show={nowPlayingItem.media}
    />
  {/if}
</Card>
