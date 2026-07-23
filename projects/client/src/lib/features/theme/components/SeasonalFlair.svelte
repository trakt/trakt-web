<script lang="ts">
  import { useAppearance } from "$lib/features/appearance/useAppearance.ts";
  import { useSeasonalTheme } from "../useSeasonalTheme";
  import SeasonalBackground from "./_internal/SeasonalBackground.svelte";
  import SeasonalSplashscreen from "./_internal/SeasonalSplashscreen.svelte";

  const { activeTheme, hasSplashScreen, dismissSplashScreen } =
    useSeasonalTheme();
  const { reduceVisualNoise } = useAppearance();

  const onDismiss = () => {
    if (!$activeTheme) {
      return;
    }

    dismissSplashScreen($activeTheme);
  };
</script>

{#if $activeTheme && !$reduceVisualNoise}
  <SeasonalBackground themeId={$activeTheme} />

  <SeasonalSplashscreen
    hasSplashScreen={$hasSplashScreen}
    themeId={$activeTheme}
    {onDismiss}
  />
{/if}
