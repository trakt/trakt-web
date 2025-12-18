<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
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

  <RenderFor audience="all" device={["tablet-sm", "mobile"]}>
    <SeasonalSplashscreen
      hasSplashScreen={$hasSplashScreen}
      themeId={$activeTheme}
      {onDismiss}
    />
  </RenderFor>
{/if}
