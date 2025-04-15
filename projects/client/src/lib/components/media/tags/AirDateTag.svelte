<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { TagIntl } from "./TagIntl";

  const {
    year,
    airDate,
    i18n,
  }: {
    year: number | Nil;
    airDate: Date;
    i18n: TagIntl;
  } = $props();
</script>

<StemTag>
  <p class="meta-info capitalize no-wrap">
    {#if year == null}
      <!-- TODO: investigate if we can determine using airDate -->
      {i18n.tbaLabel()}
    {:else}
      {i18n.toReleaseEstimate(airDate)}
    {/if}
  </p>
</StemTag>
