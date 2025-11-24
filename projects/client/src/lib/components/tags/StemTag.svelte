<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import type { Snippet } from "svelte";

  type StemTagProps = {
    classList?: string;
    text?: string;
    icon?: Snippet;
  } & Partial<ChildrenProps>;

  const { children, text, classList = "", icon }: StemTagProps = $props();
</script>

<div class="trakt-stem-tag" use:appendClassList={classList}>
  <TagContent>
    {#if icon}
      <trakt-tag-icon>
        {@render icon()}
      </trakt-tag-icon>
    {/if}
    {#if children}
      {@render children()}
    {:else if text}
      <p class="bold">
        {text}
      </p>
    {/if}
  </TagContent>
</div>

<style>
  .trakt-stem-tag {
    :global(.trakt-tag) {
      display: flex;
      align-items: center;
      gap: var(--gap-xxs);

      background: var(--color-background-stem-tag);
      color: var(--color-foreground-stem-tag);
    }

    p,
    :global(p) {
      font-size: var(--font-size-tag);
    }

    trakt-tag-icon {
      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }
  }
</style>
