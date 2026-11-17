<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import ModerateAction from "$lib/sections/components/admin/ModerateAction.svelte";
  import ListAction from "$lib/sections/components/lists-drawer/ListAction.svelte";
  import SetCoverImageAction from "$lib/sections/media-actions/cover-image/SetCoverImageAction.svelte";
  import DropAction from "$lib/sections/media-actions/drop/DropAction.svelte";
  import { useIsDropped } from "$lib/sections/media-actions/drop/useIsDropped";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useIsWatched } from "$lib/sections/media-actions/mark-as-watched/useIsWatched";
  import RewatchingAction from "$lib/sections/media-actions/rewatching/RewatchingAction.svelte";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import HistoryButton from "$lib/sections/summary/components/history/HistoryButton.svelte";
  import SideActions from "./SideActions.svelte";

  type MediaPopupActionsProps = {
    media: MediaEntry;
    title: string;
    onListAction: () => void;
  };

  const {
    media,
    title,
    onListAction,
  }: MediaPopupActionsProps = $props();

  const { isWatched } = $derived(useIsWatched({ media, type: media.type }));
  const { isDropped } = $derived(useIsDropped(media));
  const show = $derived(media.type === "show" ? (media as ShowEntry) : null);
  const { buildDrawerLink } = summaryDrawerNavigation();
  const rewatchingDrawerLink = $derived(
    buildDrawerLink(SummaryDrawers.Rewatching),
  );
</script>

{#if $isWatched}
  <MarkAsWatchedAction
    style="dropdown-item"
    type={media.type}
    mode="ask"
    {title}
    {media}
  />
{/if}

{#if show}
  <RenderForFeature flag={FeatureFlag.Rewatching}>
    {#snippet enabled()}
      <RewatchingAction
        {show}
        {title}
        startLink={rewatchingDrawerLink}
      />
    {/snippet}
  </RenderForFeature>
{/if}

<ListAction
  style="dropdown-item"
  target={{ type: media.type, media }}
  {title}
  onClick={onListAction}
  variant="primary"
/>

<SideActions
  {title}
  style="dropdown-item"
  variant="primary"
  type={media.type}
  {media}
/>

<SetCoverImageAction
  style="dropdown-item"
  type={media.type}
  id={media.id}
  coverUrl={media.cover.url.medium}
  {title}
/>

<HistoryButton />

{#if media.type === "show" && !$isDropped}
  <DropAction
    style="dropdown-item"
    type="show"
    id={media.id}
    variant="primary"
    {title}
  />
{/if}

<ModerateAction />
