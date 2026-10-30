<script lang="ts">
  import VipBadgeContent from "./_internal/VipBadgeContent.svelte";
  import type { VipBadgeProps } from "./_internal/VipBadgeProps.ts";

  const { isDirector = false, size, tone, label }: VipBadgeProps = $props();
  const badgeLabel = $derived(isDirector ? "DIRECTOR" : (label ?? "VIP"));
</script>

<VipBadgeContent {size} {tone}>
  {badgeLabel}
</VipBadgeContent>
