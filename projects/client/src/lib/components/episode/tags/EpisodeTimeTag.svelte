<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="episode-time-tag">
  <TagContent>
    {@render children()}
  </TagContent>
</div>

<style>
  .episode-time-tag :global(.trakt-tag) {
    &::first-letter {
      text-transform: capitalize;
    }

    background: var(--color-background-time-tag);
    color: var(--color-text-time-tag);
  }
</style>
