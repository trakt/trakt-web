<script lang="ts">
  import BaseSplashscreen from "../BaseSplashscreen.svelte";
  import { snowPainter } from "../ambient/painters/snowPainter";
  import ParticleBackground from "../ambient/ParticleBackground.svelte";

  const {
    onDismiss,
    hasSplashScreen,
  }: { hasSplashScreen: boolean; onDismiss: () => void } = $props();

  const cover = import("./SplashScreenCover.svelte").catch(() => null);
</script>

<BaseSplashscreen {onDismiss} {hasSplashScreen}>
  <ParticleBackground painter={snowPainter} />
  {#await cover then module}
    {#if module}
      <module.default />
    {/if}
  {/await}
</BaseSplashscreen>
