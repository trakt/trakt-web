<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="media-watchers-tag">
  <TagContent>
    <p class="meta-info uppercase no-wrap">
      {@render children()}
    </p>
  </TagContent>
</div>

<style>
  .media-watchers-tag {
    :global(.trakt-tag) {
      background: var(--color-background-watchers-tag);
      color: var(--color-text-watchers-tag);
    }
  }
</style>
