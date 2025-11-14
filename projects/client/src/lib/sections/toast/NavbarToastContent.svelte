<script lang="ts">
  import { useLastWatched } from "$lib/features/toast/useLastWatched";
  import { useNowPlaying } from "$lib/features/toast/useNowPlaying";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import NowPlayingContent from "$lib/sections/toast/_internal/NowPlayingContent.svelte";
  import RateNowContent from "$lib/sections/toast/_internal/RateNowContent.svelte";
  import { useCurrentUserLastWatched } from "$lib/sections/toast/_internal/useCurrentUserLastWatched";
  import { useCurrentUserNowWatching } from "$lib/sections/toast/_internal/useCurrentUserNowWatching";
  import { onMount } from "svelte";

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

{#snippet toastActions()}
  {#if $nowPlaying}
    <NowPlayingContent nowPlaying={$nowPlaying} />
  {:else if $lastWatched}
    <RateNowContent lastWatched={$lastWatched} />
  {/if}
{/snippet}

<NavbarStateSetter
  toastActions={$nowPlaying || $lastWatched ? toastActions : null}
/>
