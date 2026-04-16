<script lang="ts">
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import BannerContainer from "$lib/sections/banner/_internal/BannerContainer.svelte";
  import {
      dashboardDrawerNavigation,
      DashboardDrawers,
  } from "../dashboard/_internal/dashboardDrawerNavigation";
  import StreakIcon from "./_internal/icons/StreakIcon.svelte";
  import StreakAccumulator from "./_internal/StreakAccumulator.svelte";
  import { useActivityHeatmap } from "./_internal/useActivityHeatmap.ts";
  import { useStreak } from "./_internal/useStreak";

  const { mode } = useDiscover();
  const { streakCount, streakState, isLoading } = $derived(
    useStreak({ mode: $mode }),
  );
  const { heatmap } = $derived(useActivityHeatmap({ mode: $mode }));
  const { buildDrawerLink } = dashboardDrawerNavigation();
  const drilldownLink = $derived(buildDrawerLink(DashboardDrawers.Streak));

  type Tier = {
    threshold: number;
    message: string;
    exactMessage: string;
  };

  const tiers: ReadonlyArray<Tier> = [
    {
      threshold: 365,
      message: m.text_stats_streak_every_single_day(),
      exactMessage: m.text_stats_streak_exact_year(),
    },
    {
      threshold: 180,
      message: m.text_stats_streak_every_single_day(),
      exactMessage: m.text_stats_streak_exact_half_year(),
    },
    {
      threshold: 90,
      message: m.text_stats_streak_others_dream(),
      exactMessage: m.text_stats_streak_exact_90(),
    },
    {
      threshold: 60,
      message: m.text_stats_streak_lifestyle(),
      exactMessage: m.text_stats_streak_exact_60(),
    },
    {
      threshold: 30,
      message: m.text_stats_streak_no_days_off(),
      exactMessage: m.text_stats_streak_exact_month(),
    },
    {
      threshold: 14,
      message: m.text_stats_streak_locked_in(),
      exactMessage: m.text_stats_streak_exact_two_weeks(),
    },
    {
      threshold: 7,
      message: m.text_stats_streak_keep_fire(),
      exactMessage: m.text_stats_streak_exact_week(),
    },
    {
      threshold: 3,
      message: m.text_stats_streak_habit_forming(),
      exactMessage: m.text_stats_streak_exact_three_days(),
    },
    {
      threshold: 1,
      message: m.text_stats_streak_keep_going(),
      exactMessage: m.text_stats_streak_exact_it_begins(),
    },
  ];

  const tierMessage = $derived.by(() => {
    const count = $streakCount;
    const tier = tiers.find(({ threshold }) => count >= threshold);

    if (!tier) return m.text_stats_streak_keep_going();

    const { threshold, message, exactMessage } = tier;
    return count === threshold && exactMessage ? exactMessage : message;
  });

  const streakLabel = $derived(
    $streakCount === 1
      ? m.text_stats_day_count({ count: String($streakCount) })
      : m.text_stats_days_count({ count: String($streakCount) }),
  );

  const isAtRisk = $derived($streakState === "at_risk");
</script>

{#if $isLoading}
  <BannerContainer variant="fluid">
    <div class="trakt-streak-skeleton"></div>
  </BannerContainer>
{:else}
  <BannerContainer variant="fluid">
    <trakt-streak-callout>
      <Link href={drilldownLink} noscroll>
        <div class="trakt-streak-callout">
          <div class="trakt-streak-left">
            <div class="trakt-streak-flame">
              <StreakIcon count={$streakCount} />
            </div>

            <div class="trakt-streak-info">
              <p class="trakt-streak-title bold">
                <span class="trakt-streak-count bold">{streakLabel}</span>
                {m.text_stats_watching_streak()}
              </p>
              <p class="secondary">
                {#if isAtRisk || $streakCount === 0}
                  <span class="secondary bold">
                    {m.text_stats_watch_today()}
                  </span>
                  {#if $streakCount > 0}
                    {m.text_stats_keep_streak_alive()}
                  {:else}
                    {m.text_stats_start_streak()}
                  {/if}
                {:else}
                  {tierMessage}
                {/if}
              </p>
            </div>
          </div>

          <div class="trakt-streak-right">
            <div class="trakt-streak-accumulator">
              <StreakAccumulator cells={$heatmap?.cells ?? []} />
            </div>
            <div class="trakt-streak-footer">
              <ArrowRightIcon />
            </div>
          </div>
        </div>
      </Link>
    </trakt-streak-callout>
  </BannerContainer>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-streak-callout,
  .trakt-streak-skeleton {
    height: var(--ni-80);
  }

  trakt-streak-callout {
    display: contents;

    :global(.trakt-link) {
      text-decoration: none;

      :global(.secondary) {
        color: var(--color-text-secondary);
      }
    }
  }

  // TODO: extract shared skeleton shimmer mixin (see also SkeletonCard.svelte)
  .trakt-streak-skeleton {
    border-radius: var(--border-radius-l);
    background: var(--color-streak-surface);
    position: relative;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      width: 300%;
      height: 100%;
      transform: translateX(100%);
      animation: slide calc(20 * var(--transition-increment)) infinite;
      background: linear-gradient(
        110deg,
        var(--color-streak-surface) 0%,
        var(--color-streak-surface) 30%,
        color-mix(in srgb, var(--color-foreground) 50%, transparent) 50%,
        var(--color-streak-surface) 70%,
        var(--color-streak-surface) 100%
      );
      opacity: 0.2;
    }
  }

  .trakt-streak-callout {
    background: var(--color-streak-surface);

    padding: var(--ni-18);

    display: flex;
    align-items: center;
    gap: var(--gap-l);

    border: var(--ni-1) solid var(--color-streak-border);
    border-radius: var(--border-radius-l);

    @include for-tablet-sm-and-below {
      gap: var(--gap-m);
      padding: var(--ni-12);
      padding-right: var(--ni-18);
    }
  }

  .trakt-streak-left {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    min-width: 0;
    flex: 1;
  }

  .trakt-streak-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-l);
    flex: 1;

    @include for-tablet-sm-and-below {
      flex-direction: column;
      flex: none;
      align-items: flex-end;
      align-self: stretch;
      gap: 0;
    }
  }

  .trakt-streak-flame {
    width: var(--ni-48);
    height: var(--ni-48);

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .trakt-streak-info {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    min-width: 0;
  }

  .trakt-streak-title,
  .trakt-streak-count {
    font-size: var(--ni-18);
  }

  .trakt-streak-accumulator {
    display: flex;
    flex: 1;

    @include for-tablet-sm-and-below {
      align-items: center;
    }
  }

  .trakt-streak-footer {
    display: flex;
    flex-shrink: 0;
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
