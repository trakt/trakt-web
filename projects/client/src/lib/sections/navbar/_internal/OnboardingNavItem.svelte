<script lang="ts">
  import { m } from "$lib/features/i18n/messages.ts";
  import { toOnboardingLabel } from "$lib/features/onboarding/toOnboardingLabel.ts";
  import OnboardingRing from "$lib/features/onboarding/OnboardingRing.svelte";
  import OnboardingSurfaces from "$lib/features/onboarding/OnboardingSurfaces.svelte";
  import { useOnboarding } from "$lib/features/onboarding/useOnboarding.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { collapse } from "$lib/utils/transitions/collapse.ts";
  import NavGroup from "./NavGroup.svelte";

  const { isCollapsed }: { isCollapsed: boolean } = $props();

  const { active, isDrawerOpen, openDrawer, trackerGlyph } = useOnboarding();

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const progress = $derived($active?.progress ?? null);
  const label = $derived(toOnboardingLabel(progress));
</script>

{#snippet iconOnboarding()}
  {#if progress}
    <OnboardingRing
      {progress}
      orbOrigin={$trackerGlyph}
      onFinished={$active?.dismiss}
    />
  {/if}
{/snippet}

{#if $active && progress}
  <div
    class="trakt-onboarding-nav-item"
    class:is-expanded={!isCollapsed}
    out:collapse|global={{
      duration: $isReducedMotion ? 0 : undefined,
      axis: "y",
    }}
  >
    <NavGroup
      onclick={openDrawer}
      {label}
      title={m.button_label_onboarding()}
      icon={iconOnboarding}
      {isCollapsed}
      isActive={$isDrawerOpen}
    />
  </div>

  <OnboardingSurfaces />
{/if}

<style>
  .trakt-onboarding-nav-item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    width: 100%;
  }
</style>
