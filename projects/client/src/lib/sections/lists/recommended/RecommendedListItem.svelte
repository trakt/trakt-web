<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ListsDrawer from "$lib/sections/components/lists-drawer/ListsDrawer.svelte";
  import HideRecommendationAction from "$lib/sections/media-actions/hide-recommendation/HideRecommendationAction.svelte";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import DefaultMediaPopupActions from "../components/DefaultMediaPopupActions.svelte";
  import type { MediaCardProps } from "../components/models/MediaCardProps";
  import type { RecommendedEntry } from "./useRecommendedList";
  import RecommendationSourcesDrawer from "./RecommendationSourcesDrawer.svelte";

  const { type, media, style, mode }: MediaCardProps<RecommendedEntry> =
    $props();

  let isListsDrawerOpen = $state(false);
  let isSourcesDrawerOpen = $state(false);
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
    <DropdownItem
      onclick={() => (isSourcesDrawerOpen = true)}
      style="flat"
      color="default"
      variant="secondary"
      label={m.button_text_view_recommendation_sources()}
    >
      {m.button_text_view_recommendation_sources()}
      {#snippet icon()}
        <SparkleIcon />
      {/snippet}
    </DropdownItem>
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

{#if isSourcesDrawerOpen}
  <RecommendationSourcesDrawer
    sources={media.sources}
    title={media.title}
    onClose={() => (isSourcesDrawerOpen = false)}
  />
{/if}
