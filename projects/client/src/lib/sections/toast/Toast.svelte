<script lang="ts">
  import { page } from "$app/state";
  import { useLastWatched } from "$lib/features/toast/useLastWatched";
  import { useNowPlaying } from "$lib/features/toast/useNowPlaying";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
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

  const isOnSearchPage = $derived(page.route.id === UrlBuilder.search());
</script>

{#snippet content()}
  {#if $nowPlaying}
    <NowPlayingToast nowPlaying={$nowPlaying} />
  {:else if $lastWatched}
    <RateNowToast lastWatched={$lastWatched} />
  {/if}
{/snippet}

<RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}>
  {#if !isOnSearchPage}
    {@render content()}
  {/if}
</RenderFor>

<RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
  {@render content()}
</RenderFor>
