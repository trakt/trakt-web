<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import AutoCloseButton from "$lib/components/buttons/AutoCloseButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { m } from "$lib/features/i18n/messages";
  import type { LastWatchedItem } from "$lib/features/toast/models/LastWatchedItem";
  import { useLastWatched } from "$lib/features/toast/useLastWatched";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";
  import RateNow from "$lib/sections/summary/components/rating/RateNow.svelte";
  import { shuffle } from "$lib/utils/array/shuffle";
  import { time } from "$lib/utils/timing/time.ts";
  import { getToastTitle } from "./getToastTitle";
  import ToastItemCard from "./ToastItemCard.svelte";

  const lingerDuration = time.seconds(3);

  const { lastWatched }: { lastWatched: LastWatchedItem } = $props();

  let interactionCounter = $state(0);

  const { dismiss, suppress, isAtLimit } = useLastWatched();

  const { confirm } = useConfirm();
  const confirmSuppression = confirm({
    type: ConfirmationType.SuppressRatingsToast,
    onConfirm: suppress,
  });

  const ratingPrompts = [
    m.text_rating_prompt_1(),
    m.text_rating_prompt_2(),
    m.text_rating_prompt_3(),
    m.text_rating_prompt_4(),
    m.text_rating_prompt_5(),
    m.text_rating_prompt_6(),
    m.text_rating_prompt_7(),
    m.text_rating_prompt_8(),
  ] as const;

  const title = $derived(getToastTitle(lastWatched));
  const ratingPrompt = $derived(shuffle(ratingPrompts).at(0));

  // The prompt only appears right after marking as watched, so it doubles as
  // the "marked by mistake?" escape hatch - undoing removes it from history.
  const { removeWatched } = $derived(useMarkAsWatched(lastWatched));

  const handleDismiss = () => {
    dismiss(lastWatched.media.id, lastWatched.type, "manual");
  };

  const handleMarkedByMistake = () => {
    void removeWatched();
    handleDismiss();
  };
</script>

<div class="trakt-now-playing-container">
  <ToastItemCard item={lastWatched} />

  <div class="trakt-now-playing-content">
    <div class="trakt-rate-now-header">
      <div class="trakt-rate-now-titles">
        <span class="trakt-verdict secondary">{ratingPrompt}</span>
        <p class="trakt-title ellipsis bold">{title}</p>
      </div>
      <div class="trakt-rate-now-actions">
        {#if interactionCounter > 0}
          {#key interactionCounter}
            <AutoCloseButton
              onclick={handleDismiss}
              label={m.button_label_dismiss()}
              durationMs={lingerDuration}
            />
          {/key}
        {:else}
          <ActionButton
            onclick={() => {
              handleDismiss();
              if (!$isAtLimit) {
                return;
              }

              confirmSuppression();
            }}
            label={m.button_label_dismiss()}
            style="ghost"
            size="small"
          >
            <CloseIcon />
          </ActionButton>
        {/if}
      </div>
    </div>
    <div class="trakt-rate-now-container">
      <RateNow
        {...lastWatched}
        variant="allow"
        style="minimal"
        onclick={() => (interactionCounter += 1)}
      />
    </div>

    <div class="trakt-marked-by-mistake">
      <span class="secondary">{m.text_marked_by_mistake()}</span>
      <button
        type="button"
        class="mistake-undo-link"
        aria-label={m.action_toast_label_undo()}
        onclick={handleMarkedByMistake}
      >
        {m.button_text_undo()}
      </button>
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-now-playing-container {
    display: flex;
    gap: var(--gap-m);

    width: 100%;
  }

  .trakt-now-playing-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    flex-grow: 1;
    min-width: 0;
    gap: var(--gap-xxs);
  }

  .trakt-rate-now-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--gap-m);
  }

  .trakt-rate-now-titles {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    flex: 1;
    min-width: 0;
  }

  .trakt-rate-now-container {
    :global(.trakt-rate-now) {
      justify-content: flex-start;
    }

    :global(svg) {
      --icon-color: var(--color-foreground);
    }

    :global(.is-current-rating svg) {
      --icon-fill-color: var(--color-foreground);
    }
  }

  .trakt-marked-by-mistake {
    display: flex;
    align-items: baseline;
    gap: var(--gap-xxs);

    font-size: var(--font-size-text-small);
  }

  .mistake-undo-link {
    all: unset;

    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    color: var(--color-link-active);
    font-weight: 600;

    text-decoration-line: underline;
    text-underline-offset: var(--ni-2);
    text-decoration-thickness: var(--border-thickness-xs);

    border-radius: var(--border-radius-xs);

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }
  }
</style>
