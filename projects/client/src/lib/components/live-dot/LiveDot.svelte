<script lang="ts">
  const { color = "red" }: { color?: "red" | "purple" } = $props();
</script>

<span class="trakt-live-dot" data-color={color} aria-hidden="true">
  <span class="live-dot-ping"></span>
</span>

<style lang="scss">
  .trakt-live-dot {
    --live-dot-color: var(--color-background-red);
    --live-dot-size: var(--ni-8);

    position: relative;
    flex: none;
    display: inline-block;

    width: var(--live-dot-size);
    height: var(--live-dot-size);

    border-radius: 50%;
    background: var(--live-dot-color);

    &[data-color="purple"] {
      --live-dot-color: var(--color-background-purple);
    }
  }

  .live-dot-ping {
    position: absolute;
    inset: 0;

    border-radius: inherit;
    background: var(--live-dot-color);

    animation: live-dot-ping 1.8s ease-out infinite;
  }

  @keyframes live-dot-ping {
    from {
      transform: scale(1);
      opacity: 0.7;
    }

    to {
      transform: scale(2.6);
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .live-dot-ping {
      display: none;
    }
  }
</style>
