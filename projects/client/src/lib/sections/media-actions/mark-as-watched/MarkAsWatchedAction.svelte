<script lang="ts">
  import { isToastEnabledForStyle } from "../_internal/isToastEnabledForStyle";
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
    isLoading,
    onWatched,
    ...target
  }: MarkAsWatchedActionProps = $props();

  const {
    isMarkingAsWatched,
    isWatched,
    isQueued,
    markAsWatched,
    removeWatched,
    isWatchable,
  } = $derived(
    useMarkAsWatched({
      ...target,
      isToastEnabled: isToastEnabledForStyle(style),
    }),
  );

  const { confirm } = useConfirm();
  const confirmMarkAsWatched = $derived(
    confirm({
      type: ConfirmationType.MarkAsWatched,
      title,
      target,
      onConfirm: async () => {
        const wasWatched = $isWatched;
        await markAsWatched();

        if (!wasWatched) {
          onWatched?.();
        }
      },
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
      onWatched,
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
    {isLoading}
    isWatched={$isWatched}
    isMarkingAsWatched={$isMarkingAsWatched}
    isQueued={$isQueued}
    onWatch={confirmMarkAsWatched}
    onRemove={confirmRemoveFromWatched}
    {onAsk}
  />
{/if}
