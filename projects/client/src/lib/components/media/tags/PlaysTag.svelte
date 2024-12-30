<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="plays-tag">
  <TagContent>
    <p class="meta-info uppercase no-wrap">
      {@render children()}
    </p>
  </TagContent>
</div>

<style>
  .plays-tag {
    :global(.trakt-tag) {
      background: var(--color-background-watching-tag);
      color: var(--color-text-watching-tag);
    }
  }
</style>
