<script lang="ts">
  import FavoriteButton from "$lib/components/buttons/favorite/FavoriteButton.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { onMount } from "svelte";
  import NotePrompt from "../_internal/NotePrompt.svelte";
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

  let showNotePrompt = $state(false);

  const {
    isUpdatingFavorite,
    isFavorited,
    addToFavorites: doAddToFavorites,
    removeFromFavorites,
  } = $derived(useFavorites({ type, id, title }));

  const addToFavorites = async () => {
    await doAddToFavorites();
    showNotePrompt = true;
  };

  const closePrompt = () => {
    showNotePrompt = false;
  };

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

<NotePrompt
  open={showNotePrompt}
  onOpenChange={(open) => {
    if (!open) showNotePrompt = false;
  }}
  onDismiss={closePrompt}
  {title}
  {type}
  {id}
  noteType="favorites"
>
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
</NotePrompt>
