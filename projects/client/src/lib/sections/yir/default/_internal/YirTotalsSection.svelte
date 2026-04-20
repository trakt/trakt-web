<script lang="ts">
  import type { YirStatsCategory } from "$lib/requests/models/YirDetail";
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import FavoriteIcon from "$lib/components/icons/FavoriteIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import MarkAsWatchedIcon from "$lib/components/icons/MarkAsWatchedIcon.svelte";
  import { m } from "$lib/paraglide/messages";
  import { formatNumber } from "$lib/utils/format/formatNumber";

  type AllStats = YirStatsCategory & {
    listsCounts: { total: number };
  };

  const {
    stats,
    year,
  }: {
    stats: AllStats;
    year: number;
  } = $props();

  const hoursWatched = $derived(
    Math.round(stats.minutes.total / 60),
  );
</script>

<section class="yir-totals-section" id="section-totals">
  <div class="yir-page-inner">
    <div class="yir-section-header">
      <h2>
        <span class="yir-header-text">{m.yir_section_title_totals({ year })}</span>
      </h2>
    </div>

    <div class="yir-stats-row">
      <div class="yir-stat">
        <span class="yir-stat-number">{formatNumber(stats.playCounts.total)}</span>
        <span class="yir-stat-unit">
          <span class="yir-stat-icon"><MarkAsWatchedIcon state="unwatched" /></span>
          {stats.playCounts.total === 1 ? "play" : "plays"}
        </span>
      </div>

      <div class="yir-stat">
        <span class="yir-stat-number">{formatNumber(hoursWatched)}</span>
        <span class="yir-stat-unit">
          <span class="yir-stat-icon"><ClockIcon /></span>
          {hoursWatched === 1 ? "hour" : "hours"}
        </span>
      </div>

      <div class="yir-stat">
        <span class="yir-stat-number">{formatNumber(stats.collectedCounts.total)}</span>
        <span class="yir-stat-unit">
          <span class="yir-stat-icon"><BookmarkIcon state="added" /></span>
          collected
        </span>
      </div>
    </div>

    <div class="yir-stats-row">
      <div class="yir-stat">
        <span class="yir-stat-number">{formatNumber(stats.ratingsCounts.total)}</span>
        <span class="yir-stat-unit">
          <span class="yir-stat-icon"><FavoriteIcon state="filled" /></span>
          {stats.ratingsCounts.total === 1 ? "rating" : "ratings"}
        </span>
      </div>

      <div class="yir-stat">
        <span class="yir-stat-number">{formatNumber(stats.commentsCounts.total)}</span>
        <span class="yir-stat-unit">
          <span class="yir-stat-icon"><CommentIcon style="filled" /></span>
          {stats.commentsCounts.total === 1 ? "comment" : "comments"}
        </span>
      </div>

      <div class="yir-stat">
        <span class="yir-stat-number">{formatNumber(stats.listsCounts.total)}</span>
        <span class="yir-stat-unit">
          <span class="yir-stat-icon"><ListIcon /></span>
          {stats.listsCounts.total === 1 ? "list" : "lists"}
        </span>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;
  @use "./shared" as *;

  .yir-totals-section {
    background-color: var(--shade-1000);
  }

  .yir-page-inner {
    padding-bottom: var(--ni-72);
  }

  .yir-section-header {
    padding: var(--ni-72) 0;

    @include for-mobile {
      padding: var(--ni-40) 0;
    }
  }

  .yir-stats-row {
    display: flex;
    justify-content: center;
    padding: 0 20% var(--ni-40) 20%;

    &:last-child {
      padding-bottom: var(--ni-20);
    }

    @include for-tablet-sm-and-below {
      padding-left: 10%;
      padding-right: 10%;
    }

    @include for-mobile {
      padding-left: 3%;
      padding-right: 3%;
    }
  }

  .yir-stat {
    flex: 1;
    text-align: center;
  }

  .yir-stat-number {
    display: block;
    font-size: 60px;
    font-weight: bold;
    line-height: 1;
    color: var(--shade-10);

    @include for-tablet-sm-and-below {
      font-size: 45px;
    }

    @include for-mobile {
      font-size: 30px;
    }
  }

  .yir-stat-unit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xxs);
    font-size: 14px;
    text-transform: uppercase;
    color: var(--shade-300);
    margin-top: 0;
  }

  .yir-stat-icon {
    display: inline-flex;
    align-items: center;

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }
</style>
