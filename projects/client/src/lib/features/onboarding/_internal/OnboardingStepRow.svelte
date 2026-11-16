<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { m } from "$lib/features/i18n/messages.ts";
  import type { OnboardingResolvedStep } from "$lib/features/onboarding/models/OnboardingResolvedStep.ts";
  import ChevronIcon from "./icons/ChevronIcon.svelte";

  const {
    resolved,
    isFocus,
    onGo,
    onSkip,
    onUndo,
  }: {
    resolved: OnboardingResolvedStep;
    isFocus: boolean;
    onGo: () => void;
    onSkip: () => void;
    onUndo: () => void;
  } = $props();

  const step = $derived(resolved.step);
  const status = $derived(resolved.status);
  const Icon = $derived(step.icon);
  const action = $derived(step.action);
  const mode = $derived(
    status === "todo" && isFocus ? "focus" : status === "todo" ? "quiet" : status,
  );
</script>

<div class="trakt-onboarding-step" data-mode={mode}>
  <div class="step-row">
    <span class="step-icon">
      {#if status === "done"}
        <CheckIcon />
      {:else}
        <Icon />
      {/if}
    </span>
    <span class="step-text">
      <span class="step-title">{step.title()}</span>
      {#if mode === "focus"}
        <span class="step-hint">{step.hint()}</span>
      {:else if mode === "skipped"}
        <span class="step-hint">{m.onboarding_status_skipped()}</span>
      {/if}
    </span>
    <span class="step-side">
      {#if mode === "quiet" && step.skippable}
        <span class="step-skip">
          <Button
            label={m.button_label_onboarding_skip({ title: step.title() })}
            style="ghost"
            color="default"
            variant="secondary"
            size="small"
            onclick={onSkip}
          >
            {m.button_text_onboarding_skip()}
          </Button>
        </span>
      {/if}
      {#if mode === "quiet" && action}
        <Link
          href={action.href()}
          label={action.text()}
          color="inherit"
          underline="none"
          onclick={onGo}
        >
          <ChevronIcon />
        </Link>
      {/if}
      {#if mode === "skipped"}
        <Button
          label={m.button_label_onboarding_undo({ title: step.title() })}
          style="ghost"
          color="default"
          variant="secondary"
          size="small"
          onclick={onUndo}
        >
          {m.button_text_onboarding_undo()}
        </Button>
      {/if}
    </span>
  </div>
  {#if mode === "focus" && action}
    <div class="step-focus-actions">
      <Link
        href={action.href()}
        color="inherit"
        underline="none"
        onclick={onGo}
      >
        <span>{action.text()}</span>
        <ChevronIcon />
      </Link>
      {#if step.skippable}
        <span class="step-skip">
          <Button
            label={m.button_label_onboarding_skip({ title: step.title() })}
            style="ghost"
            color="default"
            variant="secondary"
            size="small"
            onclick={onSkip}
          >
            {m.button_text_onboarding_skip()}
          </Button>
        </span>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-onboarding-step {
    --step-glass-6: color-mix(in srgb, var(--color-foreground) 6%, transparent);
    --step-glass-8: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    --step-glass-12: color-mix(
      in srgb,
      var(--color-foreground) 12%,
      transparent
    );
    --step-glass-18: color-mix(
      in srgb,
      var(--color-foreground) 18%,
      transparent
    );

    position: relative;
    display: flex;
    flex-direction: column;
    padding: 0 var(--ni-14);
    border-radius: var(--border-radius-xl);
    transition:
      padding var(--transition-increment) cubic-bezier(0.4, 0, 0.2, 1),
      background var(--transition-increment);

    &[data-mode="focus"] {
      margin-block: var(--gap-xs);
      padding: var(--ni-18) var(--ni-18) var(--ni-18) var(--ni-14);
      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-foreground) 3.5%, transparent),
        transparent 85%
      );

      &::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 1px;
        background: linear-gradient(
          180deg,
          color-mix(in srgb, var(--color-foreground) 9%, transparent),
          color-mix(in srgb, var(--color-foreground) 2%, transparent) 55%,
          transparent
        );
        mask:
          linear-gradient(currentColor 0 0) content-box,
          linear-gradient(currentColor 0 0);
        mask-composite: exclude;
        pointer-events: none;
      }
    }
  }

  .step-row {
    display: flex;
    align-items: center;
    gap: var(--ni-14);
    min-height: var(--ni-52);

    [data-mode="focus"] & {
      min-height: var(--ni-40);
    }
  }

  .step-icon {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: var(--ni-28);
    height: var(--ni-28);
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px var(--step-glass-12);
    color: color-mix(in srgb, var(--color-foreground) 55%, transparent);
    transition: all var(--transition-increment) cubic-bezier(0.4, 0, 0.2, 1);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }

    [data-mode="focus"] & {
      width: var(--ni-40);
      height: var(--ni-40);
      background: var(--step-glass-6);
      box-shadow: inset 0 0 0 1px var(--step-glass-18);
      color: var(--color-text-primary);

      :global(svg) {
        width: var(--ni-18);
        height: var(--ni-18);
      }
    }

    [data-mode="done"] & {
      background: var(--step-glass-8);
      box-shadow: none;
      color: color-mix(in srgb, var(--color-foreground) 78%, transparent);
    }

    [data-mode="skipped"] & {
      box-shadow: none;
      outline: 1px dashed var(--step-glass-18);
      outline-offset: -1px;
    }
  }

  .step-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  .step-title {
    font-size: calc(var(--ni-14) + var(--ni-1));
    line-height: var(--ni-22);
    font-weight: 700;
    color: color-mix(in srgb, var(--color-foreground) 78%, transparent);
    transition: color var(--transition-increment);

    [data-mode="focus"] & {
      font-size: calc(var(--ni-16) + var(--ni-1));
      color: var(--color-text-primary);
    }

    [data-mode="done"] &,
    [data-mode="skipped"] & {
      color: color-mix(in srgb, var(--color-foreground) 45%, transparent);
    }

    [data-mode="skipped"] & {
      text-decoration: line-through;
      text-decoration-color: var(--step-glass-18);
    }
  }

  .step-hint {
    font-size: var(--ni-14);
    line-height: calc(var(--ni-18) + var(--ni-1));
    color: var(--color-text-secondary);
    text-wrap: pretty;
  }

  .step-side {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);
    flex-shrink: 0;
  }

  .step-side > :global(.trakt-link) {
    display: grid;
    place-items: center;
    width: var(--ni-36);
    height: var(--ni-36);
    border-radius: 50%;
    color: color-mix(in srgb, var(--color-foreground) 55%, transparent);
    transition:
      color var(--transition-increment),
      background var(--transition-increment);

    &:hover,
    &:focus-visible {
      color: var(--color-text-primary);
      background: var(--step-glass-6);
    }
  }

  .step-focus-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    margin-top: var(--ni-14);
    margin-inline-start: calc(var(--ni-40) + var(--ni-14));
  }

  .step-focus-actions > :global(.trakt-link) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    height: var(--ni-36);
    padding-inline: var(--ni-18) var(--ni-16);
    border-radius: var(--border-radius-xl);
    border: 1px solid var(--purple-400);
    background: color-mix(
      in srgb,
      var(--purple-500) 22%,
      var(--color-card-background)
    );
    color: var(--color-text-primary);
    font-size: var(--ni-14);
    font-weight: 700;
    white-space: nowrap;
    text-decoration: none;
    transition: background var(--transition-increment);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }

    &:hover,
    &:focus-visible {
      background: color-mix(
        in srgb,
        var(--purple-500) 34%,
        var(--color-card-background)
      );
    }
  }

  .step-skip {
    opacity: 0;
    transition: opacity var(--transition-increment);

    .trakt-onboarding-step:hover &,
    .trakt-onboarding-step:focus-within & {
      opacity: 1;
    }

    @include for-touch {
      opacity: 0.6;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .step-icon,
    .step-skip {
      transition: none;
    }
  }
</style>
