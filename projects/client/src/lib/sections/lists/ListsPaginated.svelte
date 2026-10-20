<script lang="ts">
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useListSummary } from "$lib/sections/summary/components/lists/useListSummary.ts";
  import { DEFAULT_LISTS_DRILL_SIZE } from "$lib/utils/constants";
  import UserList from "./user/UserList.svelte";

  const { slug, type }: { slug: string; type: MediaType } = $props();

  const { mode } = useDiscover();
</script>

<div class="trakt-paginated-lists">
  <PaginatedList
    {type}
    useList={(params) =>
      useListSummary({
        slug,
        type: params.type,
        limit: DEFAULT_LISTS_DRILL_SIZE,
      })}
  >
    {#snippet items(items)}
      {#each items as list (list.id)}
        <UserList {list} type={$mode} />
      {/each}
    {/snippet}
  </PaginatedList>
</div>

<style>
  .trakt-paginated-lists {
    display: contents;

    :global(.trakt-paginated-list) {
      display: flex;
      flex-direction: column;
      gap: var(--content-gap);
    }
  }
</style>
