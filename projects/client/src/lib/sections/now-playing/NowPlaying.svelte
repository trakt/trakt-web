<script lang="ts">
  import { useNowPlaying } from "$lib/features/now-playing/useNowPlaying";
  import { onMount } from "svelte";
  import NowPlayingToast from "./_internal/NowPlayingToast.svelte";
  import { useCurrentUserNowWatching } from "./_internal/useCurrentUserNowWatching";

  const { nowWatching } = useCurrentUserNowWatching();
  const { nowPlaying } = useNowPlaying();

  onMount(() => {
    const unsubscribe = nowWatching.subscribe(nowPlaying.set);

    return () => {
      unsubscribe();
    };
  });
</script>

<NowPlayingToast />
