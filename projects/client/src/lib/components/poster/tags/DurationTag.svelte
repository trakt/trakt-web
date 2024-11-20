<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="poster-duration-tag">
  <TagContent>
    <p class="meta-info">
      {@render children()}
    </p>
  </TagContent>
</div>

<style>
  .poster-duration-tag {
    /** TODO: remove once typography handles non-capitalized meta-info */
    .meta-info {
      text-transform: none;
    }

    :global(.trakt-tag) {
      background: var(--color-background-time-tag);
      color: var(--color-text-time-tag);
    }
  }
</style>
