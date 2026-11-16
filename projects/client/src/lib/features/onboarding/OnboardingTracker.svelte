<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import { onDestroy } from "svelte";
  import type { OnboardingSetProgress } from "./models/OnboardingSetProgress.ts";

  const {
    progress,
    trackedStepId,
    isDrawerOpen,
    onClear,
    onUntrack,
    onGlyph,
  }: {
    progress: OnboardingSetProgress;
    trackedStepId: string | null;
    isDrawerOpen: boolean;
    onClear: () => void;
    onUntrack: () => void;
    onGlyph: (element: Element | null) => void;
  } = $props();

  const COMPLETE_MS = 420;

  function escapeRail(element: HTMLElement) {
    document.body.appendChild(element);
    return {
      destroy: () => element.remove(),
    };
  }

  let glyph: HTMLSpanElement | undefined = $state();
  let completingStepId = $state<string | null>(null);
  let completeTimeout: ReturnType<typeof setTimeout> | null = null;

  const trackedIndex = $derived(
    progress.steps.findIndex(({ step }) => step.id === trackedStepId),
  );
  const tracked = $derived(
    trackedIndex >= 0 ? (progress.steps.at(trackedIndex) ?? null) : null,
  );
  const isCompleting = $derived(
    tracked != null && completingStepId === tracked.step.id,
  );
  const isVisible = $derived(
    tracked != null && !isDrawerOpen && !progress.isEarned &&
      (tracked.status === "todo" || isCompleting),
  );
  const Icon = $derived(tracked?.step.icon ?? null);

  $effect(() => {
    onGlyph(isVisible ? (glyph ?? null) : null);
  });

  $effect(() => {
    if (!tracked || tracked.status !== "done" || completingStepId) return;
    completingStepId = tracked.step.id;
    if (completeTimeout) clearTimeout(completeTimeout);
    completeTimeout = setTimeout(() => {
      completingStepId = null;
      onClear();
    }, COMPLETE_MS);
  });

  onDestroy(() => {
    if (completeTimeout) clearTimeout(completeTimeout);
    onGlyph(null);
  });
</script>

