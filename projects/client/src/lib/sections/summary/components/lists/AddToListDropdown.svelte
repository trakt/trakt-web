<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { BehaviorSubject } from "rxjs";
  import ListDropdownItem from "../list-dropdown/_internal/ListDropdownItem.svelte";
  import ListsDrawer from "../list-dropdown/_internal/ListsDrawer.svelte";
  import { useListedOnIds } from "../list-dropdown/_internal/useListedOnIds";
  import { useAllPersonalLists } from "../list-dropdown/useAllPersonalLists";

  const { media }: { media: MediaEntry } = $props();

  const isUpdating = new BehaviorSubject<boolean>(false);

  const { listedOnIds, isLoading: isLoadingIds } = $derived(
    useListedOnIds({ media }),
  );

  const { lists, isLoading } = useAllPersonalLists();

  // const isListed = $derived($listedOnIds.length > 0);

  const isOpen = writable(false);
  const onClose = () => isOpen.set(false);

  // TODO merge with ListDropdown.svelte
  // TODO z-index issue with popup menu
  // TODO use isListed to set icon
  // TODO do not render if user has no lists
</script>

{#snippet dropdownItems()}
  {#each $lists as list}
    <ListDropdownItem
      title={media.title}
      {list}
      {isUpdating}
      {media}
      listedOnIds={$listedOnIds}
    />
  {/each}
{/snippet}

<DropdownItem
  onclick={(e) => {
    e.stopPropagation();
    isOpen.set(true);
  }}
  style="flat"
  color="default"
  variant="secondary"
>
  Add to list
  {#snippet icon()}
    <ListIcon />
  {/snippet}
</DropdownItem>

{#if $isOpen}
  <ListsDrawer {onClose}>
    {#if $isLoadingIds || $isLoading}
      <LoadingIndicator />
    {:else}
      {@render dropdownItems()}
    {/if}
  </ListsDrawer>
{/if}
