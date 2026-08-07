<script lang="ts">
  import { page } from "$app/state";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { ReportableType } from "$lib/features/report/models/ReportableType.ts";
  import ReportButton from "$lib/features/report/ReportButton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { getListUrl } from "../components/list-summary/_internal/getListUrl.ts";
  import DeleteListButton from "./_internal/DeleteListButton.svelte";
  import EditListButton from "./_internal/EditListButton.svelte";
  import SaveListDrawer from "./_internal/SaveListDrawer.svelte";
  import { useDeleteList } from "./_internal/useDeleteList.ts";
  import ListReorderButton from "./ListReorderButton.svelte";
  import ListReorderDrawer from "./ListReorderDrawer.svelte";

  const { list }: { list: MediaListSummary } = $props();

  const { deleteList, isDeleting, isDeleted } = $derived(useDeleteList(list));

  let showEditList = $state(false);
  let showReorderList = $state(false);

  const { user } = useUser();

  const isListOwner = $derived($user?.slug === list.user?.slug);
  const isOnListPage = $derived(
    getListUrl({ type: "user-list", list }) === page.url.pathname,
  );
</script>

<RenderFor audience="authenticated">
  {#if $isDeleted && isOnListPage}
    <Redirect to={UrlBuilder.lists.user("me")} />
  {/if}

  <PopupMenu
    label={m.button_label_popup_menu({ title: list.name })}
    mode="standalone"
    title={list.name}
  >
    {#snippet items()}
      {#if isListOwner}
        <ShareButton
          title={list.name}
          style="dropdown-item"
          textFactory={({ title: name }) => m.text_share_list({ name })}
          source={{ id: "user-list" }}
        />
        <ListReorderButton
          title={list.name}
          disabled={$isDeleting}
          onclick={() => (showReorderList = true)}
        />
        <EditListButton
          {list}
          isDeleting={$isDeleting}
          onClick={() => (showEditList = true)}
        />
        <DeleteListButton
          {list}
          isDeleting={$isDeleting}
          onDelete={deleteList}
        />
      {:else}
        <ReportButton
          params={{ type: ReportableType.List, id: list.id, title: list.name }}
          label={m.button_label_report_list({ name: list.name })}
        />
      {/if}
    {/snippet}
  </PopupMenu>
</RenderFor>

{#if showEditList}
  <SaveListDrawer type="update" onClose={() => (showEditList = false)} {list} />
{/if}

{#if showReorderList}
  <ListReorderDrawer
    title={list.name}
    source={{ type: "user-list", list }}
    onClose={() => (showReorderList = false)}
  />
{/if}
