<script lang="ts">
  import { useSeasonalTheme } from "../useSeasonalTheme";
  import SnowBackground from "./_internal/christmas/SnowBackground.svelte";

  const { activeTheme } = useSeasonalTheme();
</script>

{#if $activeTheme === "christmas"}
  <SnowBackground />
{/if}
