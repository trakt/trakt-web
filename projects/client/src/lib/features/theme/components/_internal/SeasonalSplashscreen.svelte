<script lang="ts">
  import type { SeasonalThemeId } from "$lib/features/theme/models/SeasonalThemeId";
  import * as m from "$lib/features/i18n/messages.ts";
  import { SEASONAL_THEMES } from "$lib/features/theme/constants";
  import { resolveSeasonalWindow } from "$lib/features/theme/utils/resolveSeasonalWindow";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import SeasonalParticles from "./ambient/SeasonalParticles.svelte";
  import BaseSplashscreen from "./BaseSplashscreen.svelte";
  import ChristmasBauble from "./christmas/ChristmasBauble.svelte";
  import ChristmasHills from "./christmas/ChristmasHills.svelte";
  import ChristmasSnowflake from "./christmas/ChristmasSnowflake.svelte";
  import SeasonalGarland from "./decor/SeasonalGarland.svelte";
  import SantaSleigh from "./christmas/SantaSleigh.svelte";
  import HalloweenFog from "./halloween/HalloweenFog.svelte";
  import HalloweenJackOLantern from "./halloween/HalloweenJackOLantern.svelte";
  import HalloweenMoon from "./halloween/HalloweenMoon.svelte";
  import NewYearMedallion from "./new-year/NewYearMedallion.svelte";
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
  } = $props();

  const uid = $props.id();
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
      <HalloweenFog />
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

    <div
      class="trakt-seasonal-greeting"
      data-season={themeId}
      style="--greeting-wobble: url(#{uid}-wobble)"
    >
      <svg class="greeting-filters" aria-hidden="true">
        <filter id="{uid}-wobble">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="2"
            seed="7"
          />
          <feDisplacementMap in="SourceGraphic" scale="6" />
        </filter>
      </svg>

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

        {#snippet emblem()}
          {#if themeId === "halloween"}
            <HalloweenJackOLantern />
          {/if}

          {#if themeId === "christmas"}
            <ChristmasBauble />
          {/if}

          {#if themeId === "new-year"}
            <NewYearMedallion />
          {/if}
        {/snippet}
      </SplashHero>

      <div class="greeting-copy">
        {#if themeId === "new-year"}
          <span class="greeting-year">{upcomingYear}</span>
          <span class="greeting-rule"></span>
        {/if}

        <div class="greeting-banner">
          {#if themeId === "christmas"}
            <span class="ribbon-tail is-start"></span>
            <span class="ribbon-tail is-end"></span>
          {/if}

          <h1 class="greeting-title">{greeting.title}</h1>
        </div>

        <p class="greeting-text">{greeting.text}</p>
        <p class="greeting-signoff small">
          {m.text_seasonal_greeting_signoff()}
        </p>
      </div>
    </div>
  </BaseSplashscreen>
{/if}

<style>
  .trakt-seasonal-greeting {
    --title-gradient: linear-gradient(
      110deg,
      var(--purple-200) 0%,
      var(--shade-10) 30%,
      var(--purple-100) 45%,
      var(--shade-10) 55%,
      var(--purple-300) 100%
    );
    --title-glow: color-mix(in srgb, var(--purple-400) 70%, transparent);
    --greeting-text-color: var(--shade-100);
    --greeting-signoff-color: var(--purple-200);

    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: min(var(--ni-40), 4vh);

    padding-inline: var(--ni-24);
    margin-bottom: min(16vh, var(--ni-120));
    text-align: center;

    color: var(--shade-10);

    .greeting-filters {
      position: absolute;
      width: 0;
      height: 0;
    }

    .greeting-copy {
      position: relative;

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--gap-s);
    }

    .greeting-banner {
      position: relative;
      max-width: 100%;
    }

    .greeting-title {
      position: relative;

      font-size: clamp(var(--ni-28), min(10vw, 9vh), var(--ni-64));
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.02em;

      background: var(--title-gradient);
      background-size: 250% 100%;
      background-position: 100% 0;
      background-clip: text;
      color: transparent;

      filter: blur(0) drop-shadow(0 0 var(--ni-24) var(--title-glow));

      animation:
        greeting-focus 800ms cubic-bezier(0.22, 1, 0.36, 1) 900ms both,
        greeting-shimmer 5s ease-in-out 1700ms infinite;
    }

    .greeting-text {
      max-width: var(--ni-320);
      color: var(--greeting-text-color);

      animation: greeting-rise 600ms ease-out 1200ms both;
    }

    .greeting-signoff {
      color: var(--greeting-signoff-color);
      text-transform: uppercase;
      letter-spacing: 0.16em;

      animation: greeting-rise 600ms ease-out 1400ms both;
    }

    &[data-season="halloween"] {
      --title-gradient: linear-gradient(
        110deg,
        var(--green-100) 0%,
        var(--shade-10) 30%,
        var(--yellow-50) 45%,
        var(--shade-10) 60%,
        var(--green-200) 100%
      );
      --title-glow: color-mix(in srgb, var(--green-400) 65%, transparent);
      --greeting-text-color: var(--shade-50);
      --greeting-signoff-color: var(--orange-300);

      margin-top: min(var(--ni-64), 6vh);

      .greeting-banner {
        filter: var(--greeting-wobble);
        transform-origin: center bottom;
        animation: greeting-crooked 7s ease-in-out 1.7s infinite;
      }

      .greeting-title {
        rotate: -3deg;
      }
    }

    &[data-season="christmas"] {
      --title-gradient: linear-gradient(
        110deg,
        var(--yellow-100) 0%,
        var(--shade-10) 35%,
        var(--yellow-50) 50%,
        var(--shade-10) 65%,
        var(--yellow-200) 100%
      );
      --title-glow: var(--red-900);
      --greeting-text-color: var(--shade-50);
      --greeting-signoff-color: var(--yellow-300);

      margin-top: min(var(--ni-64), 6vh);

      .greeting-banner {
        padding: var(--ni-8) var(--ni-16);
        margin-block-end: var(--ni-16);
        margin-inline: var(--ni-32);

        border-radius: var(--border-radius-xs);
        background: linear-gradient(
          180deg,
          var(--red-400) 0%,
          var(--red-600) 55%,
          var(--red-800) 100%
        );
        box-shadow:
          inset 0 var(--ni-2) 0 var(--yellow-300),
          inset 0 calc(var(--ni-2) * -1) 0 var(--yellow-300),
          0 var(--ni-12) var(--ni-24)
            color-mix(in srgb, var(--shade-1000) 60%, transparent);

        animation: greeting-unfurl 700ms cubic-bezier(0.22, 1, 0.36, 1) 800ms
          both;
      }

      .ribbon-tail {
        position: absolute;
        top: var(--ni-16);
        bottom: calc(var(--ni-16) * -1);

        width: var(--ni-32);

        background: linear-gradient(180deg, var(--red-700), var(--red-900));
        box-shadow:
          inset 0 var(--ni-2) 0 var(--yellow-600),
          inset 0 calc(var(--ni-2) * -1) 0 var(--yellow-600);

        &.is-start {
          inset-inline-start: calc(var(--ni-32) * -1);
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 36% 50%);
        }

        &.is-end {
          inset-inline-end: calc(var(--ni-32) * -1);
          clip-path: polygon(0 0, 100% 0, 64% 50%, 100% 100%, 0 100%);
        }
      }

      .greeting-title {
        font-size: clamp(var(--ni-24), min(7.5vw, 8vh), var(--ni-56));
        font-style: italic;
        padding-inline: 0.12em;

        filter: blur(0) drop-shadow(0 var(--ni-2) 0 var(--title-glow));
      }
    }

    &[data-season="new-year"] {
      --title-gradient: linear-gradient(
        110deg,
        var(--yellow-300) 0%,
        var(--yellow-50) 30%,
        var(--orange-400) 45%,
        var(--yellow-100) 60%,
        var(--yellow-500) 100%
      );
      --title-glow: color-mix(in srgb, var(--yellow-500) 45%, transparent);
      --greeting-text-color: var(--yellow-50);
      --greeting-signoff-color: var(--yellow-300);

      .greeting-title {
        font-size: clamp(var(--ni-24), min(8vw, 7vh), var(--ni-48));
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
    }

    .greeting-year {
      font-size: clamp(var(--ni-48), min(22vw, 16vh), var(--ni-120));
      font-weight: 900;
      line-height: 1;
      letter-spacing: 0.02em;

      background: linear-gradient(
        180deg,
        var(--yellow-50) 0%,
        var(--yellow-300) 46%,
        var(--orange-700) 50%,
        var(--yellow-200) 72%,
        var(--yellow-500) 100%
      );
      background-clip: text;
      color: transparent;

      filter: blur(0) drop-shadow(0 var(--ni-2) 0 var(--orange-900))
        drop-shadow(
          0 0 var(--ni-24)
            color-mix(in srgb, var(--yellow-400) 50%, transparent)
        );

      animation: greeting-zoom 900ms cubic-bezier(0.34, 1.56, 0.64, 1) 700ms
        both;
    }

    .greeting-rule {
      position: relative;

      width: min(80%, var(--ni-240));
      height: var(--ni-2);

      background: linear-gradient(
        90deg,
        transparent,
        var(--yellow-400) 15% 44%,
        transparent 44% 56%,
        var(--yellow-400) 56% 85%,
        transparent
      );

      animation: greeting-rise 600ms ease-out 1000ms both;

      &::after {
        content: "";

        position: absolute;
        top: 50%;
        left: 50%;

        width: var(--ni-10);
        height: var(--ni-10);

        border: var(--ni-2) solid var(--yellow-400);
        transform: translate(-50%, -50%) rotate(45deg);
      }
    }

    &:dir(rtl) .greeting-title,
    &:dir(rtl) .greeting-signoff {
      letter-spacing: normal;
    }
  }

  @keyframes greeting-zoom {
    from {
      opacity: 0;
      transform: scale(2.4);
      filter: blur(var(--ni-12)) drop-shadow(0 0 0 transparent)
        drop-shadow(0 0 0 transparent);
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

  @keyframes greeting-unfurl {
    from {
      opacity: 0;
      clip-path: inset(0 50%);
    }
    to {
      opacity: 1;
      clip-path: inset(-100%);
    }
  }

  @keyframes greeting-crooked {
    0%,
    100% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(2deg) translateY(calc(var(--ni-4) * -1));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-seasonal-greeting .greeting-year,
    .trakt-seasonal-greeting .greeting-title,
    .trakt-seasonal-greeting .greeting-text,
    .trakt-seasonal-greeting .greeting-signoff,
    .trakt-seasonal-greeting .greeting-banner,
    .trakt-seasonal-greeting .greeting-rule {
      animation: none;
    }
  }
</style>
