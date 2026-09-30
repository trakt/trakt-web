<script lang="ts">
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ListItem } from "$lib/requests/models/ListItem";
  import type { UserList } from "$lib/requests/queries/users/userListsQuery";
  import type { PaginatableStore } from "$lib/sections/lists/drilldown/PaginatableStore";
  import { useListItems } from "$lib/sections/lists/user/useListItems";
  import { useWatchList } from "$lib/sections/lists/watchlist/useWatchList";
  import ListPreviewItem from "./ListPreviewItem.svelte";
  import type { ListPreviewTarget } from "./ListPreviewTarget";

  const { target }: { target: ListPreviewTarget } = $props();

  const toListParams = (list: UserList) => ({
    id: list.id,
    user: { slug: String(list.ownerId) },
  });

  const useList: PaginatableStore<ListItem, DiscoverMode> = $derived(
    target.type === "watchlist"
      ? (params) => useWatchList({ ...params, intent: "default" })
      : (params) => useListItems({ ...params, list: toListParams(target.list) }),
  );

  const source = $derived(
    target.type === "watchlist" ? "watchlist" : "user-list",
  );
</script>

<div class="trakt-list-preview">
  <PaginatedList type="media" target="parent" {useList}>
    {#snippet items(items, isLoading)}
      <div class="list-preview-items">
        {#each items as item (item.key)}
          <ListPreviewItem {item} {source} />
        {/each}

        {#if items.length === 0 && !isLoading}
          <p class="secondary">{m.text_list_preview_empty()}</p>
        {/if}
      </div>
    {/snippet}
  </PaginatedList>
</div>

<style>
  .trakt-list-preview {
    flex: 1;
    min-height: 0;
    position: relative;
    overflow-y: auto;
    overscroll-behavior: contain;

    padding: var(--ni-4);
  }

  .list-preview-items {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
