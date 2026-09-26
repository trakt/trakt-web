<script lang="ts">
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import type { DropdownItemFlash } from "$lib/components/dropdown/DropdownItemFlash";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist";
  import { useBackgroundFlash } from "$lib/stores/useBackgroundFlash.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ViewListLink from "./ViewListLink.svelte";

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

  const rowFlash = useBackgroundFlash<DropdownItemFlash>();
  let wasUpdating = false;

  $effect(() => {
    const isUpdating = $isWatchlistUpdating;
    onLoading?.(isUpdating);

    if (wasUpdating && !isUpdating) {
      rowFlash.flash($isWatchlisted ? "purple" : "red");
    }
    wasUpdating = isUpdating;
  });
</script>

<WatchlistButton
  {title}
  type="dropdown-item"
  size="normal"
  isWatchlistUpdating={$isWatchlistUpdating}
  isWatchlisted={$isWatchlisted}
  flash={rowFlash.flashing}
  onAdd={addToWatchlist}
  onRemove={confirmRemove}
>
  {#snippet action()}
    <ViewListLink
      href={UrlBuilder.lists.watchlist("me")}
      label={m.link_label_view_watchlist()}
      tooltip={m.tooltip_view_watchlist()}
    />
  {/snippet}
</WatchlistButton>
