<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import FavoriteButton from "$lib/components/buttons/favorite/FavoriteButton.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { onMount } from "svelte";
  import { attachWarning } from "../_internal/attachWarning";
  import { useFavorites } from "./useFavorites";

  type FavoriteActionProps = {
    style?: "action" | "normal" | "dropdown-item";
    title: string;
    type: MediaType;
    id: number;
    onAction?: (state: boolean) => void;
  };

  const {
    style = "action",
    title,
    type,
    id,
    onAction,
  }: FavoriteActionProps = $props();

  const {
    isUpdatingFavorite,
    isFavorited,
    addToFavorites,
    removeFromFavorites,
  } = $derived(useFavorites({ type, id }));

  const onRemoveHandler = $derived(
    attachWarning(
      removeFromFavorites,
      m.remove_from_favorites_warning({ title }),
    ),
  );

  onMount(() => {
    return isUpdatingFavorite.subscribe((value) => onAction?.(value));
  });
</script>

<FavoriteButton
  {style}
  {title}
  isFavorited={$isFavorited}
  isFavoriteUpdating={$isUpdatingFavorite}
  onAdd={addToFavorites}
  onRemove={onRemoveHandler}
/>
