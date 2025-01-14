<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";
  import type { TagIntl } from "./TagIntl";

  const {
    count,
    i18n,
  }: {
    count: number;
    i18n: TagIntl;
  } = $props();
</script>

<div class="trakt-episode-tag">
  <TagContent>
    <p class="meta-info capitalize no-wrap">
      {i18n.toEpisodeCount(count)}
    </p>
  </TagContent>
</div>

<style>
  .trakt-episode-tag {
    :global(.trakt-tag) {
      background: var(--color-background-episode-count-tag);
      color: var(--color-text-episode-count-tag);
    }
  }
</style>
