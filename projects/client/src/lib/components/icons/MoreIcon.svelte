<script lang="ts">
  import { checksum } from "$lib/utils/string/checksum";

  type MoreIconProps = {
    shadowColor?: string;
  };

  const { shadowColor }: MoreIconProps = $props();

  const filterId = $derived(
    shadowColor ? `drop-shadow-${checksum(shadowColor)}` : undefined,
  );
</script>

{#snippet circles(filterUrl: string = "")}
  <circle cx="8" cy="2" r="2" fill="currentColor" filter={filterUrl} />
  <circle cx="8" cy="8" r="2" fill="currentColor" filter={filterUrl} />
  <circle cx="8" cy="14" r="2" fill="currentColor" filter={filterUrl} />
{/snippet}

<svg
  width="16"
  height="16"
  viewBox="0 0 16 16"
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
