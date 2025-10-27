<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { useCreateList } from "./useCreateList";

  const { isLoading }: { isLoading: boolean } = $props();

  const { createList, isCreating } = useCreateList();

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_create_list(),
    color: "default",
    variant: "primary",
    style: "ghost",
    onclick: createList,
    disabled: isLoading || $isCreating,
  });
</script>

<ActionButton {...commonProps}>
  <PlusIcon />
</ActionButton>
