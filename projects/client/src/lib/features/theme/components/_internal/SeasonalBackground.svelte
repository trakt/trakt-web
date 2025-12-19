<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import SnowBackground from "./christmas/SnowBackground.svelte";

  const { themeId }: { themeId: string } = $props();
  const { useSeasonalFilters } = useDiscover();
</script>

{#if $useSeasonalFilters}
  {#if themeId === "christmas"}
    <SnowBackground />
  {/if}
{/if}
