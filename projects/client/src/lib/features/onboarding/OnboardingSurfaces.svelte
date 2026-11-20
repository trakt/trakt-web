<script lang="ts">
  import OnboardingDrawer from "$lib/features/onboarding/OnboardingDrawer.svelte";
  import OnboardingTracker from "$lib/features/onboarding/OnboardingTracker.svelte";
  import { useOnboarding } from "$lib/features/onboarding/useOnboarding.ts";

  const { active, isDrawerOpen, closeDrawer, setTrackerGlyph } =
    useOnboarding();
</script>

{#if $active}
  <OnboardingTracker
    progress={$active.progress}
    trackedStepId={$active.trackedStepId}
    isDrawerOpen={$isDrawerOpen}
    onClear={$active.clearTracked}
    onUntrack={$active.untrack}
    onGlyph={setTrackerGlyph}
  />

  {#if $isDrawerOpen}
    <OnboardingDrawer
      active={$active}
      onClose={closeDrawer}
      onTrack={$active.track}
    />
  {/if}
{/if}
