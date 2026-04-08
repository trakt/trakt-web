<script lang="ts">
  type WhereToWatchCategoryProps = {
    title?: string;
  } & ChildrenProps;

  const { title, children }: WhereToWatchCategoryProps = $props();
</script>

<div class="trakt-where-to-watch-category">
  {#if title}
    <h2 class="capitalize bold">
      {title}
    </h2>
  {/if}

  {@render children()}
</div>

<style lang="scss">
  .trakt-where-to-watch-category {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
