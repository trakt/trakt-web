<script lang="ts">
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
    <DefaultMediaPopupActions {media} />
    <HideRecommendationAction {media} />
  {/snippet}
</DefaultMediaItem>
