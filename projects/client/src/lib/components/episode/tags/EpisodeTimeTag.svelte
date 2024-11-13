<script lang="ts">
  import EpisodeTagContent from "./EpisodeTagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="episode-time-tag">
  <EpisodeTagContent>
    {@render children()}
  </EpisodeTagContent>
</div>

<style>
  .episode-time-tag :global(.episode-tag) {
    &::first-letter {
      text-transform: capitalize;
    }

    background: var(--color-background-time-tag);
    color: var(--color-text-time-tag);
  }
</style>
