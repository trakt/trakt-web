<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-info-tag">
  <TagContent>
    <p class="meta-info capitalize no-wrap">
      {@render children()}
    </p>
  </TagContent>
</div>

<style>
  .trakt-info-tag {
    :global(.trakt-tag) {
      background: var(--color-background-info-tag);
      color: var(--color-text-info-tag);
    }
  }
</style>
