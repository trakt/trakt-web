<script lang="ts">
  import AirDate from "$lib/components/media/tags/AirDateTag.svelte";
  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
  import PlaysTag from "$lib/components/media/tags/PlaysTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import type { ActiveWatcher } from "$lib/requests/models/ActiveWatcher";
  import type { MediaRating } from "$lib/requests/models/MediaRating";
  import type { MediaStats } from "$lib/requests/models/MediaStats";

  type MediaMetaInfoProps = {
    certification?: string | Nil;
    airDate: Date;
    year: number | Nil;
    ratings: MediaRating;
    stats: MediaStats;
    watchers: ActiveWatcher[];
  };

  const { certification, year, ratings, stats, airDate }: MediaMetaInfoProps =
    $props();
</script>

<div class="trakt-summary-meta">
  <RatingList {ratings} />
  <div class="trakt-meta-tags">
    {#if certification}
      <InfoTag>
        {certification}
      </InfoTag>
    {/if}

    {#if year}
      <AirDate i18n={TagIntlProvider} {year} {airDate} />
    {/if}

    <!-- FIXME: re-enable watchers once we have better watching stats -->

    <PlaysTag i18n={TagIntlProvider} plays={stats.plays} />
  </div>
</div>

<style>
  .trakt-summary-meta {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-meta-tags {
    display: flex;
    gap: var(--gap-xs);
  }
</style>
