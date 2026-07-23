<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<ul class="trakt-option-list">
  {@render children()}
</ul>

<style lang="scss">
  .trakt-option-list {
    display: flex;
    flex-direction: column;

    margin: 0;
    padding: 0;

    background: var(--color-option-list-background);
    border: var(--ni-1) solid var(--color-option-list-border);
    border-radius: var(--border-radius-l);
    overflow: hidden;
  }
</style>
