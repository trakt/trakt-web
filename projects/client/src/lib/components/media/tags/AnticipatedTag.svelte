<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";
  import type { TagIntl } from "./TagIntl";

  const {
    score,
    i18n,
  }: {
    score: number;
    i18n: TagIntl;
  } = $props();
</script>

<div class="trakt-listing-tag">
  <TagContent>
    <p class="meta-info capitalize no-wrap">
      {i18n.toAnticipatedCount(score)}
    </p>
  </TagContent>
</div>

<style>
  .trakt-listing-tag {
    :global(.trakt-tag) {
      background: var(--color-background-listing-tag);
      color: var(--color-text-listing-tag);
    }
  }
</style>
