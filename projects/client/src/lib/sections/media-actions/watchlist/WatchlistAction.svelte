<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import type { MediaStoreProps } from "$lib/models/MediaStoreProps";
  import { attachWarning } from "../_internal/attachWarning";
  import { useWatchlist } from "./useWatchlist";

  type WatchlistActionProps = {
    style?: "action" | "normal" | "dropdown-item";
    size?: "small" | "normal";
    title: string;
  } & MediaStoreProps;

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
    removeFromWatchlist,
  } = $derived(useWatchlist(target));

  const onRemoveHandler = $derived(
    attachWarning(
      removeFromWatchlist,
      m.remove_from_watchlist_warning({ title }),
    ),
  );
</script>

<WatchlistButton
  type={style}
  {title}
  {size}
  isWatchlisted={$isWatchlisted}
  isWatchlistUpdating={$isWatchlistUpdating}
  onAdd={addToWatchlist}
  onRemove={onRemoveHandler}
/>
