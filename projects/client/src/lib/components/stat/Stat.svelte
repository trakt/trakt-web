<script lang="ts">
  import type { Snippet } from "svelte";

  const { children, icon }: ChildrenProps & { icon: Snippet } = $props();
</script>

<div class="trakt-stat">
  {@render icon()}
  <p class="ellipsis bold">
    {@render children()}
  </p>
</div>

<style>
  .trakt-stat {
    width: fit-content;

    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    background: var(--shade-940);

    border-radius: var(--border-radius-s);
    padding: var(--ni-8) var(--ni-10);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }
</style>
