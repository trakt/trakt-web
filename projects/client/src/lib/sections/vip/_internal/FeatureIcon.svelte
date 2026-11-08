<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-vip-feature-icon">{@render children()}</div>

<style>
  .trakt-vip-feature-icon {
    position: relative;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-36);
    height: var(--ni-36);

    background: radial-gradient(
      circle at 30% 25%,
      color-mix(in srgb, var(--purple-400) 50%, transparent),
      color-mix(in srgb, var(--purple-500) 18%, transparent)
    );

    border-radius: 50%;
    box-shadow: 0 var(--ni-2) var(--ni-14)
      color-mix(in srgb, var(--purple-500) 30%, transparent);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;

      background: linear-gradient(
        110deg,
        transparent 35%,
        color-mix(in srgb, var(--shade-10) 55%, transparent) 50%,
        transparent 65%
      );
      transform: translateX(-120%);

      pointer-events: none;
    }
  }
</style>
