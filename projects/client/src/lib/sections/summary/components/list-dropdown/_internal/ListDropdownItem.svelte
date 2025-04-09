<script lang="ts">
  import { useDangerButton } from "$lib/components/buttons/_internal/useDangerButton";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import WatchlistIcon from "$lib/components/icons/WatchlistIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages";
  import type { MediaStoreProps } from "$lib/models/MediaStoreProps";
  import { attachWarning } from "$lib/sections/media-actions/_internal/attachWarning";
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

  const { current } = useUser();

  const { addToList, removeFromList, isListUpdating, isListed, itemCount } =
    $derived(
      useList({
        list,
        ...target,
      }),
    );

  const isBelowLimit = $derived($itemCount < current().limits.lists.itemLimit);

  onMount(() => {
    const unsubscribe = isListUpdating.subscribe((value) => {
      isUpdating.set(value);
    });

    return {
      destroy: unsubscribe,
    };
  });

  const onRemoveHandler = $derived(
    attachWarning(
      removeFromList,
      m.remove_from_personal_list_warning({ list: list.name, title }),
    ),
  );
  const handler = $derived($isListed ? onRemoveHandler : addToList);
  const { color, variant, ...events } = $derived(
    useDangerButton({ isActive: $isListed, color: "blue" }),
  );
  const state = $derived($isListed ? "added" : "missing");

  const itemProps: Omit<ButtonProps, "children"> = $derived({
    style: "flat",
    label: i18n.label({ isListed: $isListed, listName: list.name, title }),
    color: $color,
    variant: $variant,
    onclick: handler,
    disabled: $isListUpdating || !isBelowLimit,
    ...events,
  });
</script>

<DropdownItem {...itemProps}>
  {i18n.text({ isListed: $isListed, listName: list.name, title })}

  {#snippet icon()}
    <WatchlistIcon size="small" {state} />
  {/snippet}
</DropdownItem>
