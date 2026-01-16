<script lang="ts">
  import { page } from "$app/state";
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import PopularListItem from "../popular/PopularListItem.svelte";
  import PopupActions from "./_internal/PopupActions.svelte";
  import { useListSorting } from "./_internal/useListSorting";
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

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");

  const { filterMap } = useFilter();
  const { current, update, options, urlBuilder } = $derived(
    useListSorting(list, type),
  );

  const sortHowParam = $derived(page.url.searchParams.get("sort_how"));
  const sortByParam = $derived(page.url.searchParams.get("sort_by"));

  $effect(() => {
    const params: Record<string, string> = {};
    if (sortHowParam) params.sort_how = sortHowParam;
    if (sortByParam) params.sort_by = sortByParam;
    update(params);
  });

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

      <ListSortActions {options} {urlBuilder} current={$current} />
    </div>
  {/snippet}
  {#snippet item(media)}
    <PopularListItem type={media.type} media={media.entry} {style}>
      {#snippet popupActions()}
        <PopupActions {list} media={media.entry} />
      {/snippet}
    </PopularListItem>
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
