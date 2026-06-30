<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { YirStreamingService } from "$lib/requests/models/YirDetail.ts";
  import { formatNumber } from "$lib/utils/format/formatNumber.ts";
  import YirStreamingBubbleChart from "../../_internal/YirStreamingBubbleChart.svelte";
  import YirTooltip from "../../_internal/YirTooltip.svelte";
  import { yirMediaUnit } from "../../_internal/yirMediaUnit.ts";

  type Yir2024StreamingSectionProps = {
    services: YirStreamingService[];
    country: string;
  };

  const { services, country }: Yir2024StreamingSectionProps = $props();

  // Highest-coverage services lead the stat list (the bubble chart shows the
  // full set); mirrors v2's top-3 service summary.
  const topServices = $derived(
    [...services].sort((a, b) => b.all - a.all).slice(0, 3),
  );

  function showsUnit(count: number): string {
    return yirMediaUnit("shows", count);
  }
  function moviesUnit(count: number): string {
    return yirMediaUnit("movies", count);
  }

  // Per-service count lines, each on its own row in the tooltip. Zero counts
  // are omitted so a movies-only (or shows-only) service shows a single line.
  function countLines(service: YirStreamingService): string[] {
    return [
      service.shows > 0
        ? `${formatNumber(service.shows)} ${showsUnit(service.shows)}`
        : null,
      service.movies > 0
        ? `${formatNumber(service.movies)} ${moviesUnit(service.movies)}`
        : null,
    ].filter((line): line is string => line !== null);
  }
</script>

<section
  class="trakt-yir-2024-streaming-section"
  id="section-streaming-services"
>
  <div class="yir-2024-streaming-panel">
    <div class="yir-2024-streaming-text">
      <header class="yir-2024-streaming-heading-group">
        <p class="bold yir-2024-streaming-intro">
          {m.yir_2024_streaming_intro()}
        </p>
        <h2 class="bold yir-2024-streaming-heading">
          {m.yir_2024_streaming_title()}
        </h2>
      </header>

      <dl class="yir-2024-streaming-list">
        {#each topServices as service (service.source)}
          <div class="yir-2024-streaming-row">
            <dt class="ellipsis yir-2024-streaming-name">{service.name}</dt>
            <dd class="yir-2024-streaming-counts">
              {#if service.shows > 0}
                <span class="bold uppercase tag yir-2024-streaming-count-pill">
                  {formatNumber(service.shows)} {showsUnit(service.shows)}
                </span>
              {/if}
              {#if service.movies > 0}
                <span class="bold uppercase tag yir-2024-streaming-count-pill">
                  {formatNumber(service.movies)} {moviesUnit(service.movies)}
                </span>
              {/if}
            </dd>
          </div>
        {/each}

        <div class="yir-2024-streaming-row">
          <dt>{m.yir_2024_streaming_service_count()}</dt>
          <dd class="yir-2024-streaming-total">{formatNumber(services.length)}</dd>
        </div>
      </dl>
    </div>

    <div class="yir-2024-streaming-chart">
      <YirStreamingBubbleChart {services} {country}>
        {#snippet tooltip({ service })}
          {@const lines = countLines(service)}
          <YirTooltip main={service.name} sub={lines.at(0)} extra={lines.at(1)} />
        {/snippet}
      </YirStreamingBubbleChart>
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-2024-streaming-section {
    width: 100%;
  }

  // Two-column layout: text + stat list on the left, bubble chart on the
  // right. Collapses to a single column on smaller viewports. Mirrors
  // Yir2024CompaniesSection so streaming reads as a sibling section.
  .yir-2024-streaming-panel {
    --panel-padding-x: var(--ni-44);
    --panel-padding-y: var(--ni-44);

    padding: var(--panel-padding-y) var(--panel-padding-x);
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    gap: var(--ni-32);
    align-items: center;

    @include for-tablet-lg-and-below {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-24);
    }

    @include for-mobile {
      --panel-padding-x: var(--ni-20);
      --panel-padding-y: var(--ni-20);
    }
  }

  .yir-2024-streaming-text {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);
  }

  .yir-2024-streaming-heading-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .yir-2024-streaming-intro {
    margin: 0;
    font-size: var(--ni-24);
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color-yir-text-primary);

    @include for-mobile {
      font-size: var(--ni-12);
    }
  }

  .yir-2024-streaming-heading {
    margin: 0;
    font-size: clamp(var(--ni-32), 5vw, var(--ni-56));
    line-height: 1.05;
    color: var(--color-yir-text-primary);

    @include for-mobile {
      font-size: var(--ni-28);
    }
  }

  .yir-2024-streaming-list {
    display: flex;
    flex-direction: column;
    margin: 0;
  }

  // Divider under each row (matching the stat-summary list) so the rows read
  // as a list; last row drops the divider.
  .yir-2024-streaming-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--ni-32);
    padding: var(--ni-16) 0;
    border-bottom: var(--border-thickness-xxs) solid var(--color-yir-separator);

    &:last-child {
      border-bottom: none;
    }

    @include for-tablet-sm-and-below {
      gap: var(--ni-16);
    }

    dt {
      font-size: var(--font-size-title);
      color: var(--color-yir-text-primary);
      min-width: 0;
    }

    dd {
      display: flex;
      align-items: center;
      font-size: var(--font-size-title);
      color: var(--color-yir-text-primary);
      white-space: nowrap;
    }
  }

  .yir-2024-streaming-name {
    color: var(--color-yir-text-accent);
  }

  // Shows and movies each get their own pill, laid out side by side.
  .yir-2024-streaming-counts {
    gap: var(--gap-xs);
  }

  // Pill-shaped count badge matching Yir2024StatSummary's stat-count pill so
  // the streaming rows read like the genres / networks stat lists.
  .yir-2024-streaming-count-pill {
    background: var(--color-yir-badge-background);
    color: var(--color-yir-badge-foreground);
    border-radius: var(--border-radius-xxl);
    padding: var(--ni-4) var(--ni-10);
    white-space: nowrap;
  }

  .yir-2024-streaming-chart {
    width: 100%;
    min-width: 0;
    height: var(--ni-480);

    @include for-mobile {
      height: var(--ni-380);
    }
  }
</style>
