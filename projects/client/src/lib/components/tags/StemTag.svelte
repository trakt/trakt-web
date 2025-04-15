<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";
  import { appendClassList } from "$lib/utils/actions/appendClassList";

  type StemTagProps = {
    classList?: string;
    text?: string;
  } & Partial<ChildrenProps>;

  const { children, text, classList = "" }: StemTagProps = $props();
</script>

<div class="trakt-stem-tag" use:appendClassList={classList}>
  <TagContent>
    {#if children}
      {@render children()}
    {:else}
      <p class="meta-info">
        {text}
      </p>
    {/if}
  </TagContent>
</div>

<style>
  .trakt-stem-tag {
    :global(.trakt-tag) {
      background: var(--color-background-stem-tag);
      color: var(--color-foreground-stem-tag);
    }
  }
</style>
