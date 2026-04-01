<script lang="ts">
  import type { YirCompany } from "$lib/requests/models/YirDetail";
  import { hierarchy, pack } from "d3";
  import YirTooltip from "../../_internal/YirTooltip.svelte";

  const {
    companies,
    type = "shows",
  }: {
    companies: YirCompany[];
    type?: "shows" | "movies";
  } = $props();

  type PackedNode = {
    company: YirCompany;
    x: number;
    y: number;
    r: number;
    fill: string;
  };

  const fallbackFill = "#333";
  const padding = 3;
  const minContentRadius = 20;
  const blackPattern = /^#0{3}(?:0{3})?$/i;

  let container = $state<HTMLDivElement | undefined>();
  let width = $state(0);
  let height = $state(0);
  let hovered = $state<PackedNode | null>(null);
  let pointer = $state({ x: 0, y: 0 });
  let failedImages = $state<Set<number>>(new Set());

  $effect(() => {
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      width = rect.width;
      height = rect.height;
    });
    observer.observe(container);
    return () => observer.disconnect();
  });

  function fillFor(company: YirCompany): string {
    const raw = (company.color ?? "").toLowerCase();
    if (!raw || blackPattern.test(raw)) return fallbackFill;
    return company.color ?? fallbackFill;
  }

  const nodes = $derived.by<PackedNode[]>(() => {
    if (width === 0 || height === 0 || companies.length === 0) return [];

    const root = hierarchy<{ company?: YirCompany; value?: number }>({
      children: companies.map((company) => ({
        company,
        value: company.count,
      })),
    }, (d) => d.children as never)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const layout = pack<{ company?: YirCompany; value?: number }>()
      .size([width, height])
      .padding(padding);

    return layout(root).leaves().map((leaf) => {
      const company = leaf.data.company!;
      return {
        company,
        x: leaf.x,
        y: leaf.y,
        r: leaf.r,
        fill: fillFor(company),
      };
    });
  });

  function imageSizeFor(r: number): number {
    return Math.min(r * 1.2, 80);
  }

  function fontSizeFor(r: number): number {
    return Math.max(12, r / 4);
  }

  function truncatedName(name: string, r: number): string {
    const maxChars = Math.floor(r / 5);
    return name.length > maxChars
      ? name.substring(0, maxChars) + "..."
      : name;
  }

  function itemLabelFor(count: number): string {
    if (type === "movies") return count === 1 ? "movie" : "movies";
    return count === 1 ? "show" : "shows";
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

  function handleImageError(companyId: number) {
    failedImages = new Set(failedImages).add(companyId);
  }
</script>

<div
  class="yir-networks-chart"
  bind:this={container}
  onpointermove={handlePointerMove}
  onpointerleave={handlePointerLeave}
>
  <svg {width} {height} role="img" aria-label="Top networks">
    <defs>
      <filter id="yir-networks-whiteimage">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"
        />
      </filter>
    </defs>

    {#each nodes as node (node.company.id)}
      {@const showImage =
        node.company.imageUrl && !failedImages.has(node.company.id)}
      {@const hasRoomForContent = node.r >= minContentRadius}
      {@const imageSize = imageSizeFor(node.r)}

      <g
        class="node"
        onpointerenter={(event) => handlePointerEnter(node, event)}
      >
        <circle cx={node.x} cy={node.y} r={node.r} fill={node.fill} />

        {#if hasRoomForContent}
          {#if showImage}
            <image
              href={node.company.imageUrl}
              x={node.x - imageSize / 2}
              y={node.y - imageSize / 2}
              width={imageSize}
              height={imageSize}
              preserveAspectRatio="xMidYMid meet"
              filter="url(#yir-networks-whiteimage)"
              pointer-events="none"
              onerror={() => handleImageError(node.company.id)}
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
              {truncatedName(node.company.name, node.r)}
            </text>
          {/if}
        {/if}
      </g>
    {/each}
  </svg>

  {#if hovered}
    <div
      class="yir-networks-chart-tooltip"
      style:left="{pointer.x}px"
      style:top="{pointer.y}px"
    >
      <YirTooltip
        main={hovered.company.name}
        sub="{hovered.company.count} {itemLabelFor(hovered.company.count)}"
      />
    </div>
  {/if}
</div>

<style lang="scss">
  .yir-networks-chart {
    position: relative;
    width: 100%;
    height: var(--ni-640);

    svg {
      display: block;
    }

    .node {
      cursor: pointer;
      transform-box: fill-box;
      transform-origin: center;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .yir-networks-chart-tooltip {
    position: fixed;
    pointer-events: none;
    transform: translate(-50%, calc(-100% - var(--ni-12)));
    z-index: var(--layer-top);
  }
</style>
