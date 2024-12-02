<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import YouTubeIcon from "$lib/components/icons/YouTubeIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { useMedia, WellKnownMediaQuery } from "$lib/utils/css/useMedia";
  import type { MediaSummary } from "./MediaSummary";
  import type { MediaSummaryProps } from "./MediaSummaryProps";

  const { media, ratings }: MediaSummaryProps<MediaSummary> = $props();
  const isLargeDisplay = useMedia(WellKnownMediaQuery.desktop);
  const genreCount = $derived($isLargeDisplay ? -1 : 3);
</script>

<div class="trakt-summary-header">
  <h3>{media.title}</h3>
  <GenreList genres={media.genres.slice(0, genreCount)} />
</div>

<RatingList {ratings} />

<p class="trakt-media-overview secondary">{media.overview}</p>

<div class="trakt-info-actions">
  <Link href={media.trailer} target="_blank">
    <Button label={"Trailer"} variant="vip">
      {m.watch_the_trailer()}
      {#snippet subtitle()}
        YouTube
      {/snippet}
      {#snippet icon()}
        <YouTubeIcon />
      {/snippet}
    </Button>
  </Link>
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
</style>
