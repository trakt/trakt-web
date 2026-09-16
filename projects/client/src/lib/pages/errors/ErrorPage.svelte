<script lang="ts">
  import type { ErrorPageProps } from "./_internal/ErrorPageProps.ts";

  const { title, kicker, mark, actions, ...rest }: ErrorPageProps = $props();
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<main class="trakt-error-page">
  <section class="error-card">
    <div class="error-content">
      <div class="error-mark">
        <span class="mark-ring"></span>
        <span class="mark-glyph">{@render mark()}</span>
      </div>

      <p class="error-kicker bold uppercase tag">{kicker}</p>

      <h1 class="error-title">{title}</h1>

      <div class="error-body">
        {#if rest.children}
          {@render rest.children()}
        {:else}
          <p>{rest.message}</p>
        {/if}
      </div>

      {#if actions}
        <div class="error-actions">
          {@render actions()}
        </div>
      {/if}
    </div>
  </section>
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-error-page {
    // Semantic name for the display size the headline steps through, so the
    // breakpoints below redefine one token instead of restating a raw one.
    --font-size-error-title: var(--ni-32);

    height: 100%;

    display: flex;

    padding: var(--layout-distance-side);
    box-sizing: border-box;

    .error-card {
      flex: 1;
      // The bloom behind the mark sits at a negative layer, so the card has to
      // own the stacking context or it would paint behind the card surface.
      isolation: isolate;

      display: flex;
      // Content taller than the card (a long stack trace, a short landscape
      // viewport) scrolls instead of squashing. `margin: auto` on the child
      // does the centring, because `justify-content: center` would put the
      // overflow out of reach above the scroll origin.
      overflow: auto;

      padding: var(--gap-xxl) var(--gap-l);
      box-sizing: border-box;

      text-align: center;

      background: var(--color-error-page-surface);
      border: var(--border-thickness-xxs) solid var(--color-error-page-border);
      border-radius: var(--border-radius-xxl);
    }

    .error-content {
      margin: auto;

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--gap-s);

      width: 100%;
    }

    .error-mark {
      position: relative;
      flex-shrink: 0;

      width: var(--ni-96);
      height: var(--ni-96);

      display: grid;
      place-items: center;

      margin-block-end: var(--gap-m);

      &::before {
        content: "";

        position: absolute;
        inset: calc(-1 * var(--ni-48));
        z-index: -1;

        border-radius: 50%;
        background: var(--background-error-page-bloom);
      }
    }

    .mark-ring {
      position: absolute;
      inset: 0;

      border-radius: 50%;
      background: var(--background-error-page-mark-ring);

      animation: mark-ring-drift 24s linear infinite;

      &::after {
        content: "";

        position: absolute;
        inset: var(--border-thickness-xxs);

        border-radius: 50%;
        background: var(--color-error-page-surface);
      }
    }

    .mark-glyph {
      position: relative;

      display: grid;
      place-items: center;

      color: var(--color-text-primary);
    }

    .error-kicker {
      color: var(--color-error-page-kicker);
      letter-spacing: var(--ni-2);
      // Tracking is trailing-only, so nudge the label back into optical centre.
      padding-inline-start: var(--ni-2);
    }

    .error-title {
      max-width: var(--ni-640);

      font-size: var(--font-size-error-title);
      line-height: 1.15;
      // A headline that has to wrap should split evenly rather than leaving
      // one word stranded on the second line.
      text-wrap: balance;
    }

    .error-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      // Tight enough that consecutive rows read as one message, loose enough
      // that two separate thoughts still separate.
      gap: var(--gap-s);

      // Wide enough that a two-sentence message lands on one row instead of
      // breaking mid-phrase (the reason for the extra room over the 480 the
      // shortest copy needs): at 480 the unexpected-error message split its
      // "submit a new issue" link across lines, and the locked-account page
      // read as a long line, an orphaned "account.", then a short line.
      max-width: var(--ni-640);

      // Slotted prose inherits all three, so no :global() reach-in is needed.
      color: var(--color-text-secondary);
      line-height: 1.5;
      // Copy that fits stays on one row; copy that does not splits into even
      // lines instead of a full line plus a stranded word. Reset it around
      // preformatted content, which must not be re-flowed.
      text-wrap: balance;
    }

    .error-actions {
      // Documented hooks on Button's `outline` style: the actions row echoes
      // the stroke as a resting wash (hover still intensifies on top of it)
      // and brightens the rim, which the flat purple is too heavy for here.
      --color-outline-fill: var(--color-error-page-action-fill);
      --color-outline-stroke: var(--color-error-page-action-stroke);

      // Stacked and centred, primary first: the recovery action leads and the
      // way out sits under it, rather than competing beside it.
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--gap-m);

      margin-block-start: var(--gap-l);
    }

    @include for-tablet-sm-and-below {
      --font-size-error-title: var(--ni-28);
    }

    @include for-mobile {
      --font-size-error-title: var(--ni-22);

      .error-mark {
        width: var(--ni-80);
        height: var(--ni-80);
      }
    }
  }

  @keyframes mark-ring-drift {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-error-page .mark-ring {
      animation: none;
    }
  }
</style>
