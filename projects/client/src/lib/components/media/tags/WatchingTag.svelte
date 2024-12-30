<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="media-watching-tag">
  <TagContent>
    <p class="meta-info uppercase no-wrap">
      {@render children()}
    </p>
  </TagContent>
</div>

<style>
  .media-watching-tag {
    :global(.trakt-tag) {
      background: var(--color-background-watching-tag);
      color: var(--color-text-watching-tag);
    }
  }
</style>
