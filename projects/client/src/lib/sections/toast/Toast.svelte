<script lang="ts">
  import { useLastWatched } from "$lib/features/toast/useLastWatched";
  import { useNowPlaying } from "$lib/features/toast/useNowPlaying";
  import { onMount } from "svelte";
  import NowPlayingToast from "./_internal/NowPlayingToast.svelte";
  import RateNowToast from "./_internal/RateNowToast.svelte";
  import { useCurrentUserLastWatched } from "./_internal/useCurrentUserLastWatched";
  import { useCurrentUserNowWatching } from "./_internal/useCurrentUserNowWatching";

  const { nowWatching } = useCurrentUserNowWatching();
  const { lastWatchedItem } = useCurrentUserLastWatched();

  const { nowPlaying } = useNowPlaying();
  const { lastWatched } = useLastWatched();

  onMount(() => {
    const unsubscribeNowWatching = nowWatching.subscribe(nowPlaying.set);
    const unsubscribeLastWatched = lastWatchedItem.subscribe(lastWatched.set);

    return () => {
      unsubscribeNowWatching();
      unsubscribeLastWatched();
    };
  });
</script>

{#if $nowPlaying}
  <NowPlayingToast />
{:else if $lastWatched}
  <RateNowToast lastWatched={$lastWatched} />
{/if}
