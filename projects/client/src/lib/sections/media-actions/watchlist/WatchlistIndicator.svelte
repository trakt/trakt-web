<script lang="ts">
  import WatchlistIcon from "$lib/components/icons/WatchlistIcon.svelte";
  import StemSwipeIndicator from "../_internal/StemSwipeIndicator.svelte";

  const {
    isActive,
    isWatchlisted,
  }: { isActive: boolean; isWatchlisted: boolean } = $props();

  const state = $derived(isWatchlisted ? "added" : "missing");
</script>

<StemSwipeIndicator
  {isActive}
  --color-gesture-active={state === "missing"
    ? "var(--color-background-blue)"
    : "var(--color-background-red)"}
>
  <WatchlistIcon {state} />
</StemSwipeIndicator>
