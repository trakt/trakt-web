<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DropdownGroup from "$lib/components/dropdown/DropdownGroup.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ListTarget } from "$lib/models/ListTarget";
  import { useAllPersonalLists } from "$lib/stores/useAllPersonalLists";
  import { useListedOnIds } from "$lib/stores/useListedOnIds";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import ListDropdownItem from "./ListDropdownItem.svelte";
  import WatchlistDropdownItem from "./_internal/WatchlistDropdownItem.svelte";

  const {
    onClose,
    metaInfo,
    target,
    title,
    onLoading,
  }: {
    onClose: () => void;
    title: string;
    metaInfo?: string;
    target: ListTarget;
    onLoading?: (isLoading: boolean) => void;
  } = $props();

  const { lists, isLoading: isLoadingLists } = useAllPersonalLists();
  const target$ = fromRune(() => target);
  const { listedOnIds, isLoading: isLoadingIds } = useListedOnIds({ target$ });

  const listedOnIdsSet = $derived(new Set($listedOnIds));
  const sortedLists = $derived(
    $lists.toSorted((a, b) => {
      const aListed = listedOnIdsSet.has(a.id);
      const bListed = listedOnIdsSet.has(b.id);
      if (aListed === bListed) return 0;
      return aListed ? -1 : 1;
    }),
  );

  const isLoading = $derived($isLoadingIds || $isLoadingLists);
  const isEmpty = $derived($lists.length === 0);
</script>

<Drawer {onClose} title={m.header_manage_lists()} {metaInfo}>
  <div class="lists-layout">
    <DropdownGroup>
      {#if target.type === "movie" || target.type === "show"}
        <WatchlistDropdownItem
          media={target.media}
          type={target.type}
          {title}
          {onLoading}
        />
      {/if}

      {#if isEmpty && isLoading}
        <LoadingIndicator />
      {:else}
        {#each sortedLists as list (list.id)}
          <ListDropdownItem
            {title}
            {list}
            {onLoading}
            {target}
            isListed={listedOnIdsSet.has(list.id)}
          />
        {/each}
      {/if}
    </DropdownGroup>
  </div>
</Drawer>

<style>
  .lists-layout {
    --dropdown-item-direction: row-reverse;
    --dropdown-item-justify: space-between;
  }
</style>
