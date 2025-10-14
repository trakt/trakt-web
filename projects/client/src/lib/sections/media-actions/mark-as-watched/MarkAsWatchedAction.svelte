<script lang="ts">
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { useIsWatchlisted } from "../watchlist/useIsWatchlisted";
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

  const { confirm } = useConfirm();
  const confirmMarkAsWatched = $derived(
    confirm({
      type: ConfirmationType.MarkAsWatched,
      title,
      target,
      onConfirm: markAsWatched,
    }),
  );
  const confirmRemoveFromWatched = $derived(
    confirm({
      type: ConfirmationType.RemoveFromWatched,
      title,
      onConfirm: removeWatched,
    }),
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
    onWatch={confirmMarkAsWatched}
    onRemove={confirmRemoveFromWatched}
  />
{/if}
