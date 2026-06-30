<script lang="ts">
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { useVarToPixels } from "$lib/stores/css/useVarToPixels";
  import { hierarchy, pack } from "d3";
  import { nextVizId } from "./_internal/nextVizId.ts";
  import type {
    BubbleChartItem,
    BubbleChartProps,
    BubbleChartTooltipArgs,
  } from "./models/BubbleChartProps";

  const { items, tooltip, label = "Bubble chart" }: BubbleChartProps = $props();

  type HierarchyDatum = {
    item?: BubbleChartItem;
    value?: number;
    children?: HierarchyDatum[];
  };

  type PackedNode = {
    item: BubbleChartItem;
    x: number;
    y: number;
    r: number;
    fill: string;
  };

  const padding = 3;
  const filterId = nextVizId("bubble-chart-whiteimage");

  const minContentRadius = useVarToPixels("var(--min-radius-bubble-chart)");

  // Width and height are both read from the container element so consumers
  // can size the chart however they like (CSS var token, fixed px, percent
  // of parent, etc.) without needing a global CSS variable lookup. Using
  // `useVarToPixels` for height previously meant any local override of
  // `--height-bubble-chart` was ignored, since that helper resolves vars
  // against `document.body`, not the chart container.
  const { observedDimension: observedWidth, observeDimension: observeWidth } =
    useDimensionObserver("width");
  const { observedDimension: observedHeight, observeDimension: observeHeight } =
    useDimensionObserver("height");

  let hovered = $state<PackedNode | null>(null);
  let pointer = $state({ x: 0, y: 0 });
  let failedImages = $state<Set<number>>(new Set());

  const nodes = $derived.by<PackedNode[]>(() => {
    const width = $observedWidth;
    const height = $observedHeight;
    if (width === 0 || height === 0 || items.length === 0) return [];

    const root = hierarchy<HierarchyDatum>(
      {
        children: items.map((item) => ({ item, value: item.value })),
      },
      (d) => d.children ?? null,
    )
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const layout = pack<HierarchyDatum>()
      .size([width, height])
      .padding(padding);

    return layout(root)
      .leaves()
      .map((leaf) => {
        const item = leaf.data.item!;
        return { item, x: leaf.x, y: leaf.y, r: leaf.r, fill: item.color };
      });
  });

  // SVG paints in document order with no z-index, so a hovered (scaled) bubble
  // gets clipped by later siblings. Render the hovered node last so it paints on
  // top; keyed `each` just moves the existing element, preserving its transition.
  const orderedNodes = $derived.by(() => {
    const active = hovered;
    if (!active) {
      return nodes;
    }
    return [
      ...nodes.filter((node) => node.item.id !== active.item.id),
      ...nodes.filter((node) => node.item.id === active.item.id),
    ];
  });

  function imageSizeFor(r: number): number {
    return Math.min(r * 1.2, 80);
  }

  function fontSizeFor(r: number): number {
    return Math.max(12, r / 4);
  }

  function truncatedLabel(label: string, r: number): string {
    const maxChars = Math.floor(r / 5);
    return label.length > maxChars ? label.substring(0, maxChars) + "…" : label;
  }

  function handlePointerEnter(node: PackedNode, event: PointerEvent) {
    hovered = node;
    pointer = { x: event.clientX, y: event.clientY };
  }

  function handlePointerMove(event: PointerEvent) {
    if (!hovered) return;
    pointer = { x: event.clientX, y: event.clientY };
  }

  function handlePointerLeave(event: PointerEvent) {
    // Touch fires a synthetic leave right after the tap - ignore it so the
    // tapped bubble's tooltip stays pinned (mirrors the chart interaction hook).
    if (event.pointerType !== "mouse") {
      return;
    }
    hovered = null;
  }

  // Keyboard: each bubble is focusable (Tab between them); focus shows its
  // tooltip anchored at the bubble centre, Escape clears + blurs.
  function handleFocus(node: PackedNode, event: FocusEvent) {
    hovered = node;
    const rect = (event.currentTarget as Element).getBoundingClientRect();
    pointer = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function handleBlur() {
    hovered = null;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      hovered = null;
      (event.currentTarget as SVGElement).blur();
    }
  }

  function handleImageError(id: number) {
    failedImages.add(id);
  }

  const tooltipArgs = $derived<BubbleChartTooltipArgs | null>(
    hovered ? { item: hovered.item } : null,
  );
