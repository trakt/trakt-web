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

<StemTag
  --color-background-stem-tag="var(--color-background-air-date-tag)"
  --color-text-stem-tag="var(--color-text-air-date-tag)"
>
  <p class="meta-info capitalize no-wrap">
    {#if year == null}
      <!-- TODO: investigate if we can determine using airDate -->
      {i18n.tbaLabel()}
    {:else}
      {i18n.toReleaseEstimate(airDate)}
    {/if}
  </p>
</StemTag>
