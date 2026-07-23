<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { manageListsDrawerStore } from "$lib/sections/components/lists-drawer/manageListsDrawerStore";
  import HideRecommendationAction from "$lib/sections/media-actions/hide-recommendation/HideRecommendationAction.svelte";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import DefaultMediaPopupActions from "../components/DefaultMediaPopupActions.svelte";
  import type { MediaCardProps } from "../components/models/MediaCardProps";
  import type { RecommendedEntry } from "./useRecommendedList";
  import RecommendationSourcesDrawer from "./RecommendationSourcesDrawer.svelte";

  const { type, media, style, mode }: MediaCardProps<RecommendedEntry> =
    $props();

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
    <DefaultMediaPopupActions
      {media}
      onListAction={() =>
        manageListsDrawerStore.open({ media, metaInfo: media.title })}
    />
    <HideRecommendationAction {media} />
  {/snippet}
</DefaultMediaItem>

{#if isSourcesDrawerOpen}
  <RecommendationSourcesDrawer
    sources={media.sources}
    title={media.title}
    onClose={() => (isSourcesDrawerOpen = false)}
  />
{/if}
