<script lang="ts">
  import type { Snippet } from "svelte";

  const { children, icon }: ChildrenProps & { icon?: Snippet } = $props();
</script>

<div class="trakt-text-tag">
  {@render icon?.()}
  {@render children()}
</div>

<style>
  .trakt-text-tag {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    color: var(--color-text-secondary);
    font-size: var(--ni-12);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }
</style>
