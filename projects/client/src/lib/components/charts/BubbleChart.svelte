<script lang="ts">
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver";
  import { useVarToPixels } from "$lib/stores/css/useVarToPixels";
  import { hierarchy, pack } from "d3";
  import type {
    BubbleChartItem,
    BubbleChartProps,
    BubbleChartTooltipArgs,
  } from "./models/BubbleChartProps";

  const { items, tooltip }: BubbleChartProps = $props();

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
  const filterId = `bubble-chart-whiteimage-${crypto.randomUUID()}`;

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

  function handlePointerLeave() {
    hovered = null;
  }

  function handleImageError(id: number) {
    failedImages.add(id);
  }

  const tooltipArgs = $derived<BubbleChartTooltipArgs | null>(
    hovered ? { item: hovered.item } : null,
  );
</script>

<div
  class="bubble-chart"
  use:observeWidth
  use:observeHeight
  onpointermove={handlePointerMove}
  onpointerleave={handlePointerLeave}
  role="presentation"
>
  <svg
    width={$observedWidth}
    height={$observedHeight}
    role="img"
    aria-label="Bubble chart"
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

    {#each nodes as node (node.item.id)}
      {@const showImage = node.item.imageUrl && !failedImages.has(node.item.id)}
      {@const hasRoomForContent = node.r >= $minContentRadius}
      {@const imageSize = imageSizeFor(node.r)}

      <g
        class="node"
        onpointerenter={(event) => handlePointerEnter(node, event)}
        role="img"
        aria-label={node.item.label}
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
</div>

<style lang="scss">
  .bubble-chart {
    position: relative;
    width: 100%;
    height: 100%;

    svg {
      display: block;
    }

    .node {
      cursor: pointer;
      transform-box: fill-box;
      transform-origin: center;
      transition: transform var(--transition-increment) ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .bubble-chart-tooltip {
    position: fixed;
    pointer-events: none;
    transform: translate(-50%, calc(-100% - var(--ni-12)));
    z-index: var(--layer-top);
  }
</style>
