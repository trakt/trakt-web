<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { BehaviorSubject } from "rxjs";
  import CreateListDrawer from "./CreateListDrawer.svelte";

  const { isLoading }: { isLoading: boolean } = $props();

  const showCreateList = new BehaviorSubject(false);

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_create_list(),
    color: "default",
    variant: "primary",
    style: "ghost",
    onclick: () => showCreateList.next(true),
    disabled: isLoading,
  });
</script>

<ActionButton {...commonProps}>
  <PlusIcon />
</ActionButton>

<RenderFor audience="authenticated" device={["tablet-sm"]}>
  <ActionButton {...commonProps}>
    <PlusIcon />
  </ActionButton>
</RenderFor>

{#if $showCreateList}
  <CreateListDrawer onClose={() => showCreateList.next(false)} />
{/if}
