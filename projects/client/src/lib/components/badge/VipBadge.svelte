<script lang="ts">
  import VipBadgeContent from "./_internal/VipBadgeContent.svelte";

  const { size }: { size?: "normal" | "large" } = $props();
</script>

<VipBadgeContent {size}>VIP</VipBadgeContent>
