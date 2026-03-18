<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
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
    { threshold: 365, tier: { name: "Eternal", emoji: "👑", message: "Every. Single. Day." }, exactMessage: "A full year. Not a single day missed." },
    { threshold: 180, tier: { name: "Mythical", emoji: "🌟", message: "Every. Single. Day." }, exactMessage: "Half a year without missing a day." },
    { threshold: 90, tier: { name: "Legendary", emoji: "⚡", message: "Others only dream of this." }, exactMessage: "90 days. A true legend." },
    { threshold: 60, tier: { name: "Obsessed", emoji: "💥", message: "At this point it's a lifestyle." }, exactMessage: "60 days. Officially obsessed." },
    { threshold: 30, tier: { name: "Inferno", emoji: "💥", message: "No days off." }, exactMessage: "A full month. Not a single day missed." },
    { threshold: 14, tier: { name: "Blazing", emoji: "🔥", message: "You're locked in." }, exactMessage: "Two full weeks. You're locked in." },
    { threshold: 7, tier: { name: "On Fire", emoji: "🔥", message: "Keep the fire going!" }, exactMessage: "A full week of watching." },
    { threshold: 3, tier: { name: "Warm Up", emoji: "🔥", message: "A habit is forming." }, exactMessage: "Three days running." },
    { threshold: 1, tier: { name: "Spark", emoji: "🕯️", message: "Keep it going tomorrow!" }, exactMessage: "It begins." },
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

  const shouldShow = $derived(!$isLoading && $streakState !== 'none');
  const isBroken = $derived($streakState === 'broken');
</script>

{#if shouldShow}
  <div class="trakt-streak-callout" data-broken={isBroken || undefined}>
    <div class="trakt-streak-left">
      <div class="trakt-streak-flame">
        {currentTier.emoji}
      </div>

      <div class="trakt-streak-info">
        <p class="trakt-streak-title">
          <span class="trakt-streak-count">{$streakCount} day</span> {isBroken ? "streak ended" : "watching streak"}
        </p>
        <p class="trakt-streak-subtitle secondary">
          {#if isBroken}
            Your {$streakCount} day streak ended yesterday. Start a new one!
          {:else}
            {currentTier.message}
          {/if}
        </p>
      </div>
    </div>

    {#if !isBroken}
      <StreakAccumulator days={$streakCount} />
    {/if}
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

    &[data-broken] {
      opacity: 0.6;
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
</style>
