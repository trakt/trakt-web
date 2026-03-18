<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DAY_COUNT, useGenreBreakdown } from "./_internal/useGenreBreakdown";

  const GENRE_MID_INDEX = Math.floor(DAY_COUNT / 2);

  const { user } = useUser();
  const { data, isLoading } = $derived(useGenreBreakdown({ slug: $user.slug }));

  const dateRange = $derived.by(() => {
    const now = new Date();
    const rangeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (DAY_COUNT - 1));
    return `${rangeStart.toLocaleString(languageTag(), { month: "short", day: "numeric" })} – ${now.toLocaleString(languageTag(), { month: "short", day: "numeric" })}`;
  });

  const shouldShow = $derived(!$isLoading && $data && $data.days.some(d => d.total > 0));

  const midDate = $derived.by(() => {
    if (!$data) return "";
    const mid = $data.days[GENRE_MID_INDEX];
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
        {m.header_stats_genre_breakdown()}
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
          <span class="trakt-genre-date-label">{m.text_stats_today()}</span>
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
    padding: var(--ni-24) var(--ni-28);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.04) 0%,
      rgba(255, 255, 255, 0.01) 100%
    );
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .trakt-genre-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: var(--ni-20);
  }

  .trakt-genre-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(255, 255, 255, 0.5);
    font-size: var(--ni-13);
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .trakt-genre-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--green-500);
    box-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
    flex-shrink: 0;
  }

  .trakt-genre-range {
    color: rgba(255, 255, 255, 0.25);
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
    gap: 6px;
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
    border-radius: 6px 6px 0 0;
    overflow: hidden;
    gap: 2px;
    min-height: 0;
  }

  .trakt-genre-segment {
    min-height: var(--ni-2);
    border-radius: 1px;
    opacity: 0.85;
  }

  .trakt-genre-date-labels {
    display: flex;
    justify-content: space-between;
    margin-top: var(--ni-8);
  }

  .trakt-genre-date-label {
    color: rgba(255, 255, 255, 0.2);
    font-size: var(--ni-11);
  }

  .trakt-genre-legend {
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    flex-shrink: 0;
    min-width: 130px;
  }

  .trakt-genre-legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .trakt-genre-legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 4px;
    opacity: 0.85;
    flex-shrink: 0;
  }

  .trakt-genre-legend-label {
    color: rgba(255, 255, 255, 0.45);
    font-size: var(--ni-12);
    flex: 1;
  }

  .trakt-genre-legend-pct {
    color: rgba(255, 255, 255, 0.7);
    font-size: var(--ni-12);
    font-weight: 600;
  }
</style>
