<script lang="ts">
  import type { Snippet } from "svelte";

  const { text, children }: { text?: string; children?: Snippet } = $props();
</script>

{#if children}
  <div class="trakt-list-meta-info" data-content="snippet">
    {@render children()}
  </div>
{:else}
  <p class="trakt-list-meta-info bold ellipsis">{text}</p>
{/if}

<style lang="scss">
  .trakt-list-meta-info {
    color: var(--list-meta-info-color);
    width: var(--meta-info-width, auto);

    &[data-content="snippet"] {
      min-width: 0;
    }
  }
</style>
