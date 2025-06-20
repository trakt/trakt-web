<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
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

  const onWatchHandler = $derived(
    warningMessage
      ? attachWarning(markAsWatched, warningMessage)
      : markAsWatched,
  );

  const onRemoveHandler = $derived(
    attachWarning(removeWatched, m.remove_from_watched_warning({ title })),
  );
</script>

{#if isWatchable}
  <MarkAsWatchedButton
    {style}
    {title}
    {size}
    isWatched={$isWatched && !$isWatchlisted}
    {isRewatching}
    isMarkingAsWatched={$isMarkingAsWatched}
    onWatch={onWatchHandler}
    onRemove={onRemoveHandler}
  />
{/if}
