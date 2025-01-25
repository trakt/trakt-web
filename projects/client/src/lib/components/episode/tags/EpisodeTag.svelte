<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="episode-status-tag">
  <TagContent>
    <p class="meta-info">
      {@render children()}
    </p>
  </TagContent>
</div>

<style>
  .episode-status-tag {
    :global(.trakt-tag) {
      background: var(--color-background-status-tag);
      color: var(--color-text-status-tag);
    }
  }
</style>
