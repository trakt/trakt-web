<script lang="ts">
  import type { OnboardingStepStatus } from "$lib/features/onboarding/models/OnboardingStepStatus.ts";

  const {
    statuses,
    focusIndex,
  }: {
    statuses: ReadonlyArray<OnboardingStepStatus>;
    focusIndex: number;
  } = $props();

  const segments = $derived(
    statuses.map((status, index) => {
      const isDone = status === "done";
      const joinsPrevious = isDone && statuses.at(index - 1) === "done" &&
        index > 0;
      const joinsNext = isDone && statuses.at(index + 1) === "done";
      return {
        key: index,
        tone: isDone ? "done" : index === focusIndex ? "focus" : "rest",
        joinsPrevious,
        joinsNext,
      };
    }),
  );
</script>

<div class="trakt-onboarding-segments">
  {#each segments as segment (segment.key)}
    <span
      class="segment"
      data-tone={segment.tone}
      class:joins-previous={segment.joinsPrevious}
      class:joins-next={segment.joinsNext}
    ></span>
  {/each}
</div>

<style>
  .trakt-onboarding-segments {
    --segment-done: var(--color-accent-purple);
    display: flex;
    gap: var(--ni-4);
  }

  .segment {
    flex: 1;
    height: var(--ni-6);
    border-radius: var(--ni-3);
    background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    transition:
      margin var(--transition-increment) cubic-bezier(0.4, 0, 0.2, 1),
      border-radius var(--transition-increment),
      background var(--transition-increment);

    &[data-tone="done"] {
      background: var(--segment-done);
    }

    &[data-tone="focus"] {
      background: color-mix(in srgb, var(--color-accent-purple) 32%, transparent);
    }

    &.joins-previous {
      border-start-start-radius: 0;
      border-end-start-radius: 0;
      margin-inline-start: calc(var(--ni-4) * -1);
    }

    &.joins-next {
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }
  }
</style>
