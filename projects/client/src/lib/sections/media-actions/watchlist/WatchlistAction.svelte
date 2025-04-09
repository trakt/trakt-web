<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import WatchlistButton from "$lib/components/buttons/watchlist/WatchlistButton.svelte";
  import { onMount } from "svelte";
  import { attachWarning } from "../_internal/attachWarning";
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
  } = $derived(useWatchlist(target));

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
