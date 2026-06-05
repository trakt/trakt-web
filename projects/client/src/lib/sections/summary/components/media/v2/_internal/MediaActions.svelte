<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ListsDrawer from "$lib/sections/components/lists-drawer/ListsDrawer.svelte";
  import TrackAction from "$lib/sections/media-actions/mark-as-watched/TrackAction.svelte";
  import SummaryActionsBar from "../../../_internal/SummaryActionsBar.svelte";
  import BookmarkAction from "./BookmarkAction.svelte";
  import MediaPopupActions from "./MediaPopupActions.svelte";
  import TrailerButton from "./TrailerButton.svelte";

  const { media, title }: { media: MediaEntry; title: string } = $props();

  let isListsDrawerOpen = $state(false);

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
    onListAction={() => (isListsDrawerOpen = true)}
  />
{/snippet}

<SummaryActionsBar popup={{ actions: popupActions, title }}>
  <TrackAction {...targetProps} />
  <BookmarkAction {media} />
  <TrailerButton slug={media.slug} trailer={media.trailer} style="action" />
</SummaryActionsBar>

{#if isListsDrawerOpen}
  <ListsDrawer onClose={() => (isListsDrawerOpen = false)} {media} {title} />
{/if}
