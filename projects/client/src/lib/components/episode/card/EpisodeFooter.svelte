<script lang="ts">
  import type { Snippet } from "svelte";

  type EpisodeFooterProps = ChildrenProps & {
    actions?: Snippet;
  };

  const { children, actions }: EpisodeFooterProps = $props();
</script>

<div class="episode-footer">
  <div class="episode-footer-information">
    {@render children()}
  </div>
  {#if actions}
    <div class="episode-footer-actions">
      {@render actions()}
    </div>
  {/if}
</div>

<style>
  .episode-footer {
    display: flex;
    padding: 0.5rem;
    gap: 0.5rem;
    align-items: center;
    justify-content: space-between;

    .episode-footer-information {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      overflow: hidden;
    }
  }
</style>
