<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import { isMaxDate } from "$lib/utils/date/isMaxDate";
  import type { TagIntl } from "./TagIntl";

  const {
    airDate,
    i18n,
    isTextOnly = false,
  }: {
    airDate: Date;
    i18n: TagIntl;
    isTextOnly?: boolean;
  } = $props();
</script>

{#snippet content()}
  <p class="meta-info capitalize no-wrap">
    {#if isMaxDate(airDate)}
      {i18n.tbaLabel()}
    {:else}
      {i18n.toReleaseEstimate(airDate)}
    {/if}
  </p>
{/snippet}

{#if isTextOnly}
  <TextTag>
    {@render content()}
  </TextTag>
{:else}
  <StemTag>
    {@render content()}
  </StemTag>
{/if}
