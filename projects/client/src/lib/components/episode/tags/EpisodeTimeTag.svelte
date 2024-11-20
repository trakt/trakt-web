<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="episode-time-tag">
  <TagContent>
    <p class="show-progress-text meta-info">
      {@render children()}
    </p>
  </TagContent>
</div>

<style>
  .episode-time-tag {
    /** TODO: remove once typography handles non-capitalized meta-info */
    .meta-info {
      text-transform: none;

      &::first-letter {
        text-transform: capitalize;
      }
    }

    :global(.trakt-tag) {
      background: var(--color-background-time-tag);
      color: var(--color-text-time-tag);
    }
  }
</style>
