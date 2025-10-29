<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { MediaStoreProps } from "$lib/models/MediaStoreProps";
  import LoadingIndicator from "$lib/sections/lists/drilldown/_internal/LoadingIndicator.svelte";
  import { onMount } from "svelte";
  import { ListDropdownItemIntlProvider } from "./ListDropdownItemIntlProvider";
  import type { ListDropdownItemProps } from "./ListDropdownItemProps";
  import { useList } from "./useList";

  const {
    title,
    list,
    isUpdating,
    i18n = ListDropdownItemIntlProvider,
    ...target
  }: ListDropdownItemProps & MediaStoreProps = $props();

  const { user } = useUser();

  const { addToList, removeFromList, isListUpdating, isListed, itemCount } =
    $derived(
      useList({
        list,
        title,
        ...target,
      }),
    );

  const isBelowLimit = $derived($itemCount < $user.limits.lists.itemLimit);

  onMount(() => {
    const unsubscribe = isListUpdating.subscribe((value) => {
      isUpdating.set(value);
    });

    return {
      destroy: unsubscribe,
    };
  });

  const handler = $derived($isListed ? removeFromList : addToList);
  const { color, variant, isTouch, ...events } = $derived(
    useDangerButton({ isActive: $isListed, color: "default" }),
  );
  const state = $derived($isListed ? "added" : "missing");

  const itemProps: Omit<ButtonProps, "children"> = $derived({
    style: "flat",
    label: i18n.label({ isListed: $isListed, listName: list.name, title }),
    color: $color,
    variant: $isTouch && $isListed ? $variant : "primary",
    onclick: handler,
    disabled: $isListUpdating || !isBelowLimit,
    ...events,
  });
</script>

<DropdownItem {...itemProps}>
  {i18n.text({ isListed: $isListed, listName: list.name, title })}

  {#snippet icon()}
    {#if $isListUpdating}
      <LoadingIndicator />
    {:else}
      <BookmarkIcon {state} size="normal" />
    {/if}
  {/snippet}
</DropdownItem>
