<script lang="ts">
  import NowPlayingToast from "./_internal/NowPlayingToast.svelte";
  import { useNowPlaying } from "./useNowPlaying";

  const { nowPlaying } = useNowPlaying();
</script>

{#if $nowPlaying}
  <NowPlayingToast nowPlaying={$nowPlaying} />
{/if}
