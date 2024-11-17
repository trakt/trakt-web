<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="poster-duration-tag">
  <TagContent>
    {@render children()}
  </TagContent>
</div>

<style>
  .poster-duration-tag :global(.trakt-tag) {
    background: var(--color-background-time-tag);
    color: var(--color-text-time-tag);
  }
</style>
