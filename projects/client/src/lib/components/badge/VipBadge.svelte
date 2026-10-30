<script lang="ts">
  import VipBadgeContent from "./_internal/VipBadgeContent.svelte";

  const {
    isDirector = false,
    size,
  }: { isDirector?: boolean; size?: "normal" | "large" } = $props();
</script>

<VipBadgeContent {size}>
  {isDirector ? "DIRECTOR" : "VIP"}
</VipBadgeContent>
