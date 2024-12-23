<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="media-type-tag">
  <TagContent>
    <p class="meta-info capitalize">
      {@render children()}
    </p>
  </TagContent>
</div>

<style>
  .media-type-tag {
    :global(.trakt-tag) {
      background: var(--color-background-media-type-tag);
      color: var(--color-text-media-type-tag);
      border-radius: var(--border-radius-xs);
    }
  }
</style>
