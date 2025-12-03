<script lang="ts">
  import { checksum } from "$lib/utils/string/checksum";

  type MoreIconProps = {
    shadowColor?: string;
    size?: "small" | "normal";
  };

  const { shadowColor, size = "small" }: MoreIconProps = $props();

  const filterId = $derived(
    shadowColor ? `drop-shadow-${checksum(shadowColor)}` : undefined,
  );

  const baseSize = $derived(size === "small" ? 16 : 24);
  const halfBaseSize = $derived(baseSize / 2);
  const radius = $derived(size === "small" ? 2 : 2.5);
</script>

{#snippet circles(filterUrl: string = "")}
  <circle
    cx={halfBaseSize}
    cy={size === "small" ? 2 : 4}
    r={radius}
    fill="currentColor"
    filter={filterUrl}
  />
  <circle
    cx={halfBaseSize}
    cy={halfBaseSize}
    r={radius}
    fill="currentColor"
    filter={filterUrl}
  />
  <circle
    cx={halfBaseSize}
    cy={size === "small" ? 14 : 20}
    r={radius}
    fill="currentColor"
    filter={filterUrl}
  />
{/snippet}

<svg
  width={baseSize}
  height={baseSize}
  viewBox="0 0 #{baseSize} #{baseSize}"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  overflow="visible"
>
  {#if filterId}
    <defs>
      <!--
        CSS drop shadow filter does not work on SVG elements in Safari,
        so we use an SVG filter instead.
      -->
      <filter id={filterId} x="-100%" y="-100%" width="300%" height="300%">
        <feDropShadow dx="0" dy="0" flood-color={shadowColor} />
      </filter>
    </defs>
    {@render circles(`url(#${filterId})`)}
  {:else}
    {@render circles()}
  {/if}
</svg>