{#if tracked}
  <div
    class="trakt-onboarding-tracker"
    use:escapeRail
    class:is-visible={isVisible}
    class:is-completing={isCompleting}
    role="status"
    aria-hidden={!isVisible}
  >
    <div class="tracker-bar">
      <span class="tracker-glyph" bind:this={glyph}>
        {#if isCompleting}
          <CheckIcon />
        {:else if Icon}
          <Icon />
        {/if}
      </span>
      <div class="tracker-text">
        <div class="tracker-kicker-row">
          <span class="tracker-kicker">
            {m.onboarding_tracker_step({
              index: trackedIndex + 1,
              total: progress.total,
            })}
          </span>
          <span class="tracker-pips">
            {#each progress.steps as resolved, index (resolved.step.id)}
              <span
                class="tracker-pip"
                data-tone={resolved.status === "done"
                  ? "done"
                  : index === trackedIndex
                  ? "focus"
                  : "rest"}
              ></span>
            {/each}
          </span>
        </div>
        <span class="tracker-objective">
          {isCompleting
            ? tracked.step.title()
            : tracked.step.objective?.() ?? tracked.step.title()}
        </span>
      </div>
      <span class="tracker-count">
        {m.onboarding_tracker_count({ done: isCompleting ? 1 : 0, total: 1 })}
      </span>
      <button
        class="tracker-dismiss"
        type="button"
        aria-label={m.button_label_onboarding_stop_tracking()}
        onclick={onUntrack}
      >
        <CloseIcon />
      </button>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(:root:has(.trakt-onboarding-tracker.is-visible)) {
    --layout-bottom-dock-height: calc(var(--ni-72) + var(--gap-l));

    @include for-mobile {
      --layout-bottom-dock-height: calc(var(--ni-64) + var(--gap-s));
    }
  }

  .trakt-onboarding-tracker {
    --tracker-glass-5: color-mix(in srgb, var(--color-foreground) 5%, transparent);
    --tracker-glass-7: color-mix(in srgb, var(--color-foreground) 7%, transparent);
    --tracker-glass-10: color-mix(
      in srgb,
      var(--color-foreground) 10%,
      transparent
    );

    position: fixed;
    inset-inline: 0;
    bottom: var(--gap-l);
    z-index: var(--layer-floating);
    display: flex;
    justify-content: center;
    padding-inline: var(--gap-m);
    padding-inline-start: calc(var(--side-navbar-width, 0px) + var(--gap-m));
    --tracker-collapse-ms: 340ms;

    pointer-events: none;
    opacity: 0;
    transform: translateY(var(--ni-24)) scale(0.96);
    transition:
      opacity 320ms,
      transform 520ms cubic-bezier(0.3, 1.25, 0.5, 1);

    &.is-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    @include for-mobile {
      bottom: calc(var(--mobile-navbar-height, var(--ni-56)) + var(--gap-xs));
      padding-inline: var(--gap-xs);
    }
  }

  .tracker-bar {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--ni-14);
    --tracker-bar-height: var(--ni-72);
    --tracker-glyph-size: var(--ni-44);
    --tracker-bar-padding-start: var(--ni-14);
    --tracker-bar-radius: var(--ni-22);
    --tracker-collapse-inset-block: calc(
      (var(--tracker-bar-height) - var(--tracker-glyph-size)) / 2
    );

    width: min(var(--ni-640), 100%);
    height: var(--tracker-bar-height);
    padding: 0 var(--ni-12) 0 var(--ni-14);
    border-radius: var(--tracker-bar-radius);
    background: color-mix(in srgb, var(--color-card-background) 92%, transparent);
    backdrop-filter: blur(var(--ni-14));
    box-shadow:
      inset 0 1px 0 var(--tracker-glass-10),
      inset 0 0 0 1px var(--tracker-glass-7),
      0 var(--ni-18) var(--ni-40) color-mix(in srgb, var(--color-shadow) 50%, transparent);

    .is-completing & {
      animation: tracker-collapse var(--tracker-collapse-ms)
        cubic-bezier(0.5, 0, 0.2, 1) forwards;

      &:dir(rtl) {
        animation-name: tracker-collapse-rtl;
      }
    }

    @include for-mobile {
      --tracker-bar-height: var(--ni-64);
      --tracker-glyph-size: var(--ni-40);
      --tracker-bar-padding-start: var(--ni-10);
      --tracker-bar-radius: var(--ni-20);

      gap: var(--ni-12);
      padding: 0 var(--ni-4) 0 var(--ni-10);
    }
  }

  @keyframes tracker-collapse {
    from {
      clip-path: inset(0 0 0 0 round var(--tracker-bar-radius));
    }

    to {
      clip-path: inset(
        var(--tracker-collapse-inset-block)
          calc(100% - var(--tracker-bar-padding-start) - var(--tracker-glyph-size))
          var(--tracker-collapse-inset-block)
          var(--tracker-bar-padding-start)
          round 50%
      );
    }
  }

  @keyframes tracker-collapse-rtl {
    from {
      clip-path: inset(0 0 0 0 round var(--tracker-bar-radius));
    }

    to {
      clip-path: inset(
        var(--tracker-collapse-inset-block)
          var(--tracker-bar-padding-start)
          var(--tracker-collapse-inset-block)
          calc(100% - var(--tracker-bar-padding-start) - var(--tracker-glyph-size))
          round 50%
      );
    }
  }

  .tracker-glyph {
    position: relative;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: var(--tracker-glyph-size);
    height: var(--tracker-glyph-size);
    border-radius: 50%;
    background: var(--tracker-glass-5);
    box-shadow: inset 0 0 0 1.5px
      color-mix(in srgb, var(--color-accent-purple) 55%, transparent);
    color: var(--color-text-primary);
    transition: background 300ms;

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }

    .is-completing & {
      background: var(--color-background-purple);
      box-shadow: 0 0 var(--ni-20)
        color-mix(in srgb, var(--color-accent-purple) 60%, transparent);
      color: var(--color-foreground-purple);
      animation: tracker-glyph-leave var(--tracker-collapse-ms)
        cubic-bezier(0.5, 0, 0.2, 1) forwards;
    }
  }

  @keyframes tracker-glyph-leave {
    from {
      opacity: 1;
      transform: scale(1);
    }

    to {
      opacity: 0;
      transform: scale(0.4);
    }
  }

  @keyframes tracker-content-leave {
    to {
      opacity: 0;
    }
  }

  .is-completing {
    .tracker-text,
    .tracker-count,
    .tracker-dismiss {
      animation: tracker-content-leave 140ms ease-out forwards;
    }
  }

  .tracker-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-3);
  }

  .tracker-kicker-row {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .tracker-kicker {
    font-size: var(--ni-11);
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--color-foreground) 55%, transparent);
    white-space: nowrap;

    .is-completing & {
      color: var(--purple-200);
    }
  }

  .tracker-pips {
    display: flex;
    gap: var(--ni-3);
  }

  .tracker-pip {
    width: var(--ni-14);
    height: var(--ni-4);
    border-radius: var(--ni-2);
    background: var(--tracker-glass-10);
    transition: background 300ms;

    &[data-tone="done"] {
      background: var(--color-accent-purple);
    }

    &[data-tone="focus"] {
      background: color-mix(in srgb, var(--color-accent-purple) 38%, transparent);
    }

    @include for-mobile {
      width: var(--ni-10);
    }
  }

  .tracker-objective {
    font-size: var(--ni-16);
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-text-primary);

    @include for-mobile {
      font-size: calc(var(--ni-14) + var(--ni-1));
    }
  }

  .tracker-count {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    height: var(--ni-28);
    min-width: var(--ni-44);
    padding-inline: var(--ni-10);
    border-radius: var(--border-radius-xl);
    background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
    font-size: calc(var(--ni-12) + var(--ni-1));
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    transition: background 300ms;

    .is-completing & {
      background: var(--color-background-purple);
      color: var(--color-foreground-purple);
    }
  }

  .tracker-dismiss {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: var(--ni-36);
    height: var(--ni-36);
    padding: 0;
    border: none;
    border-radius: 50%;
    background: none;
    color: color-mix(in srgb, var(--color-foreground) 55%, transparent);
    cursor: pointer;
    transition:
      color var(--transition-increment),
      background var(--transition-increment);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }

    &:hover,
    &:focus-visible {
      color: var(--color-text-primary);
      background: color-mix(in srgb, var(--color-foreground) 6%, transparent);
    }

    @include for-mobile {
      width: var(--ni-44);
      height: var(--ni-44);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-onboarding-tracker {
      transition: none;

      &.is-completing {
        opacity: 0;
        transition: opacity 200ms;
      }
    }

    .is-completing {
      .tracker-bar,
      .tracker-glyph,
      .tracker-text,
      .tracker-count,
      .tracker-dismiss {
        animation: none;
      }
    }
  }
</style>
