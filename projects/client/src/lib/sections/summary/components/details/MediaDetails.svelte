<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import Link from "$lib/components/link/Link.svelte";
  import CollapsableSection from "../_internal/CollapsableSection.svelte";
  import CollapsableValues from "./_internal/CollapsableValues.svelte";
  import DetailsGrid from "./_internal/DetailsGrid.svelte";
  import { useMediaDetails } from "./_internal/useMediaDetails";
  import type { MediaDetailsProps } from "./MediaDetailsProps";

  const { title, ...props }: { title?: string } & MediaDetailsProps = $props();

  const mediaDetails = $derived(useMediaDetails(props));
  const toggleLabels = {
    expand: m.button_text_view_details(),
    collapse: m.button_text_hide_details(),
  };
</script>

<CollapsableSection
  id={`${props.type}-details`}
  title={m.header_details()}
  {toggleLabels}
  --height-content="var(--ni-320)"
>
  <DetailsGrid>
    {#each mediaDetails as { title, values }}
      {#if values && values.length > 0}
        <CollapsableValues category={title} {values}>
          <p class="meta-info secondary">{title}</p>
          {#snippet value(value)}
            {#if typeof value === "object"}
              <Link href={value.link}>
                <p class="capitalize ellipsis">{value.label}</p>
              </Link>
            {:else}
              <p class="capitalize ellipsis">{value}</p>
            {/if}
          {/snippet}
        </CollapsableValues>
      {/if}
    {/each}
  </DetailsGrid>
</CollapsableSection>
