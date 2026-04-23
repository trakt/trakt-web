<script lang="ts">
  import ListsDrawer from "$lib/sections/components/lists-drawer/ListsDrawer.svelte";
  import HideRecommendationAction from "$lib/sections/media-actions/hide-recommendation/HideRecommendationAction.svelte";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import DefaultMediaPopupActions from "../components/DefaultMediaPopupActions.svelte";
  import type { MediaCardProps } from "../components/models/MediaCardProps";
  import type { RecommendedEntry } from "./useRecommendedList";

  const { type, media, style, mode }: MediaCardProps<RecommendedEntry> =
    $props();

  let isListsDrawerOpen = $state(false);
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
      onListAction={() => (isListsDrawerOpen = true)}
    />
    <HideRecommendationAction {media} />
  {/snippet}
</DefaultMediaItem>

{#if isListsDrawerOpen}
  <ListsDrawer
    {media}
    onClose={() => (isListsDrawerOpen = false)}
    metaInfo={media.title}
  />
{/if}
