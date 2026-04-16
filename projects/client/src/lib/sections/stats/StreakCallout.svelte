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
  import StreakAccumulator from "./_internal/StreakAccumulator.svelte";
  import { useActivityHeatmap } from "./_internal/useActivityHeatmap.ts";
  import { useStreak } from "./_internal/useStreak";

  const { streakCount, streakState, isLoading } = $derived(useStreak());
  const { mode } = useDiscover();
  const { heatmap } = $derived(useActivityHeatmap({ mode: $mode }));
  const { buildDrawerLink } = dashboardDrawerNavigation();
  const drilldownLink = $derived(buildDrawerLink(DashboardDrawers.Streak));

  type Tier = {
    emoji: string;
    message: string;
  };

  type TierDef = {
    threshold: number;
    tier: Tier;
    exactMessage?: string;
  };

  const tiers: ReadonlyArray<TierDef> = [
    {
      threshold: 365,
      tier: { emoji: "👑", message: m.text_stats_streak_every_single_day() },
      exactMessage: m.text_stats_streak_exact_year(),
    },
    {
      threshold: 180,
      tier: { emoji: "🌟", message: m.text_stats_streak_every_single_day() },
      exactMessage: m.text_stats_streak_exact_half_year(),
    },
    {
      threshold: 90,
      tier: { emoji: "⚡", message: m.text_stats_streak_others_dream() },
      exactMessage: m.text_stats_streak_exact_90(),
    },
    {
      threshold: 60,
      tier: { emoji: "💥", message: m.text_stats_streak_lifestyle() },
      exactMessage: m.text_stats_streak_exact_60(),
    },
    {
      threshold: 30,
      tier: { emoji: "💥", message: m.text_stats_streak_no_days_off() },
      exactMessage: m.text_stats_streak_exact_month(),
    },
    {
      threshold: 14,
      tier: { emoji: "🔥", message: m.text_stats_streak_locked_in() },
      exactMessage: m.text_stats_streak_exact_two_weeks(),
    },
    {
      threshold: 7,
      tier: { emoji: "🔥", message: m.text_stats_streak_keep_fire() },
      exactMessage: m.text_stats_streak_exact_week(),
    },
    {
      threshold: 3,
      tier: { emoji: "🔥", message: m.text_stats_streak_habit_forming() },
      exactMessage: m.text_stats_streak_exact_three_days(),
    },
    {
      threshold: 1,
      tier: { emoji: "🕯️", message: m.text_stats_streak_keep_going() },
      exactMessage: m.text_stats_streak_exact_it_begins(),
    },
  ];

  const currentTier = $derived.by(() => {
    const count = $streakCount;
    const tierDef = tiers.find(({ threshold }) => count >= threshold);

    if (!tierDef) return tiers[tiers.length - 1]!.tier;

    const { threshold, tier, exactMessage } = tierDef;
    return {
      ...tier,
      message:
        count === threshold && exactMessage ? exactMessage : tier.message,
    };
  });

  const streakLabel = $derived(
    $streakCount === 1
      ? m.text_stats_day_count({ count: String($streakCount) })
      : m.text_stats_days_count({ count: String($streakCount) }),
  );

  const hasStreak = $derived(!$isLoading && $streakState !== "none");
  const isAtRisk = $derived($streakState === "at_risk");
</script>

{#if $isLoading}
  <BannerContainer variant="fluid">
    <div class="trakt-streak-skeleton"></div>
  </BannerContainer>
{:else if hasStreak}
  <BannerContainer variant="fluid">
    <trakt-streak-callout>
      <Link href={drilldownLink} noscroll>
        <div class="trakt-streak-callout" data-at-risk={isAtRisk || undefined}>
          <div class="trakt-streak-left">
            <div class="trakt-streak-flame">
              {currentTier.emoji}
            </div>

            <div class="trakt-streak-info">
              <p class="trakt-streak-title">
                <span class="trakt-streak-count">{streakLabel}</span>
                {m.text_stats_watching_streak()}
              </p>
              <p class="trakt-streak-subtitle secondary">
                {#if isAtRisk}
                  <span class="trakt-streak-warning"
                    >{m.text_stats_watch_today()}</span
                  >
                  {m.text_stats_keep_streak_alive()}
                {:else}
                  {currentTier.message}
                {/if}
              </p>
            </div>
          </div>

          <StreakAccumulator cells={$heatmap?.cells ?? []} />

          <div class="trakt-streak-footer">
            <ArrowRightIcon />
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

    @include for-tablet-sm-and-below {
      height: var(--ni-128);
    }
  }

  trakt-streak-callout {
    display: contents;

    :global(.trakt-link) {
      text-decoration: none;
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
    padding: var(--ni-16) var(--ni-24);

    display: flex;
    align-items: center;
    gap: var(--gap-l);

    background: linear-gradient(
      135deg,
      var(--color-streak-surface-accent) 0%,
      var(--color-streak-surface) 100%
    );
    border: 1px solid var(--color-streak-border);
    border-radius: var(--border-radius-l);
    box-shadow: var(--shadow-streak);

    @include for-tablet-sm-and-below {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: var(--gap-m);
      align-items: center;

      padding: var(--ni-12);
    }

    &[data-at-risk] {
      opacity: 0.8;
    }
  }

  .trakt-streak-left {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    min-width: 0;
    flex-shrink: 0;

    @include for-tablet-sm-and-below {
      grid-column: 1;
      grid-row: 1;
      flex-shrink: 1;
    }
  }

  :global(.trakt-streak-accumulator) {
    @include for-tablet-sm-and-below {
      grid-column: 1 / -1;
      grid-row: 2;
      overflow: hidden;
    }
  }

  .trakt-streak-flame {
    width: var(--ni-48);
    height: var(--ni-48);
    border-radius: var(--border-radius-m);
    background: var(--color-streak-flame-background);

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--ni-28);
    flex-shrink: 0;
  }

  .trakt-streak-info {
    min-width: 0;
  }

  .trakt-streak-title {
    font-size: var(--ni-18);
    font-weight: 600;
  }

  .trakt-streak-count {
    font-size: var(--ni-22);
    color: var(--color-streak-accent);

    @include for-mobile {
      display: block;
    }
  }

  .trakt-streak-subtitle {
    font-size: var(--font-size-text);
    margin-top: var(--ni-4);
    color: var(--color-streak-subtitle);
  }

  .trakt-streak-warning {
    color: var(--color-streak-warning);
    background: var(--color-streak-warning-background);
    padding: var(--ni-1) var(--ni-6);
    border-radius: var(--ni-4);
    font-weight: 600;
  }

  .trakt-streak-footer {
    display: flex;
    flex-shrink: 0;
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }

    @include for-tablet-sm-and-below {
      grid-column: 2;
      grid-row: 1;
    }
  }
</style>
