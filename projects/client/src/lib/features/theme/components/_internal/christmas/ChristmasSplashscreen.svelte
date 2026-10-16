<script lang="ts">
  import BaseSplashscreen from "../BaseSplashscreen.svelte";
  import SnowBackground from "./SnowBackground.svelte";

  const {
    onDismiss,
    hasSplashScreen,
  }: { hasSplashScreen: boolean; onDismiss: () => void } = $props();

  const cover = import("./SplashScreenCover.svelte").catch(() => null);
</script>

<BaseSplashscreen {onDismiss} {hasSplashScreen}>
  <SnowBackground />
  {#await cover then module}
    {#if module}
      <module.default />
    {/if}
  {/await}
</BaseSplashscreen>
