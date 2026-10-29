<script lang="ts">
  import VipBadgeContent from "./_internal/VipBadgeContent.svelte";
  import type { VipBadgeProps } from "./_internal/VipBadgeProps.ts";

  const { isDirector = false, size }: VipBadgeProps = $props();
  const badgeLabel = $derived(isDirector ? "DIRECTOR" : "VIP");
</script>

<VipBadgeContent {size}>
  {badgeLabel}
</VipBadgeContent>
