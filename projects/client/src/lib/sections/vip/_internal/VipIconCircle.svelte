<script lang="ts">
  const { children, className }: { className: string } & ChildrenProps =
    $props();
</script>

<div class="trakt-vip-icon-circle {className}">
  {@render children()}
</div>

<style>
  div {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-48);
    height: var(--ni-48);

    background: var(--shade-10);
    border-radius: 50%;

    &::after {
      content: "";
      position: absolute;
      inset: 0;

      border: var(--ni-2) solid
        color-mix(in srgb, var(--purple-500) 50%, transparent);
      border-radius: 50%;
      opacity: 0;

      pointer-events: none;
    }
  }
</style>
