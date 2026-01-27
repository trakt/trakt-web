<script lang="ts">
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import type { MarkAsWatchedStoreProps } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";

  type WatchAgainProps = {
    title: string;
  } & MarkAsWatchedStoreProps;

  const { title, ...target }: WatchAgainProps = $props();

  const { isWatched } = $derived(useIsWatched(target));
</script>

{#if $isWatched}
  <MarkAsWatchedAction style="dropdown-item" mode="ask" {title} {...target} />
{/if}
