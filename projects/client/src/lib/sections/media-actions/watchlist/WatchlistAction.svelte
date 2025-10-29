<script lang="ts">
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import { onMount } from "svelte";
  import { useWatchlist } from "./useWatchlist";
  import type { WatchlistActionProps } from "./WatchListActionProps";

  const {
    style = "action",
    size = "normal",
    title,
    isUpdating,
    ...target
  }: WatchlistActionProps = $props();

  const {
    addToWatchlist,
    isWatchlistUpdating,
    isWatchlisted,
    removeFromWatchlist,
  } = $derived(useWatchlist({ ...target, title }));

  onMount(() => {
    if (!isUpdating) {
      return;
    }

    const unsubscribe = isWatchlistUpdating.subscribe((value) => {
      isUpdating.set(value);
    });

    return {
      destroy: unsubscribe,
    };
  });
</script>

<WatchlistButton
  type={style}
  {title}
  {size}
  isWatchlisted={$isWatchlisted}
  isWatchlistUpdating={$isWatchlistUpdating}
  onAdd={addToWatchlist}
  onRemove={removeFromWatchlist}
/>
