<script lang="ts">
  import EpisodeTagContent from "./EpisodeTagContent.svelte";

  const { children }: ChildrenProps = $props();
</script>

<div class="episode-finale-tag">
  <EpisodeTagContent>
    {@render children()}
  </EpisodeTagContent>
</div>

<style>
  .episode-finale-tag :global(.episode-tag) {
    text-transform: uppercase;

    background: var(--color-background-finale-tag);
    color: var(--color-text-finale-tag);
  }
</style>
