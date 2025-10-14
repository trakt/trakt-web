<script lang="ts">
  import RemoveFromHistoryButton from "$lib/components/buttons/remove-from-history/RemoveFromHistoryButton.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import type { HistoryEntry } from "$lib/sections/lists/stores/useRecentlyWatchedList";
  import { useRemoveFromHistory } from "./useRemoveFromHistory";

  type RemoveFromHistoryActionProps = {
    entry: HistoryEntry;
    style: "normal" | "action" | "dropdown-item";
    title: string;
    size?: "normal" | "small";
  };

  const {
    style = "action",
    size = "normal",
    title,
    entry,
  }: RemoveFromHistoryActionProps = $props();

  const { isRemoving, removeFromHistory } = $derived(
    useRemoveFromHistory(entry),
  );

  const { confirm } = useConfirm();
  const confirmRemoveFromHistory = $derived(
    confirm({
      type: ConfirmationType.RemoveFromHistory,
      title,
      onConfirm: removeFromHistory,
    }),
  );
</script>

<RemoveFromHistoryButton
  {style}
  {title}
  {size}
  isRemoving={$isRemoving}
  onRemove={confirmRemoveFromHistory}
/>