</script>

<figure
  class="trakt-bubble-chart"
  use:observeWidth
  use:observeHeight
  onpointermove={handlePointerMove}
  onpointerleave={handlePointerLeave}
  role="presentation"
>
  <figcaption class="viz-caption">{label}</figcaption>

  <svg
    width={$observedWidth}
    height={$observedHeight}
    role="img"
    aria-label={label}
  >
    <defs>
      <filter id={filterId}>
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"
        />
      </filter>
    </defs>

    {#each orderedNodes as node (node.item.id)}
      {@const showImage = node.item.imageUrl && !failedImages.has(node.item.id)}
      {@const hasRoomForContent = node.r >= $minContentRadius}
      {@const imageSize = imageSizeFor(node.r)}

      <!--
        role="img" labels each bubble for screen readers; bubbles are also
        keyboard-focusable (Tab between them, Escape clears), so the tabindex +
        listeners are intentional.
      -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <g
        class="node"
        onpointerenter={(event) => handlePointerEnter(node, event)}
        onpointerdown={(event) => handlePointerEnter(node, event)}
        onfocus={(event) => handleFocus(node, event)}
        onblur={handleBlur}
        onkeydown={handleKeydown}
        role="img"
        aria-label={node.item.label}
        tabindex="0"
        style="--viz-series: {node.fill};"
      >
        <circle cx={node.x} cy={node.y} r={node.r} fill={node.fill} />

        {#if hasRoomForContent}
          {#if showImage}
            <image
              href={node.item.imageUrl}
              x={node.x - imageSize / 2}
              y={node.y - imageSize / 2}
              width={imageSize}
              height={imageSize}
              preserveAspectRatio="xMidYMid meet"
              filter="url(#{filterId})"
              pointer-events="none"
              onerror={() => handleImageError(node.item.id)}
            />
          {:else}
            <text
              x={node.x}
              y={node.y}
              text-anchor="middle"
              dominant-baseline="middle"
              font-size={fontSizeFor(node.r)}
              font-weight="600"
              fill="#fff"
              pointer-events="none"
            >
              {truncatedLabel(node.item.label, node.r)}
            </text>
          {/if}
        {/if}
      </g>
    {/each}
  </svg>

  <!-- TODO: see if we can leverage Tooltip.svelte here -->
  {#if tooltip && tooltipArgs && hovered}
    <div
      class="bubble-chart-tooltip"
      style:left="{pointer.x}px"
      style:top="{pointer.y}px"
    >
      {@render tooltip(tooltipArgs)}
    </div>
  {/if}
</figure>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-bubble-chart {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    // Let the page scroll vertically over the chart while the bubbles own taps;
    // suppress native tap highlight + selection during hover/scrub.
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;
    user-select: none;

    svg {
      display: block;
    }

    .node {
      cursor: pointer;
      transform-box: fill-box;
      transform-origin: center;
      transition:
        transform var(--transition-increment) ease,
        filter var(--transition-increment) ease;

      &:hover,
      &:focus-visible {
        transform: scale(1.06);
        @include viz-hover-active;
      }

      outline: none;

      &:focus-visible {
        outline: var(--ni-2) solid var(--shade-10);
        outline-offset: var(--ni-2);
        border-radius: var(--border-radius-s);
      }
    }

    .viz-caption {
      @include visually-hidden;
    }
  }

  .bubble-chart-tooltip {
    position: fixed;
    pointer-events: none;
    transform: translate(-50%, calc(-100% - var(--ni-12)));
    z-index: var(--layer-top);
  }
</style>
