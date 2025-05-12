<script lang="ts">
  import DropIcon from "$lib/components/icons/DropIcon.svelte";
  import StemSwipeIndicator from "../_internal/StemSwipeIndicator.svelte";

  const { isActive }: { isActive: boolean } = $props();
</script>

<StemSwipeIndicator {isActive} --color-gesture-active="var(--color-foreground)">
  <DropIcon />
</StemSwipeIndicator>
