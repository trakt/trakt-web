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

    height: var(--ni-14);
    line-height: var(--ni-14);
    margin: 0;
    padding: var(--ni-2) var(--ni-8);

    border-radius: var(--ni-18);
  }
</style>
