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
  {#each mediaDetails as { title, values }}
    {#if values && values.length > 0}
      <CollapsableValues category={title} {values}>
        <p class="bold secondary">{title}</p>
        {#snippet value(value)}
          {#if typeof value === "object"}
            <Link href={value.link}>
              <p class="capitalize ellipsis">{value.label}</p>
            </Link>
          {:else}
            <p class="capitalize">{value}</p>
          {/if}
        {/snippet}
      </CollapsableValues>
    {/if}
  {/each}
</DetailsGrid>
