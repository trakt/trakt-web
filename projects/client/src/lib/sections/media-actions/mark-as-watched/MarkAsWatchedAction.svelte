<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import ConfirmationDialog from "$lib/components/dialogs/ConfirmationDialog.svelte";
  import { writable } from "svelte/store";
  import { attachWarning } from "../_internal/attachWarning";
  import { useIsWatchlisted } from "../watchlist/useIsWatchlisted";
  import { getWarningMessage } from "./_internal/getWarningMessage";
  import type { MarkAsWatchedActionProps } from "./MarkAsWatchedActionProps";
  import { useMarkAsWatched } from "./useMarkAsWatched";

  const {
    style = "action",
    size = "normal",
    title,
    allowRewatch = false,
    i18n,
    ...target
  }: MarkAsWatchedActionProps = $props();

  const {
    isMarkingAsWatched,
    isWatched,
    markAsWatched,
    removeWatched,
    isWatchable,
  } = $derived(useMarkAsWatched(target));

  const { isWatchlisted } = $derived(useIsWatchlisted(target));
  const isRewatching = $derived(allowRewatch && $isWatched);

  const warningMessage = $derived(getWarningMessage(title, target));

  const showWarning = writable(false);
  const onWatchHandler = $derived(
    warningMessage ? () => showWarning.set(true) : markAsWatched,
  );

  const onRemoveHandler = $derived(
    attachWarning(
      removeWatched,
      m.warning_prompt_remove_from_watched({ title }),
    ),
  );
</script>

{#if isWatchable}
  <MarkAsWatchedButton
    {style}
    {title}
    {size}
    {i18n}
    isWatched={$isWatched && !$isWatchlisted}
    {isRewatching}
    isMarkingAsWatched={$isMarkingAsWatched}
    onWatch={onWatchHandler}
    onRemove={onRemoveHandler}
  />

  {#if warningMessage}
    <ConfirmationDialog
      open={showWarning}
      message={warningMessage}
      title="Mark as watched"
      confirmText="Yep, Mark as watched"
      onConfirm={markAsWatched}
    />
  {/if}
{/if}
