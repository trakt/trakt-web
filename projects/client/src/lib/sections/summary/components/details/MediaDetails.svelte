<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import Link from "$lib/components/link/Link.svelte";
  import CollapsableValues from "./_internal/CollapsableValues.svelte";
  import DetailsGrid from "./_internal/DetailsGrid.svelte";
  import { useMediaDetails } from "./_internal/useMediaDetails";
  import type { MediaDetailsProps } from "./MediaDetailsProps";

  const props: MediaDetailsProps = $props();

  const mediaDetails = $derived(useMediaDetails(props));
</script>

<DetailsGrid title={m.header_details()}>
  {#each mediaDetails as { title, values }}
    {#if values && values.length > 0}
      <CollapsableValues category={title} {values}>
        <p class="meta-info secondary">{title}</p>
        {#snippet value(value)}
          {#if typeof value === "object"}
            <Link href={value.link}>
              <p class="small capitalize ellipsis">{value.label}</p>
            </Link>
          {:else}
            <p class="small capitalize ellipsis">{value}</p>
          {/if}
        {/snippet}
      </CollapsableValues>
    {/if}
  {/each}
</DetailsGrid>
