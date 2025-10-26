<script lang="ts">
  import RemoveFromHistoryButton from "$lib/components/buttons/remove-from-history/RemoveFromHistoryButton.svelte";
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
    useRemoveFromHistory({ ...entry, title }),
  );
</script>

<RemoveFromHistoryButton
  {style}
  {title}
  {size}
  isRemoving={$isRemoving}
  onRemove={removeFromHistory}
/>
