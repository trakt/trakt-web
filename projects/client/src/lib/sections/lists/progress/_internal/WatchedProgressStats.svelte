<script lang="ts">
  import type { WatchedProgressEntry } from "$lib/requests/models/WatchedProgressEntry.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";

  const {
    entries,
    totalShows,
  }: {
    entries: WatchedProgressEntry[];
    totalShows?: number;
  } = $props();

  const aggregateStats = $derived(() => {
    const totalAired = entries.reduce((sum, e) => sum + e.aired, 0);
    const totalCompleted = entries.reduce((sum, e) => sum + e.completed, 0);
    const percentage =
      totalAired > 0 ? Math.round((totalCompleted / totalAired) * 100) : 0;

    return {
      totalAired,
      totalCompleted,
      remaining: totalAired - totalCompleted,
      percentage,
    };
  });

  const circumference = 2 * Math.PI * 22;
  const strokeOffset = $derived(
    circumference - (aggregateStats().percentage / 100) * circumference,
  );
</script>

<div class="watched-progress-stats">
  <div class="stats-donut-area">
    <svg class="stats-donut" viewBox="0 0 52 52">
      <circle
        class="stats-donut-track"
        cx="26"
        cy="26"
        r="22"
        fill="none"
        stroke-width="5"
      />
      <circle
        class="stats-donut-fill"
        cx="26"
        cy="26"
        r="22"
        fill="none"
        stroke-width="5"
        stroke-dasharray={circumference}
        stroke-dashoffset={strokeOffset}
        transform="rotate(-90 26 26)"
      />
    </svg>
    <span class="stats-donut-label bold">{aggregateStats().percentage}%</span>
  </div>

  <div class="stats-text-area">
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value bold"
          >{aggregateStats().totalCompleted.toLocaleString()}</span
        >
        <span class="stat-label">episodes watched</span>
      </div>

      <span class="stat-divider">/</span>

      <div class="stat-item">
        <span class="stat-value bold"
          >{aggregateStats().totalAired.toLocaleString()}</span
        >
        <span class="stat-label">total</span>
      </div>

      <span class="stat-divider">&mdash;</span>

      <div class="stat-item">
        <span class="stat-value bold"
          >{aggregateStats().remaining.toLocaleString()}</span
        >
        <span class="stat-label">remaining</span>
      </div>

      {#if totalShows}
        <span class="stat-divider">&mdash;</span>
        <div class="stat-item">
          <span class="stat-value bold">{totalShows.toLocaleString()}</span>
          <span class="stat-label">shows</span>
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .watched-progress-stats {
    display: flex;
    align-items: center;
    gap: var(--gap-l);
    padding: var(--ni-20) var(--ni-16);
    margin-bottom: var(--ni-8);
    border-bottom: 1px solid
      color-mix(in srgb, var(--shade-700) 40%, transparent);
  }

  .stats-donut-area {
    position: relative;
    width: 52px;
    height: 52px;
    flex-shrink: 0;
  }

  .stats-donut {
    width: 100%;
    height: 100%;
  }

  .stats-donut-track {
    stroke: var(--shade-800);
  }

  .stats-donut-fill {
    stroke: var(--purple-500);
    stroke-linecap: round;
    transition: stroke-dashoffset 0.4s ease-out;
  }

  .stats-donut-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: var(--ni-12);
    color: var(--color-text-primary);
    font-variant-numeric: tabular-nums;
  }

  .stats-text-area {
    flex: 1;
    min-width: 0;
  }

  .stats-row {
    display: flex;
    align-items: baseline;
    gap: var(--gap-xs);
    flex-wrap: wrap;
  }

  .stat-item {
    display: flex;
    align-items: baseline;
    gap: var(--ni-4);
  }

  .stat-value {
    font-size: var(--ni-18);
    color: var(--color-text-primary);
    font-variant-numeric: tabular-nums;

    @include for-mobile {
      font-size: var(--ni-16);
    }
  }

  .stat-label {
    font-size: var(--ni-12);
    color: var(--color-text-secondary);
  }

  .stat-divider {
    font-size: var(--ni-14);
    color: var(--shade-600);
  }
</style>
