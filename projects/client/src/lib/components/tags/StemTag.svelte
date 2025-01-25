<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-stem-tag">
  <TagContent>
    <p class="meta-info">
      {@render children()}
    </p>
  </TagContent>
</div>

<style>
  .trakt-stem-tag {
    :global(.trakt-tag) {
      background: var(--color-background-stem-tag);
      color: var(--color-text-stem-tag);
    }
  }
</style>
