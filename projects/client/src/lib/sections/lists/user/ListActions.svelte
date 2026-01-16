<script lang="ts">
  import { page } from "$app/state";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { getListUrl } from "../components/list-summary/_internal/getListUrl";
  import DeleteListButton from "./_internal/DeleteListButton.svelte";
  import RenameListButton from "./_internal/RenameListButton.svelte";
  import { useDeleteList } from "./_internal/useDeleteList";

  const { list }: { list: MediaListSummary } = $props();

  const { deleteList, isDeleting, isDeleted } = $derived(useDeleteList(list));

  const { user } = useUser();

  const isListOwner = $derived($user.slug === list.user?.slug);
  const isOnListPage = $derived(getListUrl(list) === page.url.pathname);
</script>

<RenderFor audience="authenticated">
  {#if $isDeleted && isOnListPage}
    <Redirect to={UrlBuilder.lists.user("me")} />
  {/if}

  {#if isListOwner}
    <PopupMenu
      label={m.button_label_popup_menu({ title: list.name })}
      mode="standalone"
    >
      {#snippet items()}
        <ShareButton
          title={list.name}
          style="dropdown-item"
          textFactory={({ title: name }) => m.text_share_list({ name })}
          source={{ id: "user-list" }}
        />
        <RenameListButton {list} isDeleting={$isDeleting} />
        <DeleteListButton
          {list}
          isDeleting={$isDeleting}
          onDelete={deleteList}
        />
      {/snippet}
    </PopupMenu>
  {/if}
</RenderFor>
