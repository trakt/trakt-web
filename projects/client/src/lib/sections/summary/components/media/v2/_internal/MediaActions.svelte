<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { manageListsDrawerStore } from "$lib/sections/components/lists-drawer/manageListsDrawerStore";
  import TrackAction from "$lib/sections/media-actions/mark-as-watched/TrackAction.svelte";
  import MediaReactionsAction from "$lib/sections/summary/components/reactions/MediaReactionsAction.svelte";
  import SummaryActionsBar from "../../../_internal/SummaryActionsBar.svelte";
  import BookmarkAction from "./BookmarkAction.svelte";
  import MediaPopupActions from "./MediaPopupActions.svelte";
  import TrailerButton from "./TrailerButton.svelte";

  const { media, title }: { media: MediaEntry; title: string } = $props();

  const targetProps = $derived({
    title: media.title,
    type: media.type,
    media,
  });
</script>

{#snippet popupActions()}
  <MediaPopupActions
    {media}
    {title}
    onListAction={() => manageListsDrawerStore.open({ media, title })}
  />
{/snippet}

<SummaryActionsBar popup={{ actions: popupActions, title }}>
  <TrackAction {...targetProps} />
  <BookmarkAction {media} />
  <RenderForFeature flag={FeatureFlag.Reactions}>
    {#snippet enabled()}
      <MediaReactionsAction
        target={{ type: media.type, id: media.id, slug: media.slug }}
      />
    {/snippet}
  </RenderForFeature>
  <TrailerButton slug={media.slug} trailer={media.trailer} style="action" />
</SummaryActionsBar>
