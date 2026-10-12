<script lang="ts">
  const PIECES_PER_POPPER = 28;

  const poppers = ["start", "end"] as const;

  const pieces = Array.from({ length: PIECES_PER_POPPER }, (_, index) => {
    const spread = (index / PIECES_PER_POPPER) * 50 + 20;
    const jitter = ((index * 37) % 11) / 11;

    return {
      key: index,
      angle: spread + jitter * 8,
      distance: 26 + ((index * 53) % 17) * 1.6,
      spin: ((index * 29) % 7) * 120 + 180,
      delay: ((index * 13) % 9) * 0.02,
      tone: index % 4,
    };
  });
</script>

<div class="trakt-party-poppers" aria-hidden="true">
  {#each poppers as popper (popper)}
    <div class="popper" data-side={popper}>
      {#each pieces as piece (piece.key)}
        <span
          class="popper-piece"
          data-tone={piece.tone}
          style="--piece-angle: {piece.angle}deg; --piece-distance: {piece.distance}vh; --piece-spin: {piece.spin}deg; --piece-delay: {piece.delay}s"
        ></span>
      {/each}
    </div>
  {/each}
</div>

<style>
  .trakt-party-poppers {
    position: fixed;
    inset: 0;

    overflow: hidden;
    pointer-events: none;
    z-index: var(--layer-floating);

    .popper {
      position: absolute;
      bottom: 0;

      &[data-side="start"] {
        inset-inline-start: 0;
        --popper-direction: var(--rtl-sign);
      }

      &[data-side="end"] {
        inset-inline-end: 0;
        --popper-direction: calc(-1 * var(--rtl-sign));
      }
    }

    .popper-piece {
      --piece-x: calc(
        cos(var(--piece-angle)) * var(--piece-distance) *
          var(--popper-direction)
      );
      --piece-y: calc(sin(var(--piece-angle)) * var(--piece-distance) * -1);

      position: absolute;
      bottom: 0;
      inset-inline-start: 0;

      width: var(--ni-8);
      height: var(--ni-4);

      background-color: var(--purple-300);
      border-radius: var(--ni-1);
      opacity: 0;

      animation: popper-burst 2.4s cubic-bezier(0.15, 0.7, 0.3, 1)
        calc(0.8s + var(--piece-delay)) both;

      &[data-tone="1"] {
        background-color: var(--purple-200);
      }

      &[data-tone="2"] {
        background-color: var(--yellow-200);
      }

      &[data-tone="3"] {
        width: var(--ni-6);
        height: var(--ni-6);

        background-color: var(--color-seasonal-snow);
        border-radius: 50%;
      }
    }
  }

  @keyframes popper-burst {
    0% {
      opacity: 1;
      transform: translate(0, 0) rotate(0);
    }
    55% {
      opacity: 1;
      transform: translate(var(--piece-x), var(--piece-y))
        rotate(var(--piece-spin));
    }
    100% {
      opacity: 0;
      transform: translate(
          calc(var(--piece-x) * 1.15),
          calc(var(--piece-y) + 18vh)
        )
        rotate(calc(var(--piece-spin) * 2));
    }
  }
</style>
