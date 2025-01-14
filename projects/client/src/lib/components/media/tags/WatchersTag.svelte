<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";
  import type { TagIntl } from "./TagIntl";

  const {
    watchers,
    i18n,
  }: {
    watchers: number;
    i18n: TagIntl;
  } = $props();
</script>

<div class="trakt-watchers-tag">
  <TagContent>
    <p class="meta-info capitalize no-wrap">
      {i18n.toWatcherCount(watchers)}
    </p>
  </TagContent>
</div>

<style>
  .trakt-watchers-tag {
    :global(.trakt-tag) {
      background: var(--color-background-watchers-tag);
      color: var(--color-text-watchers-tag);
    }
  }
</style>
