<script lang="ts">
  import TagContent from "$lib/components/tags/TagContent.svelte";
  import { appendClassList } from "$lib/utils/actions/appendClassList";

  const { children, classList = "" }: { classList?: string } & ChildrenProps =
    $props();
</script>

<div class="trakt-stem-tag" use:appendClassList={classList}>
  <TagContent>
    <p class="meta-info">
      {@render children()}
    </p>
  </TagContent>
</div>

<style>
  .trakt-stem-tag {
    :global(.trakt-tag) {
      background: var(--color-background-stem-tag);
      color: var(--color-text-stem-tag);
    }
  }
</style>
