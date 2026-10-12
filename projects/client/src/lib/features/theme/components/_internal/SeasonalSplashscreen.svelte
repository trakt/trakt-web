<script lang="ts">
  import type { SeasonalThemeId } from "$lib/features/theme/models/SeasonalThemeId";
  import * as m from "$lib/features/i18n/messages.ts";
  import { SEASONAL_THEMES } from "$lib/features/theme/constants";
  import { resolveSeasonalWindow } from "$lib/features/theme/utils/resolveSeasonalWindow";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import SeasonalParticles from "./ambient/SeasonalParticles.svelte";
  import BaseSplashscreen from "./BaseSplashscreen.svelte";
  import ChristmasHills from "./christmas/ChristmasHills.svelte";
  import ChristmasSnowflake from "./christmas/ChristmasSnowflake.svelte";
  import SeasonalGarland from "./decor/SeasonalGarland.svelte";
  import SantaSleigh from "./christmas/SantaSleigh.svelte";
  import HalloweenGraveyard from "./halloween/HalloweenGraveyard.svelte";
  import HalloweenMoon from "./halloween/HalloweenMoon.svelte";
  import NewYearRays from "./new-year/NewYearRays.svelte";
  import NewYearSkyline from "./new-year/NewYearSkyline.svelte";
  import SplashHero from "./splash/SplashHero.svelte";

  const {
    themeId,
    hasSplashScreen,
    onDismiss,
  }: {
    themeId: SeasonalThemeId;
    hasSplashScreen: boolean;
    onDismiss: () => void;
  } =
    $props();

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const upcomingYear = resolveSeasonalWindow({
    ...SEASONAL_THEMES["new-year"],
    now: new Date(),
  }).end.year;

  const greeting = $derived.by(() => {
    switch (themeId) {
      case "halloween":
        return {
          title: m.header_seasonal_greeting_halloween(),
          text: m.text_seasonal_greeting_halloween(),
        };
      case "christmas":
        return {
          title: m.header_seasonal_greeting_christmas(),
          text: m.text_seasonal_greeting_christmas(),
        };
      case "new-year":
        return {
          title: m.header_seasonal_greeting_new_year(),
          text: m.text_seasonal_greeting_new_year(),
        };
      default:
        return null;
    }
  });
</script>

{#if greeting}
  <BaseSplashscreen {hasSplashScreen} {onDismiss}>
    {#if !$isReducedMotion}
      {#key themeId}
        <SeasonalParticles {themeId} hasFireworks />
      {/key}
    {/if}

    {#if themeId === "halloween"}
      <HalloweenGraveyard />
    {/if}

    {#if themeId === "christmas"}
      <SeasonalGarland variant="lights" />
      <ChristmasHills />
      {#if !$isReducedMotion}
        <SantaSleigh delaySeconds={1} --sleigh-color="var(--shade-200)" />
      {/if}
    {/if}

    {#if themeId === "new-year"}
      <SeasonalGarland variant="bunting" />
      <NewYearSkyline />
    {/if}

    <div class="trakt-seasonal-greeting" data-season={themeId}>
      <SplashHero {themeId}>
        {#snippet backdrop()}
          {#if themeId === "halloween"}
            <HalloweenMoon />
          {/if}

          {#if themeId === "christmas"}
            <ChristmasSnowflake />
          {/if}

          {#if themeId === "new-year"}
            <NewYearRays />
          {/if}
        {/snippet}
      </SplashHero>

      <div class="greeting-copy">
        {#if themeId === "new-year"}
          <span class="greeting-year">{upcomingYear}</span>
        {/if}

        <h1 class="greeting-title">{greeting.title}</h1>
        <p class="greeting-text">{greeting.text}</p>
        <p class="greeting-signoff small">{m.text_seasonal_greeting_signoff()}</p>
      </div>
    </div>
  </BaseSplashscreen>
{/if}

<style>
  .trakt-seasonal-greeting {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ni-40);

    padding-inline: var(--ni-24);
    margin-bottom: min(16vh, var(--ni-120));
    text-align: center;

    color: var(--shade-10);

    &[data-season="halloween"],
    &[data-season="christmas"] {
      margin-top: var(--ni-64);
    }

    .greeting-copy {
      position: relative;

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--gap-s);
    }

    .greeting-year {
      font-size: clamp(var(--ni-64), 22vw, var(--ni-120));
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.04em;

      color: transparent;
      -webkit-text-stroke: var(--ni-2) var(--purple-200);
      filter: blur(0) drop-shadow(0 0 var(--ni-16) var(--purple-400));

      animation: greeting-zoom 900ms cubic-bezier(0.34, 1.56, 0.64, 1) 700ms
        both;
    }

    .greeting-title {
      font-size: clamp(var(--ni-36), 10vw, var(--ni-64));
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.02em;

      background: linear-gradient(
        110deg,
        var(--purple-200) 0%,
        var(--shade-10) 30%,
        var(--purple-100) 45%,
        var(--shade-10) 55%,
        var(--purple-300) 100%
      );
      background-size: 250% 100%;
      background-clip: text;
      color: transparent;

      filter: blur(0)
        drop-shadow(
        0 0 var(--ni-24) color-mix(in srgb, var(--purple-400) 70%, transparent)
      );

      animation:
        greeting-focus 800ms cubic-bezier(0.22, 1, 0.36, 1) 900ms both,
        greeting-shimmer 5s ease-in-out 1700ms infinite;
    }

    .greeting-text {
      max-width: var(--ni-320);
      color: var(--shade-100);

      animation: greeting-rise 600ms ease-out 1200ms both;
    }

    .greeting-signoff {
      color: var(--purple-200);
      text-transform: uppercase;
      letter-spacing: 0.16em;

      animation: greeting-rise 600ms ease-out 1400ms both;
    }
  }

  @keyframes greeting-zoom {
    from {
      opacity: 0;
      transform: scale(2.4);
      filter: blur(var(--ni-12)) drop-shadow(0 0 0 transparent);
    }
  }

  @keyframes greeting-focus {
    from {
      opacity: 0;
      transform: scale(0.8);
      filter: blur(var(--ni-16)) drop-shadow(0 0 0 transparent);
      letter-spacing: 0.2em;
    }
  }

  @keyframes greeting-shimmer {
    0%,
    100% {
      background-position: 100% 0;
    }
    50% {
      background-position: 0 0;
    }
  }

  @keyframes greeting-rise {
    from {
      opacity: 0;
      transform: translateY(var(--ni-12));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-seasonal-greeting .greeting-year,
    .trakt-seasonal-greeting .greeting-title,
    .trakt-seasonal-greeting .greeting-text,
    .trakt-seasonal-greeting .greeting-signoff {
      animation: none;
    }
  }
</style>
