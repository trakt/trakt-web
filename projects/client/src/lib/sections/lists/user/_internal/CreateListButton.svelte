<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import AddListIcon from "$lib/components/icons/AddListIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useCreateList } from "./useCreateList";

  const { isLoading }: { isLoading: boolean } = $props();

  const { createList, isCreating } = useCreateList();

  const buttonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_create_list(),
    color: "default",
    variant: "primary",
    style: "ghost",
    onclick: createList,
    disabled: isLoading || $isCreating,
  });
</script>

<RenderFor audience="authenticated">
  <ActionButton {...buttonProps}>
    <AddListIcon />
  </ActionButton>
</RenderFor>
