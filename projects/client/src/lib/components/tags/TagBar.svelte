<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-tag-bar">
  {@render children()}
</div>

<style>
  .trakt-tag-bar {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    :global(:not(:last-child))::after {
      content: "·";

      font-size: var(--font-size-separator);
      line-height: var(--ni-12);
    }
  }
</style>
