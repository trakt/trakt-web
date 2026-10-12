<script lang="ts">
  import GhostMascot from "../mascots/GhostMascot.svelte";
</script>

<div class="trakt-peeking-ghost" aria-hidden="true">
  <div class="ghost-peek">
    <GhostMascot />
  </div>
</div>

<style>
  .trakt-peeking-ghost {
    position: fixed;
    bottom: 28vh;
    inset-inline-end: 0;

    width: var(--ni-64);
    height: var(--ni-72);

    overflow: hidden;
    pointer-events: none;
    z-index: var(--layer-floating);

    .ghost-peek {
      width: 100%;
      height: 100%;

      pointer-events: auto;

      transform: translateX(calc(var(--rtl-sign) * 110%));
      animation: ghost-peek 22s ease-in-out 5s infinite;
    }
  }

  @keyframes ghost-peek {
    0%,
    100% {
      transform: translateX(calc(var(--rtl-sign) * 110%)) rotate(0);
    }
    6% {
      transform: translateX(calc(var(--rtl-sign) * 45%))
        rotate(calc(var(--rtl-sign) * -18deg));
    }
    14% {
      transform: translateX(calc(var(--rtl-sign) * 45%))
        rotate(calc(var(--rtl-sign) * -10deg));
    }
    18% {
      transform: translateX(calc(var(--rtl-sign) * 35%))
        rotate(calc(var(--rtl-sign) * -22deg));
    }
    26% {
      transform: translateX(calc(var(--rtl-sign) * 35%))
        rotate(calc(var(--rtl-sign) * -16deg));
    }
    32% {
      transform: translateX(calc(var(--rtl-sign) * 110%)) rotate(0);
    }
  }
</style>
