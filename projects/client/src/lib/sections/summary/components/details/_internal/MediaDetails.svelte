<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import type { MediaDetailsProps } from "../MediaDetailsProps";
  import CollapsableValues from "./CollapsableValues.svelte";
  import DetailsGrid from "./DetailsGrid.svelte";
  import { useMediaDetails } from "./useMediaDetails";

  const { title, ...props }: { title?: string } & MediaDetailsProps = $props();

  const mediaDetails = $derived(useMediaDetails(props));
</script>

<DetailsGrid>
  {#each mediaDetails as { title, values } (title)}
    {#if values && values.length > 0}
      <CollapsableValues category={title} {values}>
        <p class="details-label">{title}</p>
        {#snippet value(value)}
          {#if typeof value === "object"}
            <Link href={value.link}>
              <p class="details-value capitalize ellipsis">
                {value.label}
              </p>
            </Link>
          {:else}
            <p class="details-value capitalize">{value}</p>
          {/if}
        {/snippet}
      </CollapsableValues>
    {/if}
  {/each}
</DetailsGrid>

<style>
  /*
    Uppercased by CSS, never in the string - the label text is what the
    tests (and screen readers) read.
  */
  .details-label {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-text-secondary);

    white-space: nowrap;
  }

  .details-value {
    color: var(--color-text-primary);
  }
</style>
