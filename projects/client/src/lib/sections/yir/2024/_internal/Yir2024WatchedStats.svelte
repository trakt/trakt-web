<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import type { YirStatsCategory } from "$lib/requests/models/YirDetail";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type AllStats = YirStatsCategory & {
    listsCounts: { total: number };
  };

  const {
    stats,
    slug,
  }: {
    stats: AllStats;
    slug: string;
  } = $props();

  const hours = $derived(Math.round(stats.minutes.total / 60));
  const historyUrl = $derived(UrlBuilder.profile.history(slug));
</script>

<div class="trakt-yir-2024-watched-stats">
  <span class="yir-2024-stat yir-2024-stat-link">
    <Link href={historyUrl} color="inherit">
      <span class="yir-2024-stat-row">
        <span class="yir-2024-stat-icon">
          <PlayIcon />
        </span>
        <span class="yir-2024-stat-display">
          <span class="bold yir-2024-stat-value">
            {formatNumber(stats.playCounts.total)}
          </span>
          <span class="bold yir-2024-stat-label">
            {stats.playCounts.total === 1 ? "play" : "plays"}
          </span>
        </span>
      </span>
    </Link>
  </span>

  <span class="yir-2024-stat">
    <span class="yir-2024-stat-icon"><ClockIcon /></span>
    <span class="yir-2024-stat-display">
      <span class="bold yir-2024-stat-value">{formatNumber(hours)}</span>
      <span class="bold yir-2024-stat-label">
        {hours === 1 ? "hour" : "hours"}
      </span>
    </span>
  </span>

  <span class="yir-2024-stat">
    <span class="yir-2024-stat-icon"><StarIcon fill="full" /></span>
    <span class="yir-2024-stat-display">
      <span class="bold yir-2024-stat-value">
        {formatNumber(stats.ratingsCounts.total)}
      </span>
      <span class="bold yir-2024-stat-label">
        {stats.ratingsCounts.total === 1 ? "rating" : "ratings"}
      </span>
    </span>
  </span>

  <span class="yir-2024-stat">
    <span class="yir-2024-stat-icon"><CommentIcon style="filled" /></span>
    <span class="yir-2024-stat-display">
      <span class="bold yir-2024-stat-value">
        {formatNumber(stats.commentsCounts.total)}
      </span>
      <span class="bold yir-2024-stat-label">
        {stats.commentsCounts.total === 1 ? "comment" : "comments"}
      </span>
    </span>
  </span>

  <span class="yir-2024-stat">
    <span class="yir-2024-stat-icon"><ListIcon /></span>
    <span class="yir-2024-stat-display">
      <span class="bold yir-2024-stat-value">
        {formatNumber(stats.listsCounts.total)}
      </span>
      <span class="bold yir-2024-stat-label">
        {stats.listsCounts.total === 1 ? "list" : "lists"}
      </span>
    </span>
  </span>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-2024-watched-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-xl);

    @include for-tablet-lg-and-below {
      gap: var(--ni-20);
    }

    @include for-tablet-sm-and-below {
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--gap-xl);
    }

    @include for-mobile {
      gap: var(--ni-20);
    }
  }

  // Each stat (linked or static) shares the same row layout. The link
  // variant additionally hover-scales its inner Link content.
  .yir-2024-stat,
  .yir-2024-stat-row {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-m);
    color: var(--color-yir-text-primary);

    @include for-tablet-lg-and-below {
      gap: var(--gap-s);
    }
  }

  .yir-2024-stat-link :global(.trakt-link) {
    text-decoration: none;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.08);
    }
  }

  .yir-2024-stat-icon {
    display: inline-flex;
    align-items: center;
    color: var(--color-yir-text-primary);
    flex-shrink: 0;

    :global(svg) {
      width: var(--ni-36);
      height: var(--ni-36);
    }

    @include for-tablet-lg-and-below {
      :global(svg) {
        width: var(--ni-28);
        height: var(--ni-28);
      }
    }

    // iPad-mini-sized tablets (481-768px) wrap the stats to two rows so
    // there's room for slightly larger icons that read better at tablet
    // viewing distance.
    @include for-tablet-sm {
      :global(svg) {
        width: var(--ni-36);
        height: var(--ni-36);
      }
    }

    @include for-mobile {
      :global(svg) {
        width: var(--ni-32);
        height: var(--ni-32);
      }
    }
  }

  .yir-2024-stat-display {
    display: flex;
    flex-direction: column;
  }

  .yir-2024-stat-value {
    font-size: var(--ni-36);

    @include for-tablet-lg-and-below {
      font-size: var(--ni-28);
    }

    @include for-mobile {
      font-size: var(--ni-22);
    }
  }

  .yir-2024-stat-label {
    font-size: var(--font-size-text);
    color: var(--color-yir-text-secondary);
    text-transform: uppercase;

    @include for-mobile {
      font-size: var(--ni-12);
    }
  }
</style>
