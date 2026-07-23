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
    position: relative;

    height: var(--ni-12);
    line-height: var(--ni-12);
    margin: 0;
    padding: var(--ni-4) var(--ni-8);

    border-radius: var(--border-radius-m);

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      border: var(--border-thickness-xxs) solid var(--color-tag-outline);
      border-radius: inherit;
    }
  }
</style>
