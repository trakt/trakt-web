<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaStoreProps } from "$lib/models/MediaStoreProps";
  import { useRemoveFromList } from "./useRemoveFromList";

  const {
    listId,
    title,
    ...target
  }: { listId: string; title: string } & MediaStoreProps = $props();

  const { isListUpdating, removeFromList } = $derived(
    useRemoveFromList({
      listId,
      ...target,
    }),
  );

  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: true, color: "blue" }),
  );

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_remove_from_list({ title }),
    color: $color,
    variant: $variant,
    onclick: removeFromList,
    disabled: $isListUpdating,
    ...events,
  });

  /*
  FIXME: this is here temporarily
  Will likely merge with watchlist action
  */
</script>

<DropdownItem {...commonProps} style="flat">
  {m.button_text_remove_from_list()}

  {#snippet icon()}
    <BookmarkIcon state="added" size="normal" />
  {/snippet}
</DropdownItem>
