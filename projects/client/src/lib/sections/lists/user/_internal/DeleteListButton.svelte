<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import RemoveIcon from "$lib/components/icons/RemoveIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
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

  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: true, color: "default" }),
  );

  const handler = attachWarning(
    onDelete,
    m.warning_prompt_delete_list({ name: list.name }),
  );

  const buttonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_delete_list({ name: list.name }),
    color: $color,
    variant: $variant,
    onclick: handler,
    disabled: isDeleting,
    ...events,
  });
</script>

<RenderFor audience="authenticated">
  <ActionButton style="ghost" {...buttonProps}>
    <RemoveIcon />
  </ActionButton>
</RenderFor>
