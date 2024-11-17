<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="episode-status-tag">
  <TagContent>
    {@render children()}
  </TagContent>
</div>

<style>
  .episode-status-tag :global(.trakt-tag) {
    text-transform: uppercase;

    background: var(--color-background-status-tag);
    color: var(--color-text-status-tag);
  }
</style>
