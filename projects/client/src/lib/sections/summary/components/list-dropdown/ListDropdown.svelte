<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import ListedIcon from "$lib/components/icons/ListedIcon.svelte";
  import ListManagementIcon from "$lib/components/icons/ListManagementIcon.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { writable } from "svelte/store";
  import ListDropdownItem from "./_internal/ListDropdownItem.svelte";
  import ListsDrawer from "./_internal/ListsDrawer.svelte";
  import { useIsOnAnyList } from "./_internal/useIsOnAnyList";
  import type { ListDropdownProps } from "./ListDropdownProps";
  import { useAllPersonalLists } from "./useAllPersonalLists";

  const {
    size,
    style = "normal",
    title,
    ...target
  }: ListDropdownProps = $props();

  // FIXME: replace this when we store states in session storage
  const isUpdating = writable(false);
  const { lists, isLoading } = useAllPersonalLists();

  const { isListed } = $derived(
    useIsOnAnyList({
      lists: $lists,
      ...target,
    }),
  );

  const isDisabled = $derived($isLoading || $isUpdating);
  const isOpen = writable(false);
  const onClose = () => isOpen.set(false);

  const variant = $derived($isListed ? "primary" : "secondary");
  const text = $derived(
    $isListed ? m.button_text_listed() : m.button_text_lists(),
  );
</script>

{#snippet dropdownItems()}
  <WatchlistAction style="dropdown-item" {title} {isUpdating} {...target} />

  {#each $lists as list}
    <ListDropdownItem {title} {list} {isUpdating} {...target} />
  {/each}
{/snippet}

{#if style === "normal"}
  <Button
    style="flat"
    color="blue"
    {size}
    {variant}
    label={m.dropdown_label_add_remove_from_lists({ title })}
    disabled={isDisabled}
    onclick={() => isOpen.set(!$isOpen)}
  >
    {text}

    {#snippet icon()}
      <ListManagementIcon />
    {/snippet}
  </Button>
{/if}

{#if style === "action"}
  <ActionButton
    label={m.dropdown_label_add_remove_from_lists({ title })}
    onclick={() => isOpen.set(!$isOpen)}
    style="ghost"
    disabled={isDisabled}
  >
    {#if $isListed}
      <ListedIcon />
    {:else}
      <PlusIcon />
    {/if}
  </ActionButton>
{/if}

{#if $isOpen}
  <ListsDrawer {onClose}>
    {@render dropdownItems()}
  </ListsDrawer>
{/if}
