<script lang="ts">
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import type { Snippet } from "svelte";

  type TextTagProps = ChildrenProps & {
    icon?: Snippet;
    classList?: string;
  };

  const { children, icon, classList = "" }: TextTagProps = $props();
</script>

<div class="trakt-text-tag" use:appendClassList={classList}>
  {@render icon?.()}
  {@render children()}
</div>

<style>
  .trakt-text-tag {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    color: var(--color-text-primary);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }

    :global(p) {
      font-size: var(--font-size-tag);
    }
  }
</style>
