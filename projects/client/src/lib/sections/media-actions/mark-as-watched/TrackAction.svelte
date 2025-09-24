<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import type { MarkAsWatchedButtonIntl } from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonIntl";
  import { MarkAsWatchedButtonIntlProvider } from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonIntlProvider";
  import TrackIcon from "$lib/components/TrackIcon.svelte";
  import {
    useMarkAsWatched,
    type MarkAsWatchedStoreProps,
  } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";
  import { attachWarning } from "../_internal/attachWarning";
  import { getWarningMessage } from "./_internal/getWarningMessage";

  type TrackButtonProps = MarkAsWatchedStoreProps & {
    title: string;
    i18n?: MarkAsWatchedButtonIntl;
  };

  const {
    title,
    i18n = MarkAsWatchedButtonIntlProvider,
    ...target
  }: TrackButtonProps = $props();

  const { isMarkingAsWatched, markAsWatched, isWatchable } = $derived(
    useMarkAsWatched(target),
  );

  const warningMessage = $derived(getWarningMessage(title, target));

  const onWatchHandler = $derived(
    warningMessage
      ? attachWarning(markAsWatched, warningMessage)
      : markAsWatched,
  );
</script>

<trakt-track-action>
  <ActionButton
    disabled={$isMarkingAsWatched || !isWatchable}
    label={i18n.label({ title, isWatched: false, isRewatching: false })}
    onclick={onWatchHandler}
    color="purple"
  >
    <TrackIcon />
  </ActionButton>
</trakt-track-action>

<style>
  trakt-track-action {
    display: flex;
    flex-grow: 1;

    :global(.trakt-action-button) {
      flex-grow: 1;

      :global(svg) {
        width: var(--ni-24);
        height: var(--ni-24);
      }
    }

    :global(.trakt-action-button[disabled]) {
      background-color: var(--color-foreground-action-button);
      color: var(--color-background-action-button);
    }
  }
</style>
