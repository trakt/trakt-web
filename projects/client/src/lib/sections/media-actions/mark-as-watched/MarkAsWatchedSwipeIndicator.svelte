<script lang="ts">
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import StemSwipeIndicator from "../_internal/StemSwipeIndicator.svelte";

  const { isActive }: { isActive: boolean } = $props();
</script>

<StemSwipeIndicator
  {isActive}
  --color-gesture-active="var(--color-background-purple)"
>
  <TrackIcon state="unwatched" />
</StemSwipeIndicator>
