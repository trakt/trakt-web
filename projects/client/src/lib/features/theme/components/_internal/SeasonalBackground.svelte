<script lang="ts">
  import { useAppearance } from "$lib/features/appearance/useAppearance.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import SnowBackground from "./christmas/SnowBackground.svelte";

  const { themeId }: { themeId: string } = $props();
  const { useSeasonalFilters } = useDiscover();
  const { reduceVisualNoise } = useAppearance();
</script>

{#if $useSeasonalFilters && !$reduceVisualNoise}
  {#if themeId === "christmas"}
    <SnowBackground />
  {/if}
{/if}
