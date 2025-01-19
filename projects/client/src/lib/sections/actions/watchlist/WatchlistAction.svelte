<script lang="ts">
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import { onMount } from "svelte";
  import { useWatchlist, type WatchlistStoreProps } from "./useWatchlist";

  type WatchlistActionProps = {
    style?: "action" | "normal";
    title: string;
    onAction?: (state: boolean) => void;
  } & WatchlistStoreProps;

  const {
    style = "action",
    title,
    onAction,
    ...target
  }: WatchlistActionProps = $props();

  const {
    addToWatchlist,
    isWatchlistUpdating,
    isWatchlisted,
    removeFromWatchlist,
  } = $derived(useWatchlist(target));

  onMount(() => {
    return isWatchlistUpdating.subscribe((value) => onAction?.(value));
  });
</script>

<WatchlistButton
  type={style}
  {title}
  isWatchlisted={$isWatchlisted}
  isWatchlistUpdating={$isWatchlistUpdating}
  onAdd={addToWatchlist}
  onRemove={removeFromWatchlist}
/>
