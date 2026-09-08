<script lang="ts">
  import type { ErrorPageProps } from "./_internal/ErrorPageProps.ts";

  const { title, kicker, mark, actions, ...rest }: ErrorPageProps = $props();
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<main class="trakt-error-page">
  <section class="error-card">
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
  </section>
</main>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-error-page {
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
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--gap-s);

      padding: var(--gap-xxl) var(--gap-l);
      box-sizing: border-box;

      text-align: center;

      background: var(--color-error-page-surface);
      border: var(--border-thickness-xxs) solid var(--color-error-page-border);
      border-radius: var(--border-radius-xxl);
    }

    .error-mark {
      position: relative;

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

      font-size: var(--ni-32);
      line-height: 1.15;
    }

    .error-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--gap-m);

      max-width: var(--ni-480);

      // Slotted prose inherits both, so no :global() reach-in is needed.
      color: var(--color-text-secondary);
      line-height: 1.5;
    }

    .error-actions {
      // Documented hook on Button's `outline` style: the actions row echoes
      // the stroke as a resting wash, hover still intensifies on top of it.
      --color-outline-fill: var(--color-error-page-action-fill);

      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: var(--gap-s);

      margin-block-start: var(--gap-l);
    }

    @include for-tablet-sm-and-below {
      .error-title {
        font-size: var(--ni-28);
      }
    }

    @include for-mobile {
      .error-mark {
        width: var(--ni-80);
        height: var(--ni-80);
      }

      .error-title {
        font-size: var(--ni-22);
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
