<script lang="ts">
  import VipBadgeContent from "./_internal/VipBadgeContent.svelte";

  const { isDirector = false }: { isDirector?: boolean } = $props();
  const badgeLabel = isDirector ? "DIRECTOR" : "VIP";
</script>

<VipBadgeContent>
  {badgeLabel}
</VipBadgeContent>
