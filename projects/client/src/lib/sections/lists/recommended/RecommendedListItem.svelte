<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { manageListsDrawerStore } from "$lib/sections/components/lists-drawer/manageListsDrawerStore";
  import HideRecommendationAction from "$lib/sections/media-actions/hide-recommendation/HideRecommendationAction.svelte";
  import DefaultMediaItem from "../components/DefaultMediaItem.svelte";
  import DefaultMediaPopupActions from "../components/DefaultMediaPopupActions.svelte";
  import type { MediaCardProps } from "../components/models/MediaCardProps";
  import type { RecommendedEntry } from "./useRecommendedList";
  import RecommendationSourcesDrawer from "./RecommendationSourcesDrawer.svelte";
  import { toRecommendationWhyTracking } from "./toRecommendationWhyTracking.ts";

  const { type, media, style, mode }: MediaCardProps<RecommendedEntry> =
    $props();

  let isSourcesDrawerOpen = $state(false);
  const { track } = useTrack(AnalyticsEvent.RecommendationWhy);

  const openSources = () => {
    track(toRecommendationWhyTracking(media));
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
  <RecommendationSourcesDrawer
    sources={media.sources}
    people={media.people}
    title={media.title}
    onClose={() => (isSourcesDrawerOpen = false)}
  />
{/if}
