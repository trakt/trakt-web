<script lang="ts">
  import type { MediaInputDefault } from "$lib/models/MediaInput";
  import ListAction from "$lib/sections/components/lists-drawer/ListAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";

  type DefaultMediaPopupActionsProps = {
    media: MediaInputDefault;
    onListAction: () => void;
  };

  const { media, onListAction }: DefaultMediaPopupActionsProps = $props();
</script>

<WatchlistAction
  style="dropdown-item"
  title={media.title}
  type={media.type}
  {media}
/>
<MarkAsWatchedAction
  style="dropdown-item"
  title={media.title}
  type={media.type}
  {media}
/>
<ListAction
  style="dropdown-item"
  {media}
  title={media.title}
  onClick={onListAction}
/>
