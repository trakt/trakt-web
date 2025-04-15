<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-tag">
  {@render children()}
</div>

<style>
  .trakt-tag {
    display: flex;
    align-items: center;

    height: var(--ni-12);
    line-height: var(--ni-12);
    margin: 0;
    padding: var(--ni-4) var(--ni-8);

    border-radius: var(--border-radius-m);
  }
</style>
