<script lang="ts">
  import VipBadgeContent from "./_internal/VipBadgeContent.svelte";
  import { toVipBadgeLabel } from "./toVipBadgeLabel.ts";

  const {
    isDirector = false,
    size,
  }: { isDirector?: boolean; size?: "normal" | "large" } = $props();
</script>

<VipBadgeContent {size}>
  {toVipBadgeLabel({ isDirector })}
</VipBadgeContent>
