<script lang="ts">
  const { value, isRevealed }: { value: number; isRevealed: boolean } =
    $props();

  const STRIP = Array.from({ length: 20 }, (_, index) => index % 10);

  const digits = $derived(String(value).split("").map(Number));
</script>

<span class="trakt-rolling-number" class:is-revealed={isRevealed}>
  <span class="rolling-number-placeholder">?</span>
  <span class="rolling-number-digits">
    {#each digits as digit, index (index)}
      <span class="rolling-number-column">
        <span
          class="rolling-number-strip"
          style:--rolling-digit={digit}
          style:--rolling-index={index}
        >
          {#each STRIP as number, position (position)}
            <span>{number}</span>
          {/each}
        </span>
      </span>
    {/each}
  </span>
  <span class="rolling-number-unit">%</span>
</span>

<style lang="scss">
  @keyframes rolling-number-sheen {
    from {
      background-position: 100% 0;
    }
    to {
      background-position: -150% 0;
    }
  }

  .trakt-rolling-number {
    display: inline-grid;
    grid-template-columns: auto auto;
    align-items: start;

    font-size: inherit;
    direction: ltr;
    unicode-bidi: isolate;
    line-height: 1;
    font-variant-numeric: tabular-nums;

    span {
      font-size: inherit;
    }

    .rolling-number-placeholder,
    .rolling-number-digits {
      grid-area: 1 / 1;
    }

    .rolling-number-placeholder {
      background: linear-gradient(
        100deg,
        var(--game-muted) 30%,
        var(--game-foreground) 50%,
        var(--game-muted) 70%
      );
      background-size: 250% 100%;
      background-clip: text;
      color: transparent;
      animation: rolling-number-sheen 2.2s linear infinite;
    }

    .rolling-number-digits {
      display: inline-flex;
      visibility: hidden;
    }

    .rolling-number-column {
      display: inline-block;
      height: 1em;
      overflow: hidden;
    }

    .rolling-number-strip {
      display: flex;
      flex-direction: column;

      span {
        display: block;
        height: 1em;
      }
    }

    .rolling-number-unit {
      font-size: 0.4em;
      margin-block-start: 0.1em;
      margin-inline-start: 0.05em;
      opacity: 0;
      transition: opacity var(--transition-duration-short) ease-out;
    }

    &.is-revealed {
      .rolling-number-placeholder {
        visibility: hidden;
        animation: none;
      }

      .rolling-number-digits {
        visibility: visible;
      }

      .rolling-number-strip {
        transform: translateY(calc((10 + var(--rolling-digit)) * -1em));
        transition: transform 1.1s cubic-bezier(0.12, 0.9, 0.2, 1)
          calc(var(--rolling-index) * 0.12s);
      }

      .rolling-number-unit {
        opacity: 0.75;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .rolling-number-placeholder {
        animation: none;
      }

      &.is-revealed .rolling-number-strip {
        transition: none;
      }
    }
  }
</style>
