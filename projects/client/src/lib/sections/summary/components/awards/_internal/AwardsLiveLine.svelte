<script lang="ts">
  const { text }: { text: string } = $props();
</script>

<span class="trakt-awards-live-line">
  <span class="live-dot" aria-hidden="true"></span>
  <span class="small secondary">{text}</span>
</span>

<style lang="scss">
  .trakt-awards-live-line {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-6);

    .live-dot {
      flex: none;
      width: var(--ni-6);
      height: var(--ni-6);
      border-radius: 50%;
      background: var(--color-award-live-dot);
      box-shadow: 0 0 0 var(--ni-3)
        color-mix(in srgb, var(--color-award-live-dot) 22%, transparent);

      animation: awards-live-pulse 2.4s ease-in-out infinite;
    }
  }

  @keyframes awards-live-pulse {
    50% {
      box-shadow: 0 0 0 var(--ni-6)
        color-mix(in srgb, var(--color-award-live-dot) 0%, transparent);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-awards-live-line .live-dot {
      animation: none;
    }
  }
</style>
