<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { writable } from "svelte/store";
  import CreateListDrawer from "./CreateListDrawer.svelte";

  const { isLoading }: { isLoading: boolean } = $props();

  const showCreateList = writable(false);

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_create_list(),
    color: "purple",
    variant: "secondary",
    onclick: () => showCreateList.set(true),
    disabled: isLoading,
  });
</script>

<RenderFor audience="authenticated" device={["mobile", "tablet-lg", "desktop"]}>
  <Button size="small" {...commonProps}>
    {m.button_text_create_list()}
    {#snippet icon()}
      <PlusIcon />
    {/snippet}
  </Button>
</RenderFor>

<RenderFor audience="authenticated" device={["tablet-sm"]}>
  <ActionButton {...commonProps}>
    <PlusIcon />
  </ActionButton>
</RenderFor>

{#if $showCreateList}
  <CreateListDrawer onClose={() => showCreateList.set(false)} />
{/if}
