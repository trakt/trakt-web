<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";
  import type { TagIntl } from "./TagIntl";

  const { plays, i18n }: { plays: number; i18n: TagIntl } = $props();
</script>

<div class="trakt-plays-tag">
  <TagContent>
    <p class="meta-info uppercase no-wrap">
      {i18n.toPlayCount(plays)}
    </p>
  </TagContent>
</div>

<style>
  .trakt-plays-tag {
    :global(.trakt-tag) {
      background: var(--color-background-plays-tag);
      color: var(--color-text-plays-tag);
    }
  }
</style>
