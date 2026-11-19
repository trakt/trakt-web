<script lang="ts">
  import { toOnboardingLabel } from "$lib/features/onboarding/toOnboardingLabel.ts";
  import OnboardingRing from "$lib/features/onboarding/OnboardingRing.svelte";
  import OnboardingSurfaces from "$lib/features/onboarding/OnboardingSurfaces.svelte";
  import { useOnboarding } from "$lib/features/onboarding/useOnboarding.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { collapse } from "$lib/utils/transitions/collapse.ts";

  const { active, openDrawer, trackerGlyph } = useOnboarding();

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const progress = $derived($active?.progress ?? null);
  const label = $derived(toOnboardingLabel(progress));
</script>

{#if $active && progress}
  <button
    class="trakt-onboarding-mobile-nav-item"
    type="button"
    aria-label={label}
    onclick={openDrawer}
    out:collapse|global={{
      duration: $isReducedMotion ? 0 : undefined,
      axis: "x",
    }}
  >
    <OnboardingRing
      {progress}
      orbOrigin={$trackerGlyph}
      onFinished={$active?.dismiss}
    />
  </button>

  <OnboardingSurfaces />
{/if}

<style>
  .trakt-onboarding-mobile-nav-item {
    --nav-icon-size: var(--ni-24);
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--ni-60);
    height: 100%;
    padding: 0;
    border: none;
    background: none;
    color: var(--color-text-primary);
    font: inherit;
    cursor: pointer;

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--purple-300);
      outline-offset: var(--ni-2);
      border-radius: var(--border-radius-s);
    }
  }
</style>
