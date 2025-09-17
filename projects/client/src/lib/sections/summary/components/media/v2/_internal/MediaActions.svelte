<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import MainAction from "./MainAction.svelte";

  const { media }: { media: MediaEntry } = $props();
</script>

<div class="trakt-media-actions">
  <MainAction {media} />
</div>

<style>
  .trakt-media-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    height: var(--ni-56);
    width: calc(100dvw - 2 * var(--layout-distance-side));

    padding: var(--ni-8) var(--ni-10);
    box-sizing: border-box;

    background-color: var(--color-card-background);
    border-radius: var(--border-radius-l);
    box-shadow: var(--popup-shadow);
  }
</style>
