<script lang="ts">
  import { useSeasonalTheme } from "../useSeasonalTheme";
  import Snow from "./_internal/Snow.svelte";

  const { activeTheme } = useSeasonalTheme();
</script>

{#if $activeTheme === "christmas"}
  <Snow />
{/if}
