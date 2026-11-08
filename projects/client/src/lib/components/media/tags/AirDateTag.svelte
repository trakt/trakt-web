<script lang="ts">
  import TagByType from "$lib/components/tags/TagByType.svelte";
  import { isMaxDate } from "$lib/utils/date/isMaxDate";
  import type { AirDateTagProps } from "./_internal/AirDateTagProps.ts";

  const { airDate, year, i18n, type = "text" }: AirDateTagProps = $props();
</script>

{#snippet content()}
  <p class="bold capitalize no-wrap">
    {#if isMaxDate(airDate)}
      {i18n.tbaLabel()}
    {:else if airDate.getTime() <= Date.now() && year != null}
      {year}
    {:else}
      {i18n.toReleaseEstimate(airDate)}
    {/if}
  </p>
{/snippet}

<TagByType {type}>
  {@render content()}
</TagByType>
