<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import StemSwipeIndicator from "../_internal/StemSwipeIndicator.svelte";

  const { isActive }: { isActive: boolean } = $props();
</script>

<StemSwipeIndicator {isActive} --color-gesture-active="var(--red-700)">
  <BookmarkIcon state="added" />
</StemSwipeIndicator>
