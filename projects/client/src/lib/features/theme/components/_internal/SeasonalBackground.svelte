<script lang="ts">
  import SnowBackground from "./christmas/SnowBackground.svelte";

  const { themeId }: { themeId: string } = $props();
</script>

{#if themeId === "christmas"}
  <SnowBackground />
{/if}
