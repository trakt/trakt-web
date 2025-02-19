<script lang="ts">
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import type { MediaStoreProps } from "$lib/models/MediaStoreProps";
  import { onMount } from "svelte";
  import { useWatchlist } from "./useWatchlist";

  type WatchlistActionProps = {
    style?: "action" | "normal" | "dropdown-item";
    size?: "small" | "normal";
    title: string;
    onAction?: (state: boolean) => void;
  } & MediaStoreProps;

  const {
    style = "action",
    size = "normal",
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
  {size}
  isWatchlisted={$isWatchlisted}
  isWatchlistUpdating={$isWatchlistUpdating}
  onAdd={addToWatchlist}
  onRemove={removeFromWatchlist}
/>
