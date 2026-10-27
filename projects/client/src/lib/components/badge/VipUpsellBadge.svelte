<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
</script>

<span class="trakt-vip-upsell-badge">
  <span class="badge-ring" aria-hidden="true">
    <span class="ring-spin"><span class="ring-sweep"></span></span>
  </span>

  <span class="badge-label uppercase">{m.badge_text_get_vip()}</span>
</span>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-upsell-badge {
    --badge-label-color: var(--color-text-primary);
    --badge-ring-weight: var(--ni-1);
    --badge-intensity: 1;
    --badge-boost: paused;

    @include for-mouse {
      :global(.trakt-link:hover) &,
      :global(.trakt-link:focus-visible) & {
        --badge-label-color: var(--color-vip-thread-label-hover);
        --badge-ring-weight: var(--ni-2);
        --badge-intensity: 1.4;
        --badge-boost: running;
      }
    }

    :global(.is-hidden) & {
      --badge-boost: paused;

      .ring-sweep {
        animation-play-state: paused;
      }
    }

    position: relative;
    box-sizing: border-box;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    height: var(--ni-40);
    padding-inline: var(--ni-20);

    border-radius: var(--border-radius-pill);
    background: transparent;

    .badge-ring {
      position: absolute;
      inset: 0;
      overflow: hidden;

      padding: var(--badge-ring-weight);
      border-radius: inherit;

      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      mask-composite: exclude;

      pointer-events: none;
    }

    .ring-spin {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 260%;
      aspect-ratio: 1;

      transform: translate(-50%, -50%);

      animation: vip-thread-boost 3s linear infinite;
      animation-play-state: var(--badge-boost);
    }

    .ring-sweep {
      display: block;
      position: absolute;
      inset: 0;
      border-radius: 50%;

      background: conic-gradient(
        from 0deg,
        var(--color-vip-thread-base) 0deg,
        var(--color-vip-thread-mid) 55deg,
        var(--color-vip-thread-glint) 90deg,
        var(--color-vip-thread-mid) 125deg,
        var(--color-vip-thread-base) 180deg,
        var(--color-vip-thread-mid) 235deg,
        var(--color-vip-thread-glint-faint) 270deg,
        var(--color-vip-thread-mid) 305deg,
        var(--color-vip-thread-base) 360deg
      );

      animation: vip-thread-sweep 6s linear infinite;

      filter: contrast(var(--badge-intensity));
    }

    .badge-label {
      position: relative;

      color: var(--badge-label-color);
      font-size: var(--font-size-text-small);
      font-weight: 700;
      letter-spacing: 0.14em;
      white-space: nowrap;

      margin-inline-end: -0.14em;

      transition: color var(--transition-increment) ease-in-out;
    }
  }

  @keyframes vip-thread-sweep {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes vip-thread-boost {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }

    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-vip-upsell-badge .ring-sweep,
    .trakt-vip-upsell-badge .ring-spin {
      animation: none;
    }
  }
</style>
