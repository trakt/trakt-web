<script lang="ts">
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import MediaMetaInfo from "./MediaMetaInfo.svelte";
  import type { MediaSummary } from "./MediaSummary";
  import type { MediaSummaryProps } from "./MediaSummaryProps";
  import YoutubeButton from "./YoutubeButton.svelte";

  const { media, ratings, watchers, intl }: MediaSummaryProps<MediaSummary> =
    $props();
  const isLargeDisplay = useMedia(WellKnownMediaQuery.desktop);
  const genreCount = $derived($isLargeDisplay ? -1 : 3);
</script>

<div class="trakt-summary-header">
  <h3>{intl.title}</h3>
  <GenreList genres={media.genres.slice(0, genreCount)} />
</div>

<MediaMetaInfo {media} {ratings} {watchers} />

<p class="trakt-media-overview secondary">{intl.overview}</p>

<div class="trakt-info-actions">
  <YoutubeButton trailer={media.trailer} />
</div>

<style>
  .trakt-summary-header {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  .trakt-media-overview {
    line-height: 150%;
  }

  .trakt-info-actions {
    display: flex;
    gap: var(--ni-8);
  }
</style>
