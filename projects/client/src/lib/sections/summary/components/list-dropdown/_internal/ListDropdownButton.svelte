<script lang="ts">
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import ListManagementIcon from "$lib/components/icons/ListManagementIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { ListDropdownButtonProps } from "./ListDropdownButtonProps";

  const {
    title,
    items: externalItems,
    size,
    isListed,
    ...props
  }: ListDropdownButtonProps = $props();

  const variant = $derived(isListed ? "primary" : "secondary");
  const text = $derived(isListed ? m.listed() : m.lists_action_label());
</script>

<list-dropdown>
  <DropdownList
    label={title}
    {variant}
    text="capitalize"
    color="blue"
    style="flat"
    {size}
    {...props}
  >
    {text}

    {#snippet icon()}
      <ListManagementIcon />
    {/snippet}

    {#snippet items()}
      {@render externalItems()}
    {/snippet}
  </DropdownList>
</list-dropdown>
