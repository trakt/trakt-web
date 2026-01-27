<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import SortValue from "./_internal/SortValue.svelte";
  import { useListSorting } from "./_internal/useListSorting";
  import UserListItem from "./_internal/UserListItem.svelte";
  import ListActions from "./ListActions.svelte";
  import ListSortActions from "./ListSortActions.svelte";
  import { useListItems } from "./useListItems";

  type UserListProps = {
    title: string;
    type?: MediaType;
    list: MediaListSummary;
  };

  const { title, type, list }: UserListProps = $props();

  const { user } = useUser();

  const { filterMap } = useFilter();
  const { current, update, options, urlBuilder } = $derived(
    useListSorting({ list, type }),
  );

  const isListOwner = $derived($user.slug === list.user?.slug);

  const listCacheId = $derived.by(() => {
    const sortKey = `${$current.sorting.value}-${$current.sortHow}`;

    if (list.user?.slug) {
      return `${list.user.slug}-${list.slug}-${sortKey}`;
    }

    return `${list.id}-${sortKey}`;
  });
</script>

<DrilledMediaList
  id={`user-paginated-list-${listCacheId}`}
  {title}
  {type}
  filter={$filterMap}
  useList={(params) =>
    useListItems({
      list,
      sortBy: $current.sorting.value,
      sortHow: $current.sortHow,
      ...params,
    })}
>
  {#snippet listActions()}
    <div class="trakt-list-actions">
      {#if list.description}
        <Tooltip content={list.description}>
          <span class="secondary ellipsis">{list.description}</span>
        </Tooltip>
      {/if}

      <ListSortActions
        {options}
        {urlBuilder}
        current={$current}
        onUpdate={update}
      />
    </div>
  {/snippet}
  {#snippet item(media)}
    <UserListItem listedItem={media} style="summary" {list}>
      {#snippet sortTag()}
        <SortValue item={media} sortBy={$current.sorting.value} />
      {/snippet}
    </UserListItem>
  {/snippet}

  {#snippet badge()}
    <ListActions {list} />
  {/snippet}

  {#snippet actions()}
    {#if !isListOwner}
      <ShareButton
        {title}
        textFactory={({ title: name }) => m.text_share_list({ name })}
        source={{ id: "user-list", type }}
      />
    {/if}
  {/snippet}
</DrilledMediaList>

<style>
  .trakt-list-actions {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
