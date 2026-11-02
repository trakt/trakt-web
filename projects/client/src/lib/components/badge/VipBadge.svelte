<script lang="ts">
  import VipBadgeContent from "./_internal/VipBadgeContent.svelte";
  import type { VipBadgeProps } from "./_internal/VipBadgeProps.ts";
  import { toVipBadgeLabel } from "./toVipBadgeLabel.ts";

  const { isDirector = false, size, tone, label }: VipBadgeProps = $props();
  const badgeLabel = $derived(toVipBadgeLabel({ isDirector, label }));
</script>

<VipBadgeContent {size} {tone}>
  {badgeLabel}
</VipBadgeContent>
