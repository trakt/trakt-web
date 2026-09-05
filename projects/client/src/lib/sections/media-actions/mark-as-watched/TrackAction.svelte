<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import type { MarkAsWatchedButtonIntl } from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonIntl";
  import { MarkAsWatchedButtonIntlProvider } from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButtonIntlProvider";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import {
    useMarkAsWatched,
    type MarkAsWatchedStoreProps,
  } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";
  import { markAsWatchedDrawerStore } from "./_internal/markAsWatchedDrawerStore";

  type TrackButtonProps = MarkAsWatchedStoreProps & {
    title: string;
    i18n?: MarkAsWatchedButtonIntl;
  };

  const {
    title,
    i18n = MarkAsWatchedButtonIntlProvider,
    ...target
  }: TrackButtonProps = $props();

  const { isMarkingAsWatched, isWatchable, isWatched, removeWatched } =
    $derived(useMarkAsWatched({ ...target, isToastEnabled: false }));

  const { user } = useUser();
  const { confirm } = useConfirm();
  const openMarkAsWatchedDrawer = $derived(() => {
    markAsWatchedDrawerStore.open({
      title,
      mediaStore: { ...target },
    });
  });
  const confirmRemoveWatched = $derived(
    confirm({
      type: ConfirmationType.RemoveFromWatched,
      title,
      onConfirm: removeWatched,
    }),
  );

  /**
   * A filled check reads as "done", so tapping it again should mean "watched
   * again", not "undo everything". Removal lives in the overflow menu, where
   * destructive actions belong.
   *
   * When the account opts out of multiple plays there is no second play to
   * record, so the check keeps its removal role.
   */
  const isWatchAgain = $derived(
    $isWatched && $user.preferences.hasWatchAgain,
  );

  const handler = (ev: MouseEvent) => {
    if ($isWatched && !$user.preferences.hasWatchAgain) {
      confirmRemoveWatched(ev);
      return;
    }

    openMarkAsWatchedDrawer();
  };
</script>

<trakt-track-action class:is-watchable={isWatchable}>
  <ActionButton
    disabled={$isMarkingAsWatched || !isWatchable}
    label={i18n.label({
      title,
      isWatched: $isWatched,
      isRewatching: isWatchAgain,
    })}
    onclick={handler}
    variant={$isWatched ? "primary" : "secondary"}
    color="purple"
  >
    <TrackIcon state={$isWatched ? "watched" : "unwatched"} />
  </ActionButton>
</trakt-track-action>

<style>
  trakt-track-action {
    display: flex;
    flex-grow: 1;

    /* ActionButton renders a wrapper around its button, so stretch the direct
       child to keep the grow chain intact down to the button. */
    > :global(*) {
      flex-grow: 1;
    }

    :global(.trakt-action-button) {
      flex-grow: 1;

      :global(svg) {
        width: var(--ni-24);
        height: var(--ni-24);
      }
    }

    &.is-watchable {
      :global(.trakt-action-button[disabled]) {
        background-color: var(--color-foreground-action-button);
        color: var(--color-background-action-button);
      }
    }
  }
</style>
