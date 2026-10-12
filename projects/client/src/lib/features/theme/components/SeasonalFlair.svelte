<script lang="ts" module>
  import { browser } from "$app/environment";
  import { delay } from "$lib/utils/timing/delay.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { hideSeasonalCover } from "../_internal/hideSeasonalCover.ts";
  import { SEASONAL_THEMES } from "../constants.ts";
  import type { SeasonalThemeId } from "../models/SeasonalThemeId.ts";

  const ASSET_WAIT_LIMIT = time.seconds(4);

  const preloadAssets = (themeId: SeasonalThemeId) =>
    themeId === "halloween"
      ? import("./_internal/halloween/preloadHalloweenAssets.ts").then(
          ({ preloadHalloweenAssets }) => preloadHalloweenAssets(),
        )
      : Promise.resolve();

  const loadSplash = (themeId: SeasonalThemeId) =>
    Promise.all([
      import("./_internal/SeasonalSplashscreen.svelte"),
      Promise.race([preloadAssets(themeId), delay(ASSET_WAIT_LIMIT)]),
    ])
      .then(([module]) => module)
      .catch(() => {
        hideSeasonalCover();
        return null;
      });

  const isSeasonalThemeId = (value: string | null): value is SeasonalThemeId =>
    value !== null && Object.hasOwn(SEASONAL_THEMES, value);

  const findCoveredSeason = () => {
    const html = document.documentElement;
    const themeId = html.getAttribute("data-seasonal-theme");

    if (!html.hasAttribute("data-seasonal-cover")) return null;
    return isSeasonalThemeId(themeId) ? themeId : null;
  };

  const earlySeason = browser ? findCoveredSeason() : null;
  const earlySplash = earlySeason ? loadSplash(earlySeason) : null;
</script>

<script lang="ts">
  import { combineLatest, filter, from, switchMap, take } from "rxjs";
  import { useSeasonalTheme } from "../useSeasonalTheme";

  const { activeTheme, hasSplashScreen, dismissSplashScreen } =
    useSeasonalTheme();

  const splashModule = combineLatest([hasSplashScreen, activeTheme]).pipe(
    filter(
      (pair): pair is [true, SeasonalThemeId] => pair[0] && pair[1] !== null,
    ),
    take(1),
    switchMap(([, themeId]) =>
      from(
        earlySplash && earlySeason === themeId
          ? earlySplash
          : loadSplash(themeId),
      ),
    ),
  );

  const onDismiss = () => {
    if (!$activeTheme) {
      return;
    }

    dismissSplashScreen($activeTheme);
  };
</script>

{#if $activeTheme}
  {#if !$hasSplashScreen}
    {#await import("./_internal/SeasonalBackground.svelte") then { default: SeasonalBackground }}
      <SeasonalBackground themeId={$activeTheme} />
    {/await}
  {/if}

  {#if $splashModule}
    {@const SeasonalSplashscreen = $splashModule.default}
    <SeasonalSplashscreen
      hasSplashScreen={$hasSplashScreen}
      themeId={$activeTheme}
      {onDismiss}
    />
  {/if}
{/if}
