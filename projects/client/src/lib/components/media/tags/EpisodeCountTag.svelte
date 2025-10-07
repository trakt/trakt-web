<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const {
    count,
    i18n,
    isTextOnly = false,
  }: {
    count: number;
    i18n: TagIntl;
    isTextOnly?: boolean;
  } = $props();
</script>

{#snippet content(isSecondary: boolean)}
  <p class="meta-info capitalize no-wrap" class:secondary={isSecondary}>
    {i18n.toEpisodeCount(count)}
  </p>
{/snippet}

{#if isTextOnly}
  {@render content(true)}
{:else}
  <StemTag>
    {@render content(false)}
  </StemTag>
{/if}
