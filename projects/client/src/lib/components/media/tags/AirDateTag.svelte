<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
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

{#snippet content(isSecondary: boolean)}
  <p class="meta-info capitalize no-wrap" class:secondary={isSecondary}>
    {#if isMaxDate(airDate)}
      {i18n.tbaLabel()}
    {:else}
      {i18n.toReleaseEstimate(airDate)}
    {/if}
  </p>
{/snippet}

{#if isTextOnly}
  {@render content(true)}
{:else}
  <StemTag>
    {@render content(false)}
  </StemTag>
{/if}
