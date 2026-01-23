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
  import LikeListAction from "./_internal/LikeListAction.svelte";
  import RenameListButton from "./_internal/RenameListButton.svelte";
  import { useDeleteList } from "./_internal/useDeleteList";
  import { useLikeList } from "./_internal/useLikeList";

  const { list }: { list: MediaListSummary } = $props();

  const { deleteList, isDeleting, isDeleted } = $derived(useDeleteList(list));

  const { user } = useUser();
  const { likeList, unlikeList, isUpdating, isLiked } = $derived(
    useLikeList(list),
  );

  const isListOwner = $derived($user.slug === list.user?.slug);
  const isOnListPage = $derived(
    getListUrl({ type: "user-list", list }) === page.url.pathname,
  );

  const handleLike = $derived(() => {
    $isLiked ? unlikeList() : likeList();
  });
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

  {#if !isListOwner}
    <LikeListAction
      onToggle={handleLike}
      isUpdating={$isUpdating}
      state={$isLiked ? "liked" : "unliked"}
      name={list.name}
    />
  {/if}
</RenderFor>
