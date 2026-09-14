<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import TrackAction from "$lib/sections/media-actions/mark-as-watched/TrackAction.svelte";
  import SummaryActionsBar from "../../_internal/SummaryActionsBar.svelte";
  import BookmarkAction from "../../media/v2/_internal/BookmarkAction.svelte";
  import TrailerButton from "../../media/v2/_internal/TrailerButton.svelte";

  const { media }: { media: MediaEntry } = $props();

  const targetProps = $derived({
    title: media.title,
    type: media.type,
    media,
  });
</script>

<SummaryActionsBar>
  <TrackAction {...targetProps} />
  <BookmarkAction {media} />
  <TrailerButton slug={media.slug} trailer={media.trailer} style="action" />
</SummaryActionsBar>
