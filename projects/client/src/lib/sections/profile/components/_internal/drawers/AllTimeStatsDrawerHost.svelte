<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import BlockIcon from "$lib/components/icons/BlockIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SmartListIcon from "$lib/components/icons/SmartListIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { useAllTimeStatsDetails } from "../../../stores/useAllTimeStatsDetails.ts";
  import AllTimeStatRow from "../AllTimeStatRow.svelte";

  const UPSELL_SOURCE = "all-time-stats";

  const { onClose }: { onClose: () => void } = $props();

  const { details, isLoading } = useAllTimeStatsDetails();
  const { user } = useUser();

  const isVip = $derived($user?.isVip ?? false);

  const now = new Date();
  // In January the current year has no meaningful year-to-date yet, so treat
  // the previous year as the "current" review year (mirrors ThisYear.svelte).
  const currentYear = now.getMonth() === 0
    ? now.getFullYear() - 1
    : now.getFullYear();
  const previousYear = currentYear - 1;

  const yearToDateHref = UrlBuilder.users("me").yearToDate(currentYear);
  const yearInReviewHref = UrlBuilder.users("me").yearToDate(previousYear);

  const { track } = useTrack(AnalyticsEvent.Link);

  const toValue = (value: number | null) =>
    value == null ? "" : toHumanNumber(value, languageTag());

  type StatRow = {
    key: string;
    label: string;
    value: string;
    locked: boolean;
  };

  const rows = $derived<StatRow[]>([
    {
      key: "plays",
      label: m.label_stats_plays(),
      value: toValue($details.playCount),
      locked: false,
    },
    {
      key: "hours",
      label: m.label_stats_hours(),
      value: toValue(Math.round($details.minuteCount / 60)),
      locked: false,
    },
    {
      key: "movies",
      label: m.label_stats_movies(),
      value: toValue($details.movieCount),
      locked: false,
    },
    {
      key: "shows",
      label: m.label_stats_shows(),
      value: toValue($details.showCount),
      locked: false,
    },
    {
      key: "episodes",
      label: m.label_stats_episodes(),
      value: toValue($details.episodeCount),
      locked: false,
    },
    {
      key: "comments",
      label: m.label_stats_comments(),
      value: toValue($details.commentCount),
      locked: false,
    },
    {
      key: "ratings",
      label: m.label_stats_ratings(),
      value: toValue($details.ratingCount),
      locked: false,
    },
    {
      key: "lists",
      label: m.stat_text_lists(),
      value: toValue($details.listCount),
      locked: false,
    },
    {
      key: "dropped",
      label: m.tag_text_dropped(),
      value: toValue($details.droppedCount),
      locked: false,
    },
    {
      key: "started",
      label: m.tag_text_started(),
      value: toValue($details.startedCount),
      locked: !isVip,
    },
    {
      key: "finished",
      label: m.label_stats_finished(),
      value: toValue($details.finishedCount),
      locked: !isVip,
    },
  ]);
</script>

{#snippet statIcon(key: string)}
  {#if key === "plays" || key === "started"}
    <PlayIcon />
  {:else if key === "hours"}
    <ClockIcon />
  {:else if key === "movies"}
    <MovieIcon />
  {:else if key === "shows" || key === "episodes"}
    <ShowIcon />
  {:else if key === "comments"}
    <CommentIcon />
  {:else if key === "ratings"}
    <StarIcon fill="full" />
  {:else if key === "lists"}
    <SmartListIcon />
  {:else if key === "dropped"}
    <BlockIcon />
  {:else if key === "finished"}
    <CheckIcon />
  {/if}
{/snippet}

<Drawer {onClose} title={m.text_all_time()} size="normal">
  <div class="trakt-all-time-stats-drawer">
    <div class="all-time-stats-list">
      {#each rows as row (row.key)}
        <AllTimeStatRow
          label={row.label}
          value={row.value}
          isLoading={$isLoading}
          locked={row.locked}
        >
          {#snippet icon()}
            {@render statIcon(row.key)}
          {/snippet}
        </AllTimeStatRow>
      {/each}
    </div>

    {#if !isVip}
      <UpsellCta source={UPSELL_SOURCE}>
        {m.text_vip_upsell_progress_stats()}
      </UpsellCta>
    {/if}

    <div class="all-time-stats-review-links">
      <Button
        href={yearInReviewHref}
        onclick={() => track({ source: UPSELL_SOURCE, target: yearInReviewHref })}
        label={m.button_label_year_in_review({ year: `${previousYear}` })}
        size="small"
      >
        <p class="capitalize">
          {m.button_text_year_in_review({ year: `${previousYear}` })}
        </p>
        {#snippet icon()}
          <CaretRightIcon />
        {/snippet}
      </Button>

      <Button
        href={yearToDateHref}
        onclick={() => track({ source: UPSELL_SOURCE, target: yearToDateHref })}
        label={m.button_label_year_to_date()}
        size="small"
      >
        <p class="capitalize">{m.button_text_year_to_date()}</p>
        {#snippet icon()}
          <CaretRightIcon />
        {/snippet}
      </Button>
    </div>
  </div>
</Drawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-all-time-stats-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .all-time-stats-review-links {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    :global(.trakt-button-link) {
      border: var(--ni-1) solid var(--color-text-primary);
    }

    // Match the card hover: recolor the stroke to purple and drop the flat
    // button's lift (transform + raised shadow).
    @include for-mouse {
      :global(
          .trakt-button-link[data-style="flat"]:hover:not([disabled]):not(
              [aria-disabled="true"]
            )
        ),
      :global(
          .trakt-button-link[data-style="flat"]:focus-visible:not(
              [disabled]
            ):not([aria-disabled="true"])
        ) {
        transform: none;
        box-shadow: none;
        border-color: var(--color-card-border-hover);
      }
    }
  }
</style>
