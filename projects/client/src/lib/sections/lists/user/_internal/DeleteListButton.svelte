<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { attachWarning } from "$lib/sections/media-actions/_internal/attachWarning";

  const {
    list,
    isDeleting,
    onDelete,
  }: {
    list: MediaListSummary;
    isDeleting: boolean;
    onDelete: () => {};
  } = $props();

  const {
    color,
    variant: _,
    ...events
  } = $derived(useDangerButton({ isActive: true, color: "default" }));

  const handler = attachWarning(
    onDelete,
    m.warning_prompt_delete_list({ name: list.name }),
  );

  const buttonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_delete_list({ name: list.name }),
    color: $color,
    onclick: handler,
    disabled: isDeleting,
    variant: "secondary",
    ...events,
  });
</script>

<DropdownItem style="flat" {...buttonProps}>
  {m.button_text_delete_list()}
</DropdownItem>
