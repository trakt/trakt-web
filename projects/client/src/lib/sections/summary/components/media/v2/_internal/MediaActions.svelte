<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import TrackAction from "$lib/sections/media-actions/mark-as-watched/TrackAction.svelte";
  import SummaryActions from "../../../_internal/SummaryActions.svelte";
  import BookmarkAction from "./BookmarkAction.svelte";
  import MediaActionsPopupMenu from "./MediaActionsPopupMenu.svelte";
  import TrailerButton from "./TrailerButton.svelte";

  const {
    media,
    streamOn,
    title,
  }: { media: MediaEntry; streamOn?: StreamOn; title: string } = $props();

  const targetProps = $derived({
    title: media.title,
    type: media.type,
    media,
  });
</script>

<SummaryActions>
  <TrackAction {...targetProps} />
  <BookmarkAction {media} />
  <TrailerButton slug={media.slug} trailer={media.trailer} style="action" />
  <MediaActionsPopupMenu {media} {streamOn} {title} />
</SummaryActions>
