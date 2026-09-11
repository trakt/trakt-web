<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import type { Snippet } from "svelte";
  import type { StemTagVariant } from "./StemTagVariant.ts";

  type StemTagProps = {
    classList?: string;
    text?: string;
    icon?: Snippet;
    variant?: StemTagVariant;
  } & Partial<ChildrenProps>;

  const {
    children,
    text,
    classList = "",
    icon,
    variant = "default",
  }: StemTagProps = $props();
</script>

<div
  class="trakt-stem-tag"
  data-variant={variant}
  use:appendClassList={classList}
>
  <TagContent>
    {#if icon}
      <trakt-tag-icon>
        {@render icon()}
      </trakt-tag-icon>
    {/if}
    {#if children}
      {@render children()}
    {:else if text}
      <p class="bold tag capitalize">
        {text}
      </p>
    {/if}
  </TagContent>
</div>

<style>
  .trakt-stem-tag {
    min-width: 0;

    :global(.trakt-tag) {
      display: flex;
      align-items: center;
      gap: var(--gap-xxs);

      min-width: 0;

      background: var(--color-background-stem-tag);
      color: var(--color-foreground-stem-tag);
    }

    /* Same surface as the avatar pill: faint fill, faint edge, inherited text. */
    &[data-variant="subtle"] :global(.trakt-tag) {
      background: var(--color-background-subtle-tag);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        var(--color-border-subtle-tag);
      color: inherit;
    }

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
