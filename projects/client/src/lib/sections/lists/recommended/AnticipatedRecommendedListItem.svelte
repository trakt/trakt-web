<script lang="ts">
  import { manageListsDrawerStore } from "$lib/sections/components/lists-drawer/manageListsDrawerStore";
  import HideRecommendationAction from "$lib/sections/media-actions/hide-recommendation/HideRecommendationAction.svelte";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import DefaultMediaPopupActions from "../components/DefaultMediaPopupActions.svelte";
  import type { MediaCardProps } from "../components/models/MediaCardProps";
  import type { AnticipatedRecommendedEntry } from "./useAnticipatedRecommendedList";

  const {
    type,
    media,
    style,
    mode,
  }: MediaCardProps<AnticipatedRecommendedEntry> = $props();
</script>

<DefaultMediaItem
  {type}
  {media}
  {style}
  {mode}
  source="recommended"
  canDeemphasize
>
  {#snippet popupActions()}
    <DefaultMediaPopupActions
      {media}
      onListAction={() =>
        manageListsDrawerStore.open({
          target: { type: media.type, media },
          title: media.title,
          metaInfo: media.title,
        })}
    />
    <HideRecommendationAction {media} />
  {/snippet}
</DefaultMediaItem>
