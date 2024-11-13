<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="episode-finale-tag">
  <TagContent>
    {@render children()}
  </TagContent>
</div>

<style>
  .episode-finale-tag :global(.trakt-tag) {
    text-transform: uppercase;

    background: var(--color-background-finale-tag);
    color: var(--color-text-finale-tag);
  }
</style>
