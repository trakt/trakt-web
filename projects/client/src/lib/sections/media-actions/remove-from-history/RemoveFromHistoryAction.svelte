<script lang="ts">
  import RemoveFromHistoryButton from "$lib/components/buttons/remove-from-history/RemoveFromHistoryButton.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { HistoryEntry } from "$lib/sections/lists/stores/useRecentlyWatchedList";
  import { attachWarning } from "../_internal/attachWarning";
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

  const onRemoveHandler = $derived(
    attachWarning(
      removeFromHistory,
      m.warning_prompt_remove_single_watched({ title }),
    ),
  );
</script>

<RemoveFromHistoryButton
  {style}
  {title}
  {size}
  isRemoving={$isRemoving}
  onRemove={onRemoveHandler}
/>
