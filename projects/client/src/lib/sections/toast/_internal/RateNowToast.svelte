<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { LastWatchedItem } from "$lib/features/toast/models/LastWatchedItem";
  import { useLastWatched } from "$lib/features/toast/useLastWatched";
  import { useIsRateable } from "$lib/sections/summary/components/rating/_internal/useIsRateable";
  import RateNow from "$lib/sections/summary/components/rating/RateNow.svelte";
  import { getToastTitle } from "./getToastTitle";
  import ToastBase from "./ToastBase.svelte";

  const { lastWatched }: { lastWatched: LastWatchedItem } = $props();

  const { dismiss } = useLastWatched();

  const title = $derived(getToastTitle(lastWatched));
  const { isRateable } = $derived(useIsRateable(lastWatched));
</script>

{#if $isRateable}
  <ToastBase item={lastWatched}>
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
      <RateNow style="ghost" {...lastWatched} />
    </div>
  </ToastBase>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

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
      font-size: var(--ni-24);
      text-transform: capitalize;
    }

    :global(svg) {
      --icon-color: var(--color-foreground);
    }
  }
</style>
