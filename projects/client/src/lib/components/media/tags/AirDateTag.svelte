<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import { isMaxDate } from "$lib/utils/date/isMaxDate";
  import type { TagIntl } from "./TagIntl";

  const {
    airDate,
    i18n,
  }: {
    airDate: Date;
    i18n: TagIntl;
  } = $props();
</script>

<StemTag>
  <p class="meta-info capitalize no-wrap">
    {#if isMaxDate(airDate)}
      {i18n.tbaLabel()}
    {:else}
      {i18n.toReleaseEstimate(airDate)}
    {/if}
  </p>
</StemTag>
