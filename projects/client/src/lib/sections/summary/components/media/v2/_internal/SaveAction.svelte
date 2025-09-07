<script lang="ts">
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import SavedIcon from "$lib/components/icons/SavedIcon.svelte";
  import { usePortal } from "$lib/features/portal/usePortal";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { writable } from "svelte/store";
  import ListDropdownItem from "../../../list-dropdown/_internal/ListDropdownItem.svelte";
  import { useIsOnAnyList } from "../../../list-dropdown/_internal/useIsOnAnyList";
  import { useAllPersonalLists } from "../../../list-dropdown/useAllPersonalLists";
  import MediaAction from "./MediaAction.svelte";

  const {
    title,
    media,
    type,
  }: { title: string; media: MediaEntry; type: MediaType } = $props();

  const { portalTrigger, portal, isOpened } = usePortal({
    placement: { position: "bottom" },
  });

  const isUpdating = writable(false);

  const { lists, isLoading } = useAllPersonalLists();
  const { isListed } = $derived(
    useIsOnAnyList({
      lists: $lists,
      media,
      type,
    }),
  );

  const disabled = $derived($isLoading || $isUpdating);
</script>

<MediaAction
  text={$isListed ? "Saved" : "Save"}
  label="TODO"
  {disabled}
  action={portalTrigger}
>
  {#if $isListed}
    <SavedIcon />
  {:else}
    <PlusIcon />
  {/if}
</MediaAction>

{#if $isOpened}
  <div class="trakt-save-popup" use:portal>
    <WatchlistAction
      style="dropdown-item"
      {title}
      {isUpdating}
      {media}
      {type}
    />

    {#each $lists as list}
      <ListDropdownItem {title} {list} {isUpdating} {media} {type} />
    {/each}
  </div>
{/if}

<style>
  .trakt-save-popup {
    position: absolute;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);

    background-color: var(--color-card-background);
    border-radius: var(--border-radius-m);

    padding: var(--gap-xs);
    margin-top: var(--ni-12);

    width: var(--ni-180);
    max-height: var(--ni-180);

    overflow-y: auto;

    :global(li) {
      flex-shrink: 0;
    }
  }
</style>
