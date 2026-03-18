<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import StreakAccumulator from "./_internal/StreakAccumulator.svelte";
  import { useStreak } from "./_internal/useStreak";

  const { user } = useUser();

  const { streakCount, streakState, isLoading } = $derived(
    useStreak({ slug: $user.slug }),
  );

  type Tier = {
    name: string;
    emoji: string;
    message: string;
  };

  type TierDef = {
    threshold: number;
    tier: Tier;
    exactMessage?: string;
  };

  const TIERS: TierDef[] = [
    { threshold: 365, tier: { name: m.text_stats_streak_tier_eternal(), emoji: "👑", message: m.text_stats_streak_every_single_day() }, exactMessage: m.text_stats_streak_exact_year() },
    { threshold: 180, tier: { name: m.text_stats_streak_tier_mythical(), emoji: "🌟", message: m.text_stats_streak_every_single_day() }, exactMessage: m.text_stats_streak_exact_half_year() },
    { threshold: 90, tier: { name: m.text_stats_streak_tier_legendary(), emoji: "⚡", message: m.text_stats_streak_others_dream() }, exactMessage: m.text_stats_streak_exact_90() },
    { threshold: 60, tier: { name: m.text_stats_streak_tier_obsessed(), emoji: "💥", message: m.text_stats_streak_lifestyle() }, exactMessage: m.text_stats_streak_exact_60() },
    { threshold: 30, tier: { name: m.text_stats_streak_tier_inferno(), emoji: "💥", message: m.text_stats_streak_no_days_off() }, exactMessage: m.text_stats_streak_exact_month() },
    { threshold: 14, tier: { name: m.text_stats_streak_tier_blazing(), emoji: "🔥", message: m.text_stats_streak_locked_in() }, exactMessage: m.text_stats_streak_exact_two_weeks() },
    { threshold: 7, tier: { name: m.text_stats_streak_tier_on_fire(), emoji: "🔥", message: m.text_stats_streak_keep_fire() }, exactMessage: m.text_stats_streak_exact_week() },
    { threshold: 3, tier: { name: m.text_stats_streak_tier_warm_up(), emoji: "🔥", message: m.text_stats_streak_habit_forming() }, exactMessage: m.text_stats_streak_exact_three_days() },
    { threshold: 1, tier: { name: m.text_stats_streak_tier_spark(), emoji: "🕯️", message: m.text_stats_streak_keep_going() }, exactMessage: m.text_stats_streak_exact_it_begins() },
  ];

  const currentTier = $derived.by(() => {
    const count = $streakCount;
    for (const { threshold, tier, exactMessage } of TIERS) {
      if (count >= threshold) {
        return {
          ...tier,
          message: count === threshold && exactMessage ? exactMessage : tier.message,
        };
      }
    }
    return TIERS[TIERS.length - 1]!.tier;
  });

  const streakLabel = $derived(
    $streakCount === 1
      ? m.text_stats_day_count({ count: String($streakCount) })
      : m.text_stats_days_count({ count: String($streakCount) }),
  );

  const shouldShow = $derived(!$isLoading && $streakState !== 'none');
  const isAtRisk = $derived($streakState === 'at_risk');
</script>

{#if shouldShow}
  <div class="trakt-streak-callout" data-at-risk={isAtRisk || undefined}>
    <div class="trakt-streak-left">
      <div class="trakt-streak-flame">
        {currentTier.emoji}
      </div>

      <div class="trakt-streak-info">
        <p class="trakt-streak-title">
          <span class="trakt-streak-count">{streakLabel}</span> {m.text_stats_watching_streak()}
        </p>
        <p class="trakt-streak-subtitle secondary">
          {#if isAtRisk}
            <span class="trakt-streak-warning">{m.text_stats_watch_today()}</span> {m.text_stats_keep_streak_alive()}
          {:else}
            {currentTier.message}
          {/if}
        </p>
      </div>
    </div>

    <StreakAccumulator days={$streakCount} />
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-streak-callout {
    margin: 0 var(--layout-distance-side);
    padding: var(--ni-16) var(--ni-24);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-l);

    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--purple-900) 30%, var(--shade-930)) 0%,
      var(--shade-930) 100%
    );
    border: 1px solid color-mix(in srgb, var(--purple-800) 25%, var(--shade-910));
    border-radius: var(--border-radius-l);

    &[data-at-risk] {
      opacity: 0.8;
    }
  }

  .trakt-streak-left {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    min-width: 0;
  }

  .trakt-streak-flame {
    width: var(--ni-48);
    height: var(--ni-48);
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--purple-900) 50%, transparent);

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
    color: var(--purple-400);
  }

  .trakt-streak-subtitle {
    font-size: var(--font-size-text);
    margin-top: var(--ni-4);
  }

  .trakt-streak-warning {
    color: var(--orange-400);
    background: color-mix(in srgb, var(--orange-900) 35%, transparent);
    padding: var(--ni-1) var(--ni-6);
    border-radius: var(--ni-4);
    font-weight: 600;
  }
</style>
