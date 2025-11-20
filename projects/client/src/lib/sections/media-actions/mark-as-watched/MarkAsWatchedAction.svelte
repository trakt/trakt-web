<script lang="ts">
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { markAsWatchedDrawerStore } from "./_internal/markAsWatchedDrawerStore";
  import type { MarkAsWatchedActionProps } from "./MarkAsWatchedActionProps";
  import { useMarkAsWatched } from "./useMarkAsWatched";

  const {
    style = "action",
    size = "normal",
    title,
    i18n,
    mode,
    ...target
  }: MarkAsWatchedActionProps = $props();

  const {
    isMarkingAsWatched,
    isWatched,
    markAsWatched,
    removeWatched,
    isWatchable,
  } = $derived(useMarkAsWatched(target));

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

  const onAsk = $derived(() => {
    markAsWatchedDrawerStore.open({
      title,
      mediaStore: target,
    });
  });
</script>

{#if isWatchable}
  <MarkAsWatchedButton
    {style}
    {title}
    {size}
    {i18n}
    {mode}
    isWatched={$isWatched}
    isMarkingAsWatched={$isMarkingAsWatched}
    onWatch={confirmMarkAsWatched}
    onRemove={confirmRemoveFromWatched}
    {onAsk}
  />
{/if}
