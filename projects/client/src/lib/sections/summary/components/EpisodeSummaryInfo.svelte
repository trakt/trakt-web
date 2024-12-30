<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import GenreList from "$lib/components/summary/GenreList.svelte";
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import type { ActiveWatcher } from "$lib/models/ActiveWatcher";
  import type { EpisodeEntry } from "$lib/models/EpisodeEntry";
  import type { EpisodeIntl } from "$lib/models/EpisodeIntl";
  import type { MediaRating } from "$lib/models/MediaRating";
  import type { MediaStats } from "$lib/models/MediaStats";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import type { Snippet } from "svelte";
  import MediaMetaInfo from "./MediaMetaInfo.svelte";
  import type { MediaSummary } from "./MediaSummary";

  const {
    episode,
    show,
    ratings,
    watchers,
    stats,
    intl,
    actions,
  }: {
    episode: EpisodeEntry;
    show: MediaSummary;
    ratings: MediaRating;
    watchers: ActiveWatcher[];
    stats: MediaStats;
    intl: EpisodeIntl;
    actions?: Snippet;
  } = $props();

  const isLargeDisplay = useMedia(WellKnownMediaQuery.desktop);
  const genreCount = $derived($isLargeDisplay ? undefined : 3);
</script>

<div class="trakt-summary-header">
  <h3
    class:short-title={episode.title.length < 15}
    class:long-title={episode.title.length > 25}
  >
    {intl.title}
  </h3>
  <GenreList genres={show.genres.slice(0, genreCount)} />
</div>

<MediaMetaInfo media={episode} {ratings} {stats} {watchers} />

<ClampedText
  classList="trakt-media-overview secondary"
  label={m.expand_media_overview({ title: episode.title })}
>
  {intl.overview}
</ClampedText>

<div class="trakt-info-actions">
  {@render actions?.()}
</div>

<style>
  .trakt-summary-header {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }

  :global(.trakt-media-overview) {
    line-height: 150%;
  }

  .trakt-info-actions {
    display: flex;
    gap: var(--ni-8);
  }

  h3 {
    --text-size: 7cqi;

    &.short-title {
      --text-size: 10cqi;
    }

    &.long-title {
      --text-size: 2.5cqi;
    }

    font-size: clamp(var(--ni-24), var(--text-size), var(--ni-48));
  }
</style>
