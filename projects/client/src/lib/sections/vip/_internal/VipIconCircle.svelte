<script lang="ts">
  const { children, className }: { className: string } & ChildrenProps =
    $props();
</script>

<div class="trakt-vip-icon-circle {className}">
  {@render children()}
</div>

<style>
  div {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-48);
    height: var(--ni-48);

    background: var(--shade-10);
    border-radius: 50%;
  }
</style>
