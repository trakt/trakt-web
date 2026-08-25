<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";

  const { media }: { media: MediaEntry } = $props();

  const listProps = $derived({
    title: media.title,
    type: media.type,
    media,
    style: "action" as const,
  });
</script>

<WatchlistAction {...listProps} />
