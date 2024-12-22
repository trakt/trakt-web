<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import type { MediaStats } from "$lib/models/MediaStats";
  import type { MediaStudio } from "$lib/models/MediaStudio";
  import type { MovieSummary } from "$lib/requests/models/MovieSummary";
  import RelatedList from "../lists/RelatedList.svelte";
  import MediaSummary from "./components/MediaSummary.svelte";
  import type { MediaSummaryProps } from "./components/MediaSummaryProps";

  const {
    media,
    ratings,
    stats,
    watchers,
    studios,
    intl,
  }: MediaSummaryProps<MovieSummary> & {
    stats: MediaStats;
    studios: MediaStudio[];
  } = $props();
</script>

<MediaSummary {media} {ratings} {stats} {watchers} {studios} {intl} type="movie" />

<RelatedList title={m.related_movies_title()} slug={media.slug} type="movie" />
