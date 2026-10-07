<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DeleteSmartListButton from "./DeleteSmartListButton.svelte";
  import EditSmartListButton from "./EditSmartListButton.svelte";
  import { useDeleteSmartList } from "./useDeleteSmartList";

  const { list }: { list: SmartList } = $props();

  const { deleteList, isDeleting } = useDeleteSmartList();

  const isOnListPage = $derived(
    UrlBuilder.lists.smart.view(list.slug) === page.url.pathname,
  );

  const onDelete = async () => {
    if (isOnListPage) {
      await goto(UrlBuilder.lists.user("me"), { replaceState: true });
    }

    await deleteList({ slug: list.slug });
  };
</script>

<PopupMenu
  label={m.button_label_popup_menu({ title: list.title })}
  mode="standalone"
  title={list.title}
>
  {#snippet items()}
    <EditSmartListButton {list} />

    <DeleteSmartListButton
      {list}
      isDeleting={$isDeleting}
      {onDelete}
    />
  {/snippet}
</PopupMenu>
