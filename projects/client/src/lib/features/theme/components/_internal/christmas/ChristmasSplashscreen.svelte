<script lang="ts">
  import BaseSplashscreen from "../BaseSplashscreen.svelte";
  import { snowPainter } from "../ambient/painters/snowPainter";
  import ParticleBackground from "../ambient/ParticleBackground.svelte";
  import SplashScreenCover from "./SplashScreenCover.svelte";

  const {
    onDismiss,
    hasSplashScreen,
  }: { hasSplashScreen: boolean; onDismiss: () => void } = $props();
</script>

<BaseSplashscreen {onDismiss} {hasSplashScreen}>
  <ParticleBackground painter={snowPainter} />
  <SplashScreenCover />
</BaseSplashscreen>
