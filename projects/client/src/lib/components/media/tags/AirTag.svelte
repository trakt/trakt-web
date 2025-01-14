<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";
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

<div class="trakt-air-tag">
  <TagContent>
    <p class="meta-info capitalize no-wrap">
      {#if year == null}
        <!-- TODO: investigate if we can determine using airDate -->
        {i18n.tbaLabel()}
      {:else}
        {i18n.toReleaseEstimate(airDate)}
      {/if}
    </p>
  </TagContent>
</div>

<style>
  .trakt-air-tag {
    :global(.trakt-tag) {
      background: var(--color-background-year-tag);
      color: var(--color-text-year-tag);
    }
  }
</style>
