<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import FavoriteButton from "$lib/components/buttons/favorite/FavoriteButton.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
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
    navigationType?: DpadNavigationType;
  };

  const {
    style = "action",
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

  const onRemoveHandler = $derived(
    attachWarning(
      removeFromFavorites,
      m.warning_prompt_remove_from_favorites({ title }),
    ),
  );

  onMount(() => {
    return isUpdatingFavorite.subscribe((value) => onAction?.(value));
  });
</script>

<FavoriteButton
  {style}
  {title}
  {navigationType}
  isFavorited={$isFavorited}
  isFavoriteUpdating={$isUpdatingFavorite}
  onAdd={addToFavorites}
  onRemove={onRemoveHandler}
/>
