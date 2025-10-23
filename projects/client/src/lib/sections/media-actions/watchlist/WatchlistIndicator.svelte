<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
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
  <BookmarkIcon {state} />
</StemSwipeIndicator>
