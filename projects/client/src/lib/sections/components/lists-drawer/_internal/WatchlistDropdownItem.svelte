<script lang="ts">
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist";
  import {
    type BackgroundFlash,
    backgroundFlash,
  } from "$lib/utils/attachments/backgroundFlash";
  import type { WatchlistDropdownItemProps } from "./WatchlistDropdownItemProps";

  const {
    media,
    type,
    title,
  }: WatchlistDropdownItemProps = $props();

  const {
    addToWatchlist,
    isWatchlistUpdating,
    isWatchlisted,
    removeFromWatchlist,
  } = $derived(useWatchlist({ media, type, isToastEnabled: false }));

  let flash = $state<BackgroundFlash | null>(null);

  const add = async () => {
    if (await addToWatchlist() === "executed") {
      flash = { color: "purple" };
    }
  };

  const remove = async () => {
    if (await removeFromWatchlist() === "executed") {
      flash = { color: "red" };
    }
  };

  const { confirm } = useConfirm();
  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemoveFromWatchList,
      title,
      onConfirm: remove,
    }),
  );

</script>

<WatchlistButton
  {title}
  type="dropdown-item"
  size="normal"
  isWatchlistUpdating={$isWatchlistUpdating}
  isWatchlisted={$isWatchlisted}
  onAdd={add}
  {@attach backgroundFlash(flash)}
  onRemove={confirmRemove}
>
</WatchlistButton>
