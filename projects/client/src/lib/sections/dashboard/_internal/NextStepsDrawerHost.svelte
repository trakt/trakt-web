<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { useActionToast } from "$lib/features/action-toast/useActionToast.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { NextStepId } from "$lib/features/next-steps/NextStepId.ts";
  import { useNextSteps } from "$lib/features/next-steps/stores/useNextSteps.ts";
  import NextStepIcon from "./NextStepIcon.svelte";
  import NextStepsRing from "./NextStepsRing.svelte";
  import { toNextStepEntry } from "./toNextStepEntry.ts";

  const { onClose }: { onClose: () => void } = $props();

  const { state: nextSteps, dismiss, skip, unskip } = useNextSteps();
  const { notify } = useActionToast();

  $effect(() => {
    if ($nextSteps.status !== "hidden") return;
    onClose();
  });

  const handleSkip = (id: NextStepId) => {
    skip(id);
    notify({
      message: m.action_toast_next_step_skipped(),
      action: {
        text: m.button_text_undo(),
        label: m.button_label_undo_skip_next_step(),
        onAction: () => unskip(id),
      },
    });
  };
</script>

<Drawer {onClose} title={m.header_next_steps()} size="auto">
  {#snippet leading()}
    {#if $nextSteps.status === "visible"}
      <NextStepsRing
        completed={$nextSteps.page.completed}
        total={$nextSteps.page.total}
      />
    {/if}
  {/snippet}

  {#snippet footer()}
    <div class="trakt-next-steps-footer">
      <Button
        label={m.button_text_skip_all_next_steps()}
        onclick={dismiss}
        variant="secondary"
        style="ghost"
        size="small"
      >
        {m.button_text_skip_all_next_steps()}
      </Button>
    </div>
  {/snippet}

  {#if $nextSteps.status === "visible"}
    <ul class="trakt-next-steps-list">
      {#each $nextSteps.page.steps as step (step.id)}
        {@const entry = toNextStepEntry(step.id)}
        <li class="next-step" class:is-done={step.isDone}>
          {#if step.isDone}
            <div class="next-step-row">
              <span class="next-step-icon">
                <CheckIcon />
              </span>
              <span class="bold next-step-label">{entry.label}</span>
              <span class="next-step-status">{m.text_next_step_done()}</span>
            </div>
          {:else}
            <div class="next-step-row">
              <div class="next-step-main">
                <Link href={entry.href}>
                  <div class="next-step-link">
                    <span class="next-step-icon">
                      <NextStepIcon id={step.id} />
                    </span>
                    <span class="bold next-step-label">{entry.label}</span>
                  </div>
                </Link>
              </div>
              <ActionButton
                label={m.button_label_skip_next_step({ step: entry.label })}
                onclick={() => handleSkip(step.id)}
                style="ghost"
                variant="secondary"
                size="small"
              >
                <CloseIcon />
              </ActionButton>
              <div class="next-step-arrow" aria-hidden="true">
                <Link href={entry.href} focusable={false}>
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</Drawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-next-steps-list {
    list-style: none;
    margin: 0;
    padding: 0;

    display: flex;
    flex-direction: column;

    :global(.trakt-link) {
      display: block;
      text-decoration: none;
    }
  }

  .next-step {
    border-bottom: var(--ni-1) solid var(--color-border);

    &:last-child {
      border-bottom: none;
    }
  }

  .next-step-row {
    min-height: var(--ni-60);

    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }

  .next-step-icon {
    width: var(--ni-36);
    height: var(--ni-36);
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: var(--border-radius-m);
    background: var(--color-streak-surface);
    box-shadow: var(--shadow-floating);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }

  .next-step-link {
    min-height: var(--ni-60);

    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }

  .next-step-main {
    flex: 1;
    min-width: 0;
  }

  .next-step-label {
    flex: 1;
    min-width: 0;
  }

  .next-step-arrow {
    display: flex;
    flex-shrink: 0;
    color: var(--color-text-secondary);

    :global(svg) {
      display: block;
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .trakt-next-steps-footer {
    display: flex;
    justify-content: center;
  }

  .next-step-status {
    @include visually-hidden;
  }

  .next-step.is-done {
    .next-step-icon {
      color: var(--color-streak-day);
    }

    .next-step-label {
      color: var(--color-text-secondary);
      text-decoration: line-through;
    }
  }
</style>
