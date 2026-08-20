<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DropdownGroup from "$lib/components/dropdown/DropdownGroup.svelte";
  import type { DropdownItemFlash } from "$lib/components/dropdown/DropdownItemFlash";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ListTarget } from "$lib/models/ListTarget";
  import { useAllPersonalLists } from "$lib/stores/useAllPersonalLists";
  import { useBackgroundFlash } from "$lib/stores/useBackgroundFlash.svelte";
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

  // Rows flash off the listed-ids diff instead of the request lifecycle -
  // add/remove re-sorts the rows, and the server-state change is the one
  // signal that survives that churn.
  const rowFlash = useBackgroundFlash<{ id: number; color: DropdownItemFlash }>();
  let previousListedIds: Set<number> | null = null;

  $effect(() => {
    if ($isLoadingIds) {
      return;
    }

    const current = listedOnIdsSet;
    const previous = previousListedIds;
    previousListedIds = current;

    if (previous == null) {
      return;
    }

    const addedId = [...current].find((id) => !previous.has(id));
    const removedId = [...previous].find((id) => !current.has(id));

    if (addedId != null) {
      rowFlash.flash({ id: addedId, color: "purple" });
      return;
    }

    if (removedId != null) {
      rowFlash.flash({ id: removedId, color: "red" });
    }
  });
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
            flash={rowFlash.flashing?.id === list.id
              ? rowFlash.flashing.color
              : undefined}
          />
        {/each}
      {/if}
    </DropdownGroup>
  </div>
</Drawer>

<style>
  .lists-layout {
    /* The group's list is overflow: hidden, which zeroes its automatic
       min-size inside the drawer's scroll flexbox - without this wrapper the
       group shrinks to fit and clips instead of letting the drawer scroll. */
    flex-shrink: 0;
  }
</style>
