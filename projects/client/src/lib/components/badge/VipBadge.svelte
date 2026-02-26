<script lang="ts">
  import VipBadgeContent from "./_internal/VipBadgeContent.svelte";

  const {
    isDirector = false,
    size,
  }: { isDirector?: boolean; size?: "normal" | "large" } = $props();
  const badgeLabel = $derived(isDirector ? "DIRECTOR" : "VIP");
</script>

<VipBadgeContent {size}>
  {badgeLabel}
</VipBadgeContent>
