<script lang="ts">
  import type {
    WatchlistButtonIntl,
    WatchlistButtonMeta,
  } from "$lib/components/buttons/watchlist/WatchlistButtonIntl.ts";
  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { LoreMovie } from "$lib/requests/models/LoreMovie.ts";
  import { useWatchlist } from "$lib/sections/media-actions/watchlist/useWatchlist";
  import { toWatchlistAddLabel } from "./toWatchlistAddLabel.ts";

  const { films }: { films: ReadonlyArray<LoreMovie> } = $props();

  const {
    addToWatchlist,
    isWatchlistUpdating,
    isWatchlisted,
    isQueued,
    removeFromWatchlist,
  } = $derived(
    useWatchlist({
      type: "movie",
      media: [...films],
      isToastEnabled: false,
    }),
  );

  const title = $derived(films.map((film) => film.title).join(", "));

  const toLabel = ({ isWatchlisted: isOnWatchlist }: WatchlistButtonMeta) =>
    isOnWatchlist
      ? m.tag_text_watchlisted()
      : toWatchlistAddLabel(films.length);

  const i18n: WatchlistButtonIntl = { label: toLabel, text: toLabel };

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
  {i18n}
  type="normal"
  size="small"
  {title}
  isWatchlisted={$isWatchlisted}
  isWatchlistUpdating={$isWatchlistUpdating}
  isQueued={$isQueued}
  onAdd={addToWatchlist}
  onRemove={confirmRemove}
/>
