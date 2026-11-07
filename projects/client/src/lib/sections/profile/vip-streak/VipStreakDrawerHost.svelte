<script lang="ts">
  import { useVipVeteran } from "$lib/features/vip-veteran/stores/useVipVeteran.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import VipStreakDrawer from "./VipStreakDrawer.svelte";

  const { slug, onClose }: { slug: string; onClose: () => void } = $props();

  const { veteran } = useVipVeteran(fromRune(() => slug));
</script>

{#if $veteran}
  <VipStreakDrawer veteran={$veteran} {onClose} />
{/if}
