<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="media-certification-tag">
  <TagContent>
    <p class="meta-info capitalize">
      {@render children()}
    </p>
  </TagContent>
</div>

<style>
  .media-certification-tag {
    :global(.trakt-tag) {
      background: var(--color-background-certification-tag);
      color: var(--color-text-certification-tag);
    }
  }
</style>
