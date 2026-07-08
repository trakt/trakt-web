<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import TrendLineUpIcon from "$lib/components/icons/TrendLineUpIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { useAllTimeStatsDetails } from "../../../stores/useAllTimeStatsDetails.ts";
  import AllTimeReviewLink from "../AllTimeReviewLink.svelte";
  import AllTimeStatTile from "../AllTimeStatTile.svelte";
  import type { StatIconKey } from "../StatIconKey.ts";

  const ANALYTICS_SOURCE = "all-time-stats";

  type AllTimeStatsDrawerHostProps = {
    onClose: () => void;
  };

  const { onClose }: AllTimeStatsDrawerHostProps = $props();

  const { details, isLoading } = useAllTimeStatsDetails();

  const now = new Date();
  const currentYear =
    now.getUTCMonth() === 0 ? now.getUTCFullYear() - 1 : now.getUTCFullYear();
  const previousYear = currentYear - 1;

  const yearToDateHref = UrlBuilder.users("me").yearToDate(currentYear);
  const yearInReviewHref = UrlBuilder.users("me").yearToDate(previousYear);

  const { track } = useTrack(AnalyticsEvent.Link);

  type StatTile = {
    key: StatIconKey;
    label: string;
    value: number | null;
  };

  type StatSection = {
    key: string;
    title: string;
    tiles: StatTile[];
  };

  const sections = $derived<StatSection[]>([
    {
      key: "watched",
      title: m.header_stats_watched(),
      tiles: [
        {
          key: "plays",
          label: m.label_stats_plays(),
          value: $details.playCount,
        },
        {
          key: "hours",
          label: m.label_stats_hours(),
          value: Math.round($details.minuteCount / 60),
        },
        {
          key: "movies",
          label: m.label_stats_movies(),
          value: $details.movieCount,
        },
        {
          key: "shows",
          label: m.label_stats_shows(),
          value: $details.showCount,
        },
        {
          key: "episodes",
          label: m.label_stats_episodes(),
          value: $details.episodeCount,
        },
      ],
    },
    {
      key: "contributions",
      title: m.header_stats_contributions(),
      tiles: [
        {
          key: "ratings",
          label: m.label_stats_ratings(),
          value: $details.ratingCount,
        },
        {
          key: "comments",
          label: m.label_stats_comments(),
          value: $details.commentCount,
        },
        {
          key: "lists",
          label: m.stat_text_lists(),
          value: $details.listCount,
        },
      ],
    },
    {
      key: "progress",
      title: m.header_stats_progress(),
      tiles: [
        {
          key: "started",
          label: m.tag_text_started(),
          value: $details.startedCount,
        },
        {
          key: "finished",
          label: m.label_stats_finished(),
          value: $details.finishedCount,
        },
        {
          key: "dropped",
          label: m.tag_text_dropped(),
          value: $details.droppedCount,
        },
      ],
    },
  ]);

  const hasLockedStats = $derived(
    sections.some((section) => section.tiles.some((tile) => tile.value == null)),
  );
</script>

<Drawer {onClose} title={m.text_all_time()} size="auto">
  <div class="trakt-all-time-stats-drawer">
    {#each sections as section (section.key)}
      <section class="all-time-stats-section">
        <h3 class="bold secondary small capitalize">{section.title}</h3>

        <div class="all-time-stats-grid">
          {#each section.tiles as tile (tile.key)}
            <AllTimeStatTile
              stat={tile.key}
              label={tile.label}
              value={tile.value}
              isLoading={$isLoading}
            />
          {/each}
        </div>
      </section>
    {/each}

    {#if !$isLoading && hasLockedStats}
      <UpsellCta source={ANALYTICS_SOURCE}>
        {m.text_vip_upsell_more_stats()}
      </UpsellCta>
    {/if}

    <div class="all-time-stats-review-links">
      <AllTimeReviewLink
        href={yearInReviewHref}
        label={m.button_label_year_in_review({ year: `${previousYear}` })}
        text={m.button_text_year_in_review({ year: `${previousYear}` })}
        onclick={() =>
          track({ source: ANALYTICS_SOURCE, target: yearInReviewHref })}
      >
        {#snippet icon()}
          <SparkleIcon />
        {/snippet}
      </AllTimeReviewLink>

      <AllTimeReviewLink
        href={yearToDateHref}
        label={m.button_label_year_to_date()}
        text={m.button_text_year_to_date()}
        onclick={() => track({ source: ANALYTICS_SOURCE, target: yearToDateHref })}
      >
        {#snippet icon()}
          <TrendLineUpIcon />
        {/snippet}
      </AllTimeReviewLink>
    </div>
  </div>
</Drawer>

<style lang="scss">
  .trakt-all-time-stats-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

  .all-time-stats-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .all-time-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--gap-s);
  }

  .all-time-stats-review-links {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding-block-start: var(--gap-l);

    &::before {
      content: "";

      position: absolute;
      inset-block-start: 0;
      inset-inline: 0;

      height: var(--ni-2);

      background: radial-gradient(
        60% 100% at 50% 50%,
        color-mix(in srgb, var(--color-foreground) 20%, transparent),
        transparent 70%
      );
    }
  }
</style>
