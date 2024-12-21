<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="media-year-tag">
  <TagContent>
    <p class="meta-info capitalize">
      {@render children()}
    </p>
  </TagContent>
</div>

<style>
  .media-year-tag {
    :global(.trakt-tag) {
      background: var(--color-background-year-tag);
      color: var(--color-text-year-tag);
    }
  }
</style>
