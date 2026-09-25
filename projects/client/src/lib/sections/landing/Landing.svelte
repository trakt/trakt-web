<script lang="ts">
  import Logo from "$lib/components/logo/Logo.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import JoinForFreeButton from "./components/JoinForFreeButton.svelte";
  import LandingApps from "./components/LandingApps.svelte";
  import LandingPillars from "./components/LandingPillars.svelte";
  import LoginButton from "./components/LoginButton.svelte";
  import SpotlightBackdrop from "./components/SpotlightBackdrop.svelte";
  import SpotlightStack from "./components/SpotlightStack.svelte";
  import { useSpotlightItems } from "./useSpotlightItems.ts";
  import { useSpotlightTick } from "./useSpotlightTick.ts";

  const { items } = useSpotlightItems();
  const tick = useSpotlightTick();

  const active = $derived($items.length > 0 ? $tick % $items.length : 0);
</script>

<div class="trakt-landing">
  <section class="landing-hero">
    <SpotlightBackdrop items={$items} {active} />

    <header class="landing-nav">
      <div class="landing-logo" data-boot-target>
        <Logo />
      </div>
      <LoginButton />
    </header>

    <div class="hero-content">
      <div class="hero-copy">
        <span class="hero-chip small">{m.text_landing_platforms()}</span>
        <h1 class="hero-title">{m.header_landing_hero()}</h1>
        <p class="hero-subtitle">{m.text_landing_hero()}</p>
        <div class="hero-actions">
          <JoinForFreeButton />
          <LoginButton size="normal" />
        </div>
      </div>

      <SpotlightStack items={$items} {active} />
    </div>
  </section>

  <LandingPillars />
  <LandingApps />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-landing {
    --landing-color-muted: color-mix(in srgb, var(--shade-10) 72%, transparent);
    --landing-color-faint: color-mix(in srgb, var(--shade-10) 45%, transparent);
    --landing-color-border: color-mix(in srgb, var(--shade-10) 9%, transparent);
    --landing-color-stroke: color-mix(in srgb, var(--shade-10) 16%, transparent);
    --landing-radius-pill: var(--ni-104);

    min-height: 100dvh;
    overflow-x: hidden;

    color: var(--shade-10);
    background-color: var(--shade-940);
  }

  .landing-hero {
    position: relative;
    overflow: hidden;

    background-color: var(--shade-920);
    background-image:
      radial-gradient(
        72% 55% at 50% 110%,
        color-mix(in srgb, var(--purple-500) 42%, transparent),
        transparent 70%
      ),
      linear-gradient(
        180deg,
        var(--shade-900) 0%,
        var(--shade-800) 45%,
        var(--purple-900) 100%
      );

    @include for-tablet-sm-and-below {
      display: flex;
      flex-direction: column;

      min-height: 100svh;
    }
  }

  .landing-nav {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: var(--ni-28) var(--ni-40);
    padding-top: calc(var(--ni-28) + env(safe-area-inset-top, 0px));

    .landing-logo {
      display: flex;
    }

    :global(svg) {
      height: var(--ni-32);
      width: auto;
    }

    @include for-tablet-sm-and-below {
      padding: var(--ni-20);
      padding-top: calc(var(--ni-20) + env(safe-area-inset-top, 0px));

      :global(svg) {
        height: var(--ni-28);
      }
    }
  }

  .hero-content {
    position: relative;

    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    align-items: center;
    gap: var(--gap-xxl);

    max-width: var(--ni-1280);
    margin-inline: auto;
    padding: var(--ni-40) var(--ni-80) var(--ni-96);

    @include for-tablet-lg-and-below {
      padding: var(--ni-24) var(--ni-40) var(--ni-72);
    }

    @include for-tablet-sm-and-below {
      flex: 1;
      grid-template-columns: minmax(0, 1fr);
      align-content: center;
      gap: var(--gap-l);

      padding: 0 var(--ni-20)
        calc(var(--ni-80) + env(safe-area-inset-bottom, 0px));

      :global(.trakt-landing-spotlight) {
        order: -1;
      }
    }
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-l);

    @include for-tablet-sm-and-below {
      align-items: center;
      gap: var(--gap-m);

      text-align: center;
    }
  }

  .hero-chip {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    padding: var(--ni-6) var(--ni-14);
    border: var(--ni-1) solid var(--landing-color-stroke);
    border-radius: var(--landing-radius-pill);

    background: color-mix(in srgb, var(--shade-940) 60%, transparent);
    color: var(--landing-color-muted);

    @include backdrop-filter-blur(var(--ni-10));

    &::before {
      content: "";

      width: var(--ni-6);
      height: var(--ni-6);
      border-radius: 50%;

      background: var(--purple-400);
      box-shadow: 0 0 var(--ni-10) var(--purple-400);
    }
  }

  .hero-title {
    font-size: var(--ni-88);
    font-weight: 900;
    line-height: 0.96;
    letter-spacing: -0.05em;
    text-wrap: balance;

    @include for-tablet-lg-and-below {
      font-size: var(--ni-64);
    }

    @include for-tablet-sm-and-below {
      font-size: var(--ni-44);
    }
  }

  .hero-subtitle {
    max-width: var(--ni-480);

    font-size: var(--ni-18);
    color: var(--landing-color-muted);

    @include for-tablet-sm-and-below {
      font-size: var(--ni-16);
    }
  }

  .hero-actions {
    display: flex;
    gap: var(--gap-s);

    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-self: stretch;
    }
  }
</style>
