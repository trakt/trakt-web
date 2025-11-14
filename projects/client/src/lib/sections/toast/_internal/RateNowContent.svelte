<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { LastWatchedItem } from "$lib/features/toast/models/LastWatchedItem";
  import { useLastWatched } from "$lib/features/toast/useLastWatched";
  import RateNow from "$lib/sections/summary/components/rating/RateNow.svelte";
  import { getToastTitle } from "./getToastTitle";
  import ToastItemCard from "./ToastItemCard.svelte";

  const { lastWatched }: { lastWatched: LastWatchedItem } = $props();

  const { dismiss } = useLastWatched();

  const title = $derived(getToastTitle(lastWatched));
</script>

<div class="trakt-now-playing-container">
  <ToastItemCard item={lastWatched} />

  <div class="trakt-now-playing-content">
    <div class="trakt-rate-now-header">
      <p class="smaller ellipsis">{title}</p>
      <ActionButton
        onclick={() => dismiss(lastWatched.media.id, lastWatched.type)}
        label={m.button_label_dismiss()}
        style="ghost"
        size="small"
      >
        <CloseIcon />
      </ActionButton>
    </div>
    <div class="trakt-rate-now-container">
      <RateNow {...lastWatched} variant="allow" />
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

    :global(.trakt-action-button) {
      margin-top: var(--ni-neg-14);
    }
  }

  .trakt-rate-now-container {
    :global(.trakt-rate-now) {
      justify-content: space-between;
    }

    :global(h6) {
      font-size: var(--ni-18);
      text-transform: capitalize;
    }

    :global(svg) {
      --icon-color: var(--color-foreground);
    }

    :global(.is-current-rating svg) {
      --icon-fill-color: var(--color-foreground);
    }
  }
</style>
