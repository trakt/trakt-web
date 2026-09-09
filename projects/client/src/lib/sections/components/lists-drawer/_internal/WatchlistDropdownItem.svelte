<script lang="ts">
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist";

  const {
    media,
    type,
    title,
    onLoading,
  }: {
    media: MediaEntry;
    type: MediaType;
    title: string;
    onLoading?: (isLoading: boolean) => void;
  } = $props();

  const {
    addToWatchlist,
    isWatchlistUpdating,
    isWatchlisted,
    removeFromWatchlist,
  } = $derived(useWatchlist({ media, type, isToastEnabled: false }));

  const { confirm } = useConfirm();
  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemoveFromWatchList,
      title,
      onConfirm: removeFromWatchlist,
    }),
  );

  $effect(() => {
    onLoading?.($isWatchlistUpdating);
  });
</script>

<WatchlistButton
  {title}
  type="dropdown-item"
  size="normal"
  isWatchlistUpdating={$isWatchlistUpdating}
  isWatchlisted={$isWatchlisted}
  onAdd={addToWatchlist}
  onRemove={confirmRemove}
/>
