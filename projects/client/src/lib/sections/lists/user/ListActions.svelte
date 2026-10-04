<script lang="ts">
  import { page } from "$app/state";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useListSelection } from "$lib/features/list-selection/useListSelection.ts";
  import { ReportableType } from "$lib/features/report/models/ReportableType.ts";
  import ReportButton from "$lib/features/report/ReportButton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { type Snippet, untrack } from "svelte";
  import { getListUrl } from "../components/list-summary/_internal/getListUrl";
  import AddFromListsButton from "./_internal/bulk-add/AddFromListsButton.svelte";
  import BulkAddDrawer from "./_internal/bulk-add/BulkAddDrawer.svelte";
  import BulkEditListButton from "./_internal/BulkEditListButton.svelte";
  import DeleteListButton from "./_internal/DeleteListButton.svelte";
  import EditListButton from "./_internal/EditListButton.svelte";
  import LikeListAction from "./_internal/LikeListAction.svelte";
  import ListDetailsButton from "./_internal/ListDetailsButton.svelte";
  import ListDetailsDrawerHost from "./_internal/ListDetailsDrawerHost.svelte";
  import ManageCollaboratorsButton from "./_internal/ManageCollaboratorsButton.svelte";
  import ManageCollaboratorsDrawerHost from "./_internal/ManageCollaboratorsDrawerHost.svelte";
  import { useCanAddFromLists } from "./_internal/bulk-add/useCanAddFromLists";
  import ListReorderDrawer from "./ListReorderDrawer.svelte";
  import SaveListDrawer from "./_internal/SaveListDrawer.svelte";
  import { useDeleteList } from "./_internal/useDeleteList";
  import { useLikeList } from "./_internal/useLikeList";
  import ListReorderButton from "./ListReorderButton.svelte";

  const {
    list,
    popupActions,
    editable = false,
  }: { list: MediaListSummary; popupActions?: Snippet; editable?: boolean } =
    $props();

  const { deleteList, isDeleting, isDeleted } = $derived(useDeleteList(list));
  const selection = useListSelection();

  let showEditList = $state(false);
  let showReorderList = $state(false);
  let showManageCollaborators = $state(false);
  let showBulkAdd = $state(false);

  const { user } = useUser();
  const { likeList, unlikeList, isUpdating, isLiked } = $derived(
    useLikeList(list),
  );

  const { canAddFromLists } = useCanAddFromLists({
    list$: fromRune(() => list),
    userSlug: untrack(() => $user.slug),
  });

  const isListOwner = $derived($user.slug === list.user?.slug);
  const isOnListPage = $derived(
    getListUrl({ type: "user-list", list }) === page.url.pathname,
  );

  function handleLike() {
    if ($isLiked) {
      unlikeList();
      return;
    }

    likeList();
  }

  const isDisabled = $derived($isUpdating || isListOwner);
</script>

<RenderFor audience="authenticated">
  {#if $isDeleted && isOnListPage}
    <Redirect to={UrlBuilder.lists.user("me")} />
  {/if}

  <LikeListAction
    onToggle={handleLike}
    disabled={isDisabled}
    state={$isLiked ? "liked" : "unliked"}
    {list}
  />

  <PopupMenu
    label={m.button_label_popup_menu({ title: list.name })}
    mode="standalone"
    title={list.name}
  >
    {#snippet items()}
      {@render popupActions?.()}
      {#if isOnListPage}
        <ListDetailsButton {list} />
      {/if}
      {#if isListOwner}
        <ShareButton
          title={list.name}
          style="dropdown-item"
          source={{ id: "user-list" }}
        />
        <ListReorderButton
          title={list.name}
          disabled={$isDeleting}
          onclick={() => (showReorderList = true)}
        />
        <AddFromListsButton {list} onClick={() => (showBulkAdd = true)} />
        {#if editable}
          <BulkEditListButton
            name={list.name}
            disabled={$isDeleting}
            onclick={() => selection.enterEdit()}
          />
        {/if}
        <EditListButton
          {list}
          isDeleting={$isDeleting}
          onClick={() => (showEditList = true)}
        />
        <ManageCollaboratorsButton
          {list}
          isDeleting={$isDeleting}
          onClick={() => (showManageCollaborators = true)}
        />
        <DeleteListButton
          {list}
          isDeleting={$isDeleting}
          onDelete={deleteList}
        />
      {:else}
        {#if $canAddFromLists}
          <AddFromListsButton {list} onClick={() => (showBulkAdd = true)} />
        {/if}
        <ReportButton
          params={{ type: ReportableType.List, id: list.id, title: list.name }}
          label={m.button_label_report_list({ name: list.name })}
        />
      {/if}
    {/snippet}
  </PopupMenu>

  {#if isOnListPage}
    <ListDetailsDrawerHost {list} />
  {/if}
</RenderFor>

{#if showEditList}
  <SaveListDrawer type="update" onClose={() => (showEditList = false)} {list} />
{/if}

{#if showBulkAdd}
  <BulkAddDrawer {list} onClose={() => (showBulkAdd = false)} />
{/if}

{#if showReorderList}
  <ListReorderDrawer
    title={list.name}
    source={{ type: "user-list", list }}
    onClose={() => (showReorderList = false)}
  />
{/if}

{#if showManageCollaborators}
  <ManageCollaboratorsDrawerHost
    {list}
    onClose={() => (showManageCollaborators = false)}
  />
{/if}
