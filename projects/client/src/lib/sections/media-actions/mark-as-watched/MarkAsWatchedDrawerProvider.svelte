<script lang="ts">
  import MarkAsWatchedDrawerHost from "./_internal/MarkAsWatchedDrawerHost.svelte";
  import { markAsWatchedDrawerStore } from "./_internal/markAsWatchedDrawerStore";
  import WatchStateDrawerHost from "./_internal/watch-state/WatchStateDrawerHost.svelte";
  import { watchStateDrawerStore } from "./_internal/watch-state/watchStateDrawerStore";
</script>

{#if $markAsWatchedDrawerStore?.isOpen}
  <MarkAsWatchedDrawerHost
    onClose={markAsWatchedDrawerStore.close}
    title={$markAsWatchedDrawerStore.title}
    onWatched={$markAsWatchedDrawerStore.onWatched}
    elevated={$markAsWatchedDrawerStore.elevated}
    {...$markAsWatchedDrawerStore.mediaStore}
  />
{/if}

{#if $watchStateDrawerStore?.isOpen}
  <WatchStateDrawerHost
    onClose={watchStateDrawerStore.close}
    title={$watchStateDrawerStore.title}
    show={$watchStateDrawerStore.show}
    mediaStore={$watchStateDrawerStore.mediaStore}
  />
{/if}
