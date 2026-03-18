<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { languageTag } from "$lib/features/i18n";
  import { useGenreBreakdown } from "./_internal/useGenreBreakdown";

  const { user } = useUser();
  const { data, isLoading } = $derived(useGenreBreakdown({ slug: $user.slug }));

  const dateRange = $derived.by(() => {
    const now = new Date();
    const rangeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13);
    return `${rangeStart.toLocaleString(languageTag(), { month: "short", day: "numeric" })} – ${now.toLocaleString(languageTag(), { month: "short", day: "numeric" })}`;
  });

  const shouldShow = $derived(!$isLoading && $data && $data.days.some(d => d.total > 0));

  const midDate = $derived.by(() => {
    if (!$data) return "";
    const mid = $data.days[7];
    if (!mid) return "";
    return mid.date.toLocaleString(languageTag(), { month: "short", day: "numeric" });
  });

  const startLabel = $derived.by(() => {
    if (!$data) return "";
    const first = $data.days[0];
    if (!first) return "";
    return first.date.toLocaleString(languageTag(), { month: "short", day: "numeric" });
  });
</script>

{#if shouldShow}
  <div class="trakt-genre-breakdown">
    <div class="trakt-genre-header">
      <p class="trakt-genre-title">
        <span class="trakt-genre-dot"></span>
        LAST 14 DAYS — GENRE BREAKDOWN
      </p>
      <p class="trakt-genre-range">{dateRange}</p>
    </div>

    <div class="trakt-genre-body">
      <div class="trakt-genre-chart-area">
        <div class="trakt-genre-bars">
          {#each $data!.days as day, di (di)}
            <div class="trakt-genre-bar-col">
              <div class="trakt-genre-bar" style:height="{$data!.maxDayTotal > 0 ? (day.total / $data!.maxDayTotal) * 100 : 0}%">
                {#each [...day.segments].reverse() as segment, ri (ri)}
                  {#if segment.count > 0}
                    {@const segIndex = day.segments.length - 1 - ri}
                    {@const legendEntry = $data!.legend[segIndex]}
                    <div
                      class="trakt-genre-segment"
                      style:background-color={legendEntry?.color ?? '#555555'}
                      style:flex-grow={segment.count}
                    ></div>
                  {/if}
                {/each}
              </div>
            </div>
          {/each}
        </div>

        <div class="trakt-genre-date-labels">
          <span class="trakt-genre-date-label">{startLabel}</span>
          <span class="trakt-genre-date-label">{midDate}</span>
          <span class="trakt-genre-date-label">Today</span>
        </div>
      </div>

      <div class="trakt-genre-legend">
        {#each $data!.legend as entry (entry.genre)}
          <div class="trakt-genre-legend-item">
            <span class="trakt-genre-legend-dot" style:background-color={entry.color}></span>
            <span class="trakt-genre-legend-label">{entry.label}</span>
            <span class="trakt-genre-legend-pct">{entry.percentage}%</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .trakt-genre-breakdown {
    margin: 0 var(--layout-distance-side);
    padding: var(--ni-16) var(--ni-24);
    background: var(--shade-930);
    border: 1px solid var(--shade-910);
    border-radius: var(--border-radius-l);
  }

  .trakt-genre-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: var(--ni-16);
  }

  .trakt-genre-title {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
    color: var(--shade-400);
    font-size: var(--ni-12);
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .trakt-genre-dot {
    width: var(--ni-8);
    height: var(--ni-8);
    border-radius: 50%;
    background: var(--green-500);
    flex-shrink: 0;
  }

  .trakt-genre-range {
    color: var(--shade-500);
    font-size: var(--ni-12);
  }

  .trakt-genre-body {
    display: flex;
    gap: var(--ni-24);
  }

  .trakt-genre-chart-area {
    flex: 1;
    min-width: 0;
  }

  .trakt-genre-bars {
    display: flex;
    align-items: flex-end;
    gap: var(--ni-4);
    height: var(--ni-120);
  }

  .trakt-genre-bar-col {
    flex: 1;
    display: flex;
    align-items: flex-end;
    height: 100%;
  }

  .trakt-genre-bar {
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: var(--ni-2) var(--ni-2) 0 0;
    overflow: hidden;
    gap: 1px;
    min-height: 0;
  }

  .trakt-genre-segment {
    min-height: var(--ni-2);
  }

  .trakt-genre-date-labels {
    display: flex;
    justify-content: space-between;
    margin-top: var(--ni-8);
  }

  .trakt-genre-date-label {
    color: var(--shade-500);
    font-size: var(--ni-12);
  }

  .trakt-genre-legend {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    justify-content: center;
    flex-shrink: 0;
    min-width: var(--ni-120);
  }

  .trakt-genre-legend-item {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }

  .trakt-genre-legend-dot {
    width: var(--ni-8);
    height: var(--ni-8);
    border-radius: 50%;
    flex-shrink: 0;
  }

  .trakt-genre-legend-label {
    color: var(--shade-400);
    font-size: var(--ni-12);
    flex: 1;
  }

  .trakt-genre-legend-pct {
    color: var(--shade-300);
    font-size: var(--ni-12);
    font-weight: 600;
  }
</style>
