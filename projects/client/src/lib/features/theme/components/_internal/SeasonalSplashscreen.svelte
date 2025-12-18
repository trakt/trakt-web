<script lang="ts">
  import ChristmasSplashscreen from "./christmas/ChristmasSplashscreen.svelte";

  const {
    themeId,
    hasSplashScreen,
    onDismiss,
  }: { themeId: string; hasSplashScreen: boolean; onDismiss: () => void } =
    $props();
</script>

{#if themeId === "christmas"}
  <ChristmasSplashscreen {onDismiss} {hasSplashScreen} />
{/if}
