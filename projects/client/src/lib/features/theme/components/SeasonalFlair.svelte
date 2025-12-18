<script lang="ts">
  import { useSeasonalTheme } from "../useSeasonalTheme";
  import SeasonalBackground from "./_internal/SeasonalBackground.svelte";
  import SeasonalSplashscreen from "./_internal/SeasonalSplashscreen.svelte";

  const { activeTheme, hasSplashScreen, dismissSplashScreen } =
    useSeasonalTheme();

  const onDismiss = () => {
    if (!$activeTheme) {
      return;
    }

    dismissSplashScreen($activeTheme);
  };
</script>

{#if $activeTheme}
  <SeasonalBackground themeId={$activeTheme} />

  <SeasonalSplashscreen
    hasSplashScreen={$hasSplashScreen}
    themeId={$activeTheme}
    {onDismiss}
  />
{/if}
