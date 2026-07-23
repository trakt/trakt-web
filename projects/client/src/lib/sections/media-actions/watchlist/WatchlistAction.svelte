<script lang="ts">
  import { isToastEnabledForStyle } from "../_internal/isToastEnabledForStyle";
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { useWatchlist } from "./useWatchlist";
  import type { WatchlistActionProps } from "./WatchListActionProps";

  const {
    style = "action",
    size = "normal",
    title,
    ...target
  }: WatchlistActionProps = $props();

  const {
    addToWatchlist,
    isWatchlistUpdating,
    isWatchlisted,
    isQueued,
    removeFromWatchlist,
  } = $derived(
    useWatchlist({
      ...target,
      isToastEnabled: isToastEnabledForStyle(style),
    }),
  );

  const { confirm } = useConfirm();
  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemoveFromWatchList,
      title,
      onConfirm: removeFromWatchlist,
    }),
  );
</script>

<WatchlistButton
  type={style}
  {title}
  {size}
  isWatchlisted={$isWatchlisted}
  isWatchlistUpdating={$isWatchlistUpdating}
  isQueued={$isQueued}
  onAdd={addToWatchlist}
  onRemove={confirmRemove}
/>
