<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="episode-premiere-tag">
  <TagContent>
    {@render children()}
  </TagContent>
</div>

<style>
  .episode-premiere-tag :global(.trakt-tag) {
    text-transform: uppercase;

    background: var(--color-background-premiere-tag);
    color: var(--color-text-premiere-tag);
  }
</style>
