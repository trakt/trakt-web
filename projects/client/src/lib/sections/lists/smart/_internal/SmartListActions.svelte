<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery";
  import DeleteSmartListButton from "./DeleteSmartListButton.svelte";
  import { useDeleteSmartList } from "./useDeleteSmartList";

  const { list }: { list: SmartList } = $props();

  const { deleteList, isDeleting } = useDeleteSmartList();
</script>

<PopupMenu
  label={m.button_label_popup_menu({ title: list.title })}
  mode="standalone"
>
  {#snippet items()}
    <DeleteSmartListButton
      {list}
      isDeleting={$isDeleting}
      onDelete={() => deleteList({ id: list.id })}
    />
  {/snippet}
</PopupMenu>
