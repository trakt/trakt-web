<script lang="ts">
  import BaseSplashscreen from "../BaseSplashscreen.svelte";
  import SnowBackground from "./SnowBackground.svelte";
  import SplashScreenCover from "./SplashScreenCover.svelte";

  const {
    onDismiss,
    hasSplashScreen,
  }: { hasSplashScreen: boolean; onDismiss: () => void } = $props();
</script>

<BaseSplashscreen {onDismiss} {hasSplashScreen}>
  <SnowBackground />
  <SplashScreenCover />
</BaseSplashscreen>
