<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import type { MediaType } from "$lib/requests/models/MediaType";
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
    media,
    listedOnIds,
  }: ListDropdownItemProps = $props();

  const { user } = useUser();

  const isListed = $derived(listedOnIds.some((listId) => listId === list.id));

  const { addToList, removeFromList, isListUpdating } = $derived(
    useList({
      list,
      type: media.type as MediaType,
      media,
    }),
  );

  const isBelowLimit = $derived(list.count < $user.limits.lists.itemLimit);

  onMount(() => {
    const subscription = isListUpdating.subscribe((value) => {
      isUpdating.next(value);
    });

    return () => subscription.unsubscribe();
  });

  const { confirm } = useConfirm();
  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemoveFromList,
      title,
      name: list.name,
      onConfirm: removeFromList,
    }),
  );

  const handler = $derived(isListed ? confirmRemove : addToList);
  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: isListed, color: "default" }),
  );
  const state = $derived(isListed ? "added" : "missing");

  const itemProps: Omit<ButtonProps, "children"> = $derived({
    style: "flat",
    label: i18n.label({ isListed, listName: list.name, title }),
    color: $color,
    variant: isListed ? variant : "primary",
    onclick: handler,
    disabled: $isListUpdating || !isBelowLimit,
    ...events,
  });
</script>

<DropdownItem {...itemProps}>
  {i18n.text({ isListed, listName: list.name, title })}

  {#snippet icon()}
    {#if $isListUpdating}
      <LoadingIndicator />
    {:else}
      <BookmarkIcon {state} size="normal" />
    {/if}
  {/snippet}
</DropdownItem>
