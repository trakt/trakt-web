<script lang="ts">
  import EpisodeTagContent from "./EpisodeTagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="episode-premiere-tag">
  <EpisodeTagContent>
    {@render children()}
  </EpisodeTagContent>
</div>

<style>
  .episode-premiere-tag :global(.episode-tag) {
    text-transform: uppercase;

    background: var(--color-background-premiere-tag);
    color: var(--color-text-premiere-tag);
  }
</style>
