<svelte:options namespace="svg" />

<script lang="ts">
  import type { PinShape } from "./PinShape.ts";

  const {
    shapes,
    paint,
    grow = 0,
    maskId,
  }: {
    shapes: ReadonlyArray<PinShape>;
    paint: string;
    /** Widens every shape: the metal backing peeks out around the enamel. */
    grow?: number;
    /** Set on the one pass per pin that cuts knockouts, to keep ids unique. */
    maskId?: string;
  } = $props();
</script>

{#snippet part(shape: PinShape)}
  {#if shape.kind === "fill"}
    {@const outline = grow + (shape.round ?? 0)}
    <path
      d={shape.d}
      transform={shape.transform}
      fill-rule="evenodd"
      stroke-linejoin="round"
      stroke-width={outline || undefined}
      style:fill={paint}
      style:stroke={outline ? paint : "none"}
    />
  {:else}
    <path
      d={shape.d}
      transform={shape.transform}
      fill="none"
      stroke-width={shape.width + grow}
      stroke-linecap="round"
      stroke-linejoin="round"
      style:stroke={paint}
    />
  {/if}
{/snippet}

{#each shapes as shape, index (index)}
  {#if maskId && shape.knockout}
    {@const id = `${maskId}-${index}`}
    {@const knockout = shape.knockout}
    <defs>
      {#if knockout.half}
        <clipPath id={`${id}-half`}>
          <rect
            x="-20"
            y={knockout.half === "top" ? -20 : 50}
            width="140"
            height="70"
          />
        </clipPath>
      {/if}
      <mask
        {id}
        maskUnits="userSpaceOnUse"
        x="-20"
        y="-20"
        width="140"
        height="140"
      >
        <rect x="-20" y="-20" width="140" height="140" fill="white" />
        <g transform={knockout.transform}>
          <path
            d={knockout.d}
            fill={knockout.isFilled ? "black" : "none"}
            stroke="black"
            stroke-width={knockout.width}
            stroke-linejoin="round"
            clip-path={knockout.half ? `url(#${id}-half)` : undefined}
          />
        </g>
      </mask>
    </defs>
    <g mask={`url(#${id})`}>{@render part(shape)}</g>
  {:else}
    {@render part(shape)}
  {/if}
{/each}
