<script lang="ts">
  import { useAppearance } from "$lib/features/appearance/useAppearance.ts";
  import ChristmasSplashscreen from "./christmas/ChristmasSplashscreen.svelte";

  const {
    themeId,
    hasSplashScreen,
    onDismiss,
  }: { themeId: string; hasSplashScreen: boolean; onDismiss: () => void } =
    $props();
  const { reduceVisualNoise } = useAppearance();
</script>

{#if themeId === "christmas" && !$reduceVisualNoise}
  <ChristmasSplashscreen {onDismiss} {hasSplashScreen} />
{/if}
