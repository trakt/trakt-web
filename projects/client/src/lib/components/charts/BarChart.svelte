<script lang="ts">
  import { BarChartSimple } from "@carbon/charts-svelte";
  import "@carbon/charts-svelte/styles.css";
  import { findMaxIndex } from "$lib/utils/array/findMaxIndex";

  const barColorNormal = "#9ea6ac";
  const barColorMax = "#fefefe";

  type TooltipContext = {
    index: number;
    value: number;
    label: string;
  };

  const {
    data,
    labels,
    tooltipHTML,
    height = "180px",
    minWidth,
    axisInset = 50,
  }: {
    data: number[];
    labels: string[];
    tooltipHTML: (context: TooltipContext) => string;
    height?: string;
    minWidth?: string;
    axisInset?: number;
  } = $props();

  let containerWidth = $state(0);
  let chartContainer = $state<HTMLDivElement | undefined>();

  const barWidth = $derived(
    containerWidth > 0
      ? Math.ceil((containerWidth - axisInset) / labels.length)
      : undefined,
  );

  $effect(() => {
    if (!chartContainer) return;
    const resizeObserver = new ResizeObserver((entries) => {
      containerWidth = entries[0].contentRect.width;
    });
    resizeObserver.observe(chartContainer);
    return () => resizeObserver.disconnect();
  });

  const maxIndex = $derived(findMaxIndex(data));

  const chartData = $derived(
    data.map((value, index) => ({
      group: index === maxIndex ? "Max" : "Normal",
      key: labels[index],
      value,
    })),
  );

  const options = $derived({
    title: "",
    theme: "g100",
    axes: {
      left: { visible: false },
      bottom: {
        visible: true,
        mapsTo: "key",
        scaleType: "labels",
        title: "",
      },
    },
    height,
    legend: { enabled: false },
    toolbar: { enabled: false },
    bars: { width: barWidth, spacingFactor: 0 },
    color: {
      scale: {
        Normal: barColorNormal,
        Max: barColorMax,
      },
    },
    tooltip: {
      customHTML: (points: Array<{ value: number; key: string }>) => {
        if (!points || points.length === 0) return "";
        const point = points[0];
        const index = labels.indexOf(point.key);
        return tooltipHTML({ index, value: point.value, label: point.key });
      },
    },
    grid: {
      x: { enabled: false },
      y: { enabled: false },
    },
  });
</script>

<div class="bar-chart" style:min-width={minWidth} bind:this={chartContainer}>
  <BarChartSimple data={chartData} {options} />
</div>

<style lang="scss">
  .bar-chart {
    --color-chart-bar: var(--shade-300);
    --color-chart-bar-max: var(--shade-10);
    --color-chart-bar-hover: var(--red-700);
    --color-chart-axis: var(--shade-500);
    --color-chart-tooltip-background: color-mix(
      in srgb,
      var(--shade-1000) 92%,
      transparent
    );
    --color-chart-tooltip-border: var(--shade-800);
    --color-chart-tooltip-text: var(--shade-10);

    :global(.cds--cc--chart-wrapper),
    :global(.cds--cc--chart-svg),
    :global(.cds--cc--chart-holder),
    :global(svg),
    :global(g) {
      background: transparent;
    }

    :global(path[class*="bar fill"]) {
      transition: fill 0.15s ease;
      cursor: pointer;

      &:hover {
        fill: var(--color-chart-bar-hover);
      }
    }

    :global(.cds--cc--axis-title) {
      display: none;
    }

    :global(.cds--cc--axes g.axis g.tick text) {
      fill: var(--color-chart-axis);
      font-size: 11px;
      font-family: inherit;
    }

    :global(.cds--cc--grid line) {
      stroke: transparent;
    }

    :global(.cds--cc--grid rect.chart-grid-backdrop) {
      fill: none;
    }

    :global(.cds--cc--axis path),
    :global(.cds--cc--axis line) {
      stroke: var(--color-chart-axis);
    }

    :global(.cds--tooltip),
    :global(.cds--cc--tooltip),
    :global(.cds--cc--tooltip-container) {
      background: transparent;
      background-color: transparent;
      border: none;
      box-shadow: none;
    }

    :global(.bar-chart-tooltip) {
      background: var(--color-chart-tooltip-background);
      border: var(--border-thickness-xxs) solid var(--color-chart-tooltip-border);
      border-radius: var(--border-radius-xs);
      padding: var(--ni-8) var(--ni-12);
      color: var(--color-chart-tooltip-text);
      font-family: inherit;
      box-shadow: 0 var(--ni-2) var(--ni-8)
        color-mix(in srgb, var(--shade-1000) 60%, transparent);
      text-align: center;
    }

    :global(.bar-chart-tooltip-primary) {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: var(--ni-4);
      color: var(--color-chart-tooltip-text);
    }

    :global(.bar-chart-tooltip-secondary) {
      font-size: 11px;
      opacity: 0.85;
    }

    :global(.bar-chart-tooltip-tertiary) {
      font-size: 10px;
      opacity: 0.65;
    }
  }
</style>
