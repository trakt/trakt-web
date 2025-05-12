<script lang="ts">
  import MarkAsWatchedIcon from "$lib/components/icons/MarkAsWatchedIcon.svelte";
  import StemSwipeIndicator from "../_internal/StemSwipeIndicator.svelte";

  const { isActive }: { isActive: boolean } = $props();
</script>

<StemSwipeIndicator
  {isActive}
  --color-gesture-active="var(--color-background-purple)"
>
  <MarkAsWatchedIcon size="normal" state="unwatched" />
</StemSwipeIndicator>
