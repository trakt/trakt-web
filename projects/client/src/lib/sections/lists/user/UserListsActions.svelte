<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import SaveListDrawer from "./_internal/SaveListDrawer.svelte";
  import UserListsReorderDrawer from "./_internal/UserListsReorderDrawer.svelte";
  import ListReorderButton from "./ListReorderButton.svelte";

  const {
    slug,
    title,
  }: {
    slug: string;
    title: string;
  } = $props();

  let showCreateList = $state(false);
  let showReorderLists = $state(false);
</script>

<PopupMenu
  label={m.button_label_popup_menu({ title })}
  mode="standalone"
>
  {#snippet items()}
    <DropdownItem
      label={m.button_label_create_list()}
      style="flat"
      color="default"
      variant="secondary"
      onclick={() => (showCreateList = true)}
    >
      {m.button_label_create_list()}

      {#snippet icon()}
        <PlusIcon />
      {/snippet}
    </DropdownItem>

    <ListReorderButton
      {title}
      text={m.button_text_reorder_lists()}
      onclick={() => (showReorderLists = true)}
    />
  {/snippet}
</PopupMenu>

{#if showCreateList}
  <SaveListDrawer type="create" onClose={() => (showCreateList = false)} />
{/if}

{#if showReorderLists}
  <UserListsReorderDrawer
    {slug}
    {title}
    onClose={() => (showReorderLists = false)}
  />
{/if}
