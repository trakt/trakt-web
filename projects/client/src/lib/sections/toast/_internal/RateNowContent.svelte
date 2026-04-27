<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import AutoCloseButton from "$lib/components/buttons/AutoCloseButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { m } from "$lib/features/i18n/messages";
  import type { LastWatchedItem } from "$lib/features/toast/models/LastWatchedItem";
  import { useLastWatched } from "$lib/features/toast/useLastWatched";
  import RateNow from "$lib/sections/summary/components/rating/RateNow.svelte";
  import { time } from "$lib/utils/timing/time.ts";
  import { getToastTitle } from "./getToastTitle";
  import ToastItemCard from "./ToastItemCard.svelte";

  const lingerDuration = time.seconds(5);

  const { lastWatched }: { lastWatched: LastWatchedItem } = $props();

  let interactionCounter = $state(0);

  const { dismiss, suppress, isAtLimit } = useLastWatched();

  const { confirm } = useConfirm();
  const confirmSuppression = confirm({
    type: ConfirmationType.SuppressRatingsToast,
    onConfirm: suppress,
  });

  const title = $derived(getToastTitle(lastWatched));

  const handleDismiss = () => {
    dismiss(lastWatched.media.id, lastWatched.type, "manual");
  };
</script>

<div class="trakt-now-playing-container">
  <ToastItemCard item={lastWatched} />

  <div class="trakt-now-playing-content">
    <div class="trakt-rate-now-header">
      <p class="ellipsis">{title}</p>
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
    <div class="trakt-rate-now-container">
      <RateNow
        {...lastWatched}
        variant="allow"
        onclick={() => (interactionCounter += 1)}
      />
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
    align-items: center;
  }

  .trakt-rate-now-container {
    :global(.trakt-rate-now) {
      justify-content: space-between;
    }

    :global(svg) {
      --icon-color: var(--color-foreground);
    }

    :global(.is-current-rating svg) {
      --icon-fill-color: var(--color-foreground);
    }
  }
</style>
