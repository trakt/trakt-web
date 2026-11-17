<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import OnboardingProgressSegments from "./_internal/OnboardingProgressSegments.svelte";
  import OnboardingStepRow from "./_internal/OnboardingStepRow.svelte";
  import type { ActiveOnboarding } from "./models/ActiveOnboarding.ts";

  const {
    active,
    onClose,
    onTrack,
  }: {
    active: ActiveOnboarding;
    onClose: () => void;
    onTrack: (stepId: string) => void;
  } = $props();

  const progress = $derived(active.progress);
  const statuses = $derived(progress.steps.map(({ status }) => status));
  const focusIndex = $derived(statuses.indexOf("todo"));
</script>

<Drawer {onClose} title={m.button_label_onboarding()}>
  <div class="trakt-onboarding-drawer">
    <header class="onboarding-header">
      <div class="onboarding-heading">
        <span class="onboarding-eyebrow">{progress.set.title()}</span>
        <span class="onboarding-subtitle">{progress.set.subtitle()}</span>
      </div>
      <span class="onboarding-count">
        {#key progress.done}
          <span class="count-done">{progress.done}</span>
        {/key}
        <span class="count-total">{m.onboarding_progress_of_total({ total: progress.total })}</span>
      </span>
    </header>

    <div
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax={progress.total}
      aria-valuenow={progress.done}
      aria-label={m.onboarding_progress_count({
        done: progress.done,
        total: progress.total,
      })}
    >
      <OnboardingProgressSegments {statuses} {focusIndex} />
    </div>

    <div class="onboarding-steps">
      {#each progress.steps as resolved, index (resolved.step.id)}
        <OnboardingStepRow
          {resolved}
          isFocus={index === focusIndex}
          onGo={() => {
            onTrack(resolved.step.id);
            onClose();
          }}
          onSkip={() => active.skip(resolved.step.id)}
          onUndo={() => active.unskip(resolved.step.id)}
        />
      {/each}
    </div>
  </div>
</Drawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-onboarding-drawer {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .onboarding-header {
    display: flex;
    align-items: flex-end;
    gap: var(--gap-m);
  }

  .onboarding-heading {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
  }

  .onboarding-eyebrow {
    font-size: var(--ni-12);
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--color-foreground) 55%, transparent);
  }

  .onboarding-subtitle {
    font-size: calc(var(--ni-14) + var(--ni-1));
    line-height: var(--ni-20);
    color: var(--color-text-secondary);
    text-wrap: pretty;
  }

  .onboarding-count {
    display: flex;
    align-items: baseline;
    gap: var(--ni-4);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .count-done {
    font-size: var(--ni-30);
    line-height: var(--ni-32);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text-primary);
    animation: onboarding-count-pop 420ms var(--transition-spring-ease);
  }

  .count-total {
    font-size: calc(var(--ni-14) + var(--ni-1));
    font-weight: 700;
    color: color-mix(in srgb, var(--color-foreground) 45%, transparent);
  }

  [role="progressbar"] {
    margin-top: var(--ni-14);
  }

  .onboarding-steps {
    display: flex;
    flex-direction: column;
    margin-top: var(--gap-l);
  }

  @keyframes onboarding-count-pop {
    0% {
      opacity: 0;
      transform: translateY(var(--ni-6)) scale(0.8);
    }
    60% {
      opacity: 1;
      transform: translateY(0) scale(1.08);
    }
    100% {
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .count-done {
      animation: none;
    }
  }

</style>
