<script lang="ts">
  import { useLastWatched } from "$lib/features/toast/useLastWatched";
  import { useNowPlaying } from "$lib/features/toast/useNowPlaying";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import NowPlayingContent from "$lib/sections/toast/_internal/NowPlayingContent.svelte";
  import RateNowContent from "$lib/sections/toast/_internal/RateNowContent.svelte";
  import { useCurrentUserLastWatched } from "$lib/sections/toast/_internal/useCurrentUserLastWatched";
  import { useCurrentUserNowWatching } from "$lib/sections/toast/_internal/useCurrentUserNowWatching";
  import type { LastWatchedItem } from "$lib/features/toast/models/LastWatchedItem";
  import { BehaviorSubject, combineLatest, map } from "rxjs";
  import { onMount } from "svelte";

  const { nowWatching } = useCurrentUserNowWatching();
  const { lastWatchedItem } = useCurrentUserLastWatched();

  const { nowPlaying } = useNowPlaying();
  const { lastWatched } = useLastWatched();

  const pinned = new BehaviorSubject<LastWatchedItem | null>(null);

  onMount(() => {
    const unsubscribeNowWatching = nowWatching.subscribe((val) =>
      nowPlaying.next(val),
    );

    const unsubscribeLastWatched = combineLatest([lastWatchedItem, pinned])
      .pipe(map(([candidate, held]) => held ?? candidate))
      .subscribe((val) => lastWatched.next(val));

    return () => {
      unsubscribeNowWatching.unsubscribe();
      unsubscribeLastWatched.unsubscribe();
    };
  });
</script>

{#snippet toastActions()}
  {#if $nowPlaying}
    <NowPlayingContent nowPlaying={$nowPlaying} />
  {:else if $lastWatched}
    {#key $lastWatched.media.key}
      <RateNowContent
        lastWatched={$lastWatched}
        onHold={(item) => pinned.next(item)}
        onRelease={() => pinned.next(null)}
      />
    {/key}
  {/if}
{/snippet}

<NavbarStateSetter
  toastActions={$nowPlaying || $lastWatched ? toastActions : null}
/>
