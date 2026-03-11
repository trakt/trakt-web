<script lang="ts">
  import SmartListFilterPreserver from "$lib/sections/smart-lists/SmartListFilterPreserver.svelte";

  const { children } = $props();
</script>

<SmartListFilterPreserver />
{@render children?.()}
