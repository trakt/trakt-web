<script lang="ts">
  import FavoriteButton from "$lib/components/buttons/favorite/FavoriteButton.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { onMount } from "svelte";
  import { useFavorites } from "./useFavorites";

  type FavoriteActionProps = {
    style?: "action" | "normal" | "dropdown-item";
    size?: "small" | "normal";
    title: string;
    type: MediaType;
    id: number;
    onAction?: (state: boolean) => void;
    navigationType?: DpadNavigationType;
  };

  const {
    style = "action",
    size = "normal",
    title,
    type,
    id,
    onAction,
    navigationType,
  }: FavoriteActionProps = $props();

  const {
    isUpdatingFavorite,
    isFavorited,
    addToFavorites,
    removeFromFavorites,
  } = $derived(useFavorites({ type, id }));

  const { confirm } = useConfirm();
  const confirmRemove = $derived(
    confirm({
      type: ConfirmationType.RemoveFavorite,
      title,
      onConfirm: removeFromFavorites,
    }),
  );

  onMount(() => {
    return isUpdatingFavorite.subscribe((value) => onAction?.(value));
  });
</script>

<FavoriteButton
  {style}
  {title}
  {navigationType}
  {size}
  isFavorited={$isFavorited}
  isFavoriteUpdating={$isUpdatingFavorite}
  onAdd={addToFavorites}
  onRemove={confirmRemove}
/>
