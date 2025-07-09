<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { NowPlayingItem } from "$lib/requests/models/NowPlayingItem";
  import NowPlayingEpisodeCover from "./NowPlayingEpisodeCover.svelte";
  import NowPlayingMovieCover from "./NowPlayingMovieCover.svelte";

  const { nowPlaying }: { nowPlaying: NowPlayingItem } = $props();
</script>

<Card
  variant="transparent"
  --width-card="var(--width-now-playing-card)"
  --height-card="var(--height-now-playing-card)"
  --height-card-cover="var(--height-now-playing-card)"
>
  {#if nowPlaying.type === "movie"}
    <NowPlayingMovieCover movie={nowPlaying.media} />
  {/if}

  {#if nowPlaying.type === "episode"}
    <NowPlayingEpisodeCover
      episode={nowPlaying.episode}
      show={nowPlaying.media}
    />
  {/if}
</Card>
