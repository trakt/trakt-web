<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toGroupedNumber } from "$lib/utils/formatting/number/toGroupedNumber.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
  import ActivityHeatmap from "./ActivityHeatmap.svelte";
  import { useMonthlyStats } from "./_internal/useMonthlyStats.ts";

  const { onClose }: { onClose: () => void } = $props();

  const { mode, current } = useDiscover();
  const { stats, isLoading } = $derived(useMonthlyStats({ mode: $mode }));

  const daysInMonth = $derived.by(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  });
</script>

<!-- FIXME: fix animations; no content move, animate appearance -->
<Drawer
  {onClose}
  title={m.drawer_title_streak_activity()}
  size="auto"
  metaInfo={$current.text()}
>
  <div class="trakt-streak-drawer-content">
    <ActivityHeatmap mode={$mode} />

    {#if $stats}
      <section class="trakt-monthly-stats">
        <span class="bold">{m.header_stats_monthly()}</span>
        {#snippet statCard(
          value: number,
          label: string,
          sub: string,
          format: (value: number, locale: string) => string = toHumanNumber,
        )}
          <div class="trakt-monthly-stat-card">
            {#if $isLoading}
              <LoadingIndicator />
            {:else}
              <p class="trakt-monthly-stat-value bold">
                {format(value, languageTag())}
              </p>
            {/if}
            <p class="bold">{label}</p>
            <p class="secondary">{sub}</p>
          </div>
        {/snippet}

        <div class="trakt-monthly-stats-grid">
          {@render statCard(
            $stats.currentStreak,
            m.label_stats_current_streak(),
            m.text_this_month(),
            toGroupedNumber,
          )}
          {@render statCard(
            $stats.previousStreak,
            m.label_stats_previous_streak(),
            m.text_stats_keep_it_going(),
            toGroupedNumber,
          )}
          {@render statCard(
            $stats.droppedStreaksThisMonth,
            m.label_stats_dropped_streaks(),
            m.text_this_month(),
          )}
          {@render statCard(
            $stats.activeDaysThisMonth,
            m.label_stats_active_days(),
            m.text_stats_out_of({ count: String(daysInMonth) }),
          )}
          {@render statCard(
            $stats.activeDaysThisYear,
            m.label_stats_active_days(),
            m.text_this_year(),
          )}
          {@render statCard(
            $stats.totalElapsedDaysThisMonth > 0
              ? $stats.activeDaysThisMonth / $stats.totalElapsedDaysThisMonth
              : 0,
            m.label_stats_days_active(),
            m.text_this_month(),
            toPercentage,
          )}
        </div>
      </section>
    {/if}
  </div>
</Drawer>

<style lang="scss">
  .trakt-streak-drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .trakt-monthly-stats {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .trakt-monthly-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-s);
  }

  .trakt-monthly-stat-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-micro);

    padding: var(--ni-12);

    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);

    :global(.loading-indicator svg) {
      width: var(--ni-32);
      height: var(--ni-32);
    }
  }

  .trakt-monthly-stat-value {
    font-size: var(--ni-22);
    color: var(--color-text-emphasis);
  }
</style>
