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
  import RecommendationReasonsDrawerHost from "./RecommendationReasonsDrawerHost.svelte";

  const { type, media, style, mode }: MediaCardProps<RecommendedEntry> =
    $props();

  let isSourcesDrawerOpen = $state(false);
  const openSources = () => {
    isSourcesDrawerOpen = true;
  };
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
      onclick={openSources}
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
        manageListsDrawerStore.open({
          target: { type: media.type, media },
          title: media.title,
          metaInfo: media.title,
        })}
    />
    <HideRecommendationAction {media} />
  {/snippet}
</DefaultMediaItem>

{#if isSourcesDrawerOpen}
  <RecommendationReasonsDrawerHost
    type={media.type}
    id={media.id}
    sources={media.sources}
    people={media.people}
    title={media.title}
    onClose={() => (isSourcesDrawerOpen = false)}
  />
{/if}
