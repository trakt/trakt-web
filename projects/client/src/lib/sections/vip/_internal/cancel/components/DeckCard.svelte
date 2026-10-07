<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DeckCardProps } from "./DeckCardProps.ts";

  const { tone, position, step, copy, visual, actions }: DeckCardProps =
    $props();

  const state = $derived(
    position < 0 ? "gone" : position === 0 ? "current" : "queued",
  );
  const stepIndexes = $derived(
    Array.from({ length: step?.total ?? 0 }, (_, index) => index),
  );
</script>

<article
  class="trakt-vip-cancel-deck-card"
  data-tone={tone}
  data-state={state}
  style="--deck-position: {Math.max(0, position)}"
  aria-hidden={state !== "current"}
  inert={state !== "current"}
>
  {#if step}
    <header class="deck-card-head">
      <span class="small bold">{m.text_vip_cancel_card_title()}</span>
      <span
        class="deck-card-steps"
        role="img"
        aria-label={m.text_vip_cancel_step(step)}
      >
        {#each stepIndexes as index (index)}
          <i class:is-done={index < step.current}></i>
        {/each}
      </span>
    </header>
  {/if}

  <div class="deck-card-copy">
    {@render copy()}
  </div>

  {#if visual}
    <div class="deck-card-visual">
      {@render visual()}
    </div>
  {/if}

  {#if actions}
    <div class="deck-card-actions">
      {@render actions()}
    </div>
  {/if}
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-cancel-deck-card {
    --deck-card-ink: var(--color-text-primary);
    --deck-card-muted: var(--color-text-secondary);
    --deck-card-accent: var(--color-vip-border-accent);
    --deck-card-line: color-mix(in srgb, var(--color-text-primary) 12%, transparent);

    grid-area: 1 / 1;
    position: relative;
    isolation: isolate;
    overflow: hidden;
    box-sizing: border-box;

    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    grid-template-areas:
      "copy visual"
      "actions visual";
    grid-template-rows: auto auto;
    align-content: center;
    column-gap: var(--ni-64);
    row-gap: var(--ni-28);

    padding: var(--ni-72) var(--ni-64) var(--ni-56);
    border-radius: var(--border-radius-xxl);

    @include vip-glow-card;
    color: var(--deck-card-ink);
    backdrop-filter: blur(var(--ni-24));

    z-index: calc(10 - var(--deck-position));
    transform: translate(
        calc(var(--rtl-sign) * var(--deck-position) * var(--ni-14)),
        calc(var(--deck-position) * var(--ni-14))
      )
      rotate(calc(var(--rtl-sign) * var(--deck-position) * 2deg))
      scale(calc(1 - var(--deck-position) * 0.035));
    transition:
      transform 700ms cubic-bezier(0.2, 0.85, 0.25, 1),
      opacity 500ms,
      visibility 500ms;

    &[data-state="queued"] > * {
      opacity: 0;
    }

    &[data-state="gone"] {
      transform: translate(calc(var(--rtl-sign) * -150%), var(--ni-80))
        rotate(calc(var(--rtl-sign) * -18deg));
      opacity: 0;
      visibility: hidden;
      transition:
        transform 700ms cubic-bezier(0.4, 0, 0.6, 1),
        opacity 700ms 100ms,
        visibility 700ms;
    }

    @container vip-cancel (max-width: 760px) {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas:
        "copy"
        "visual"
        "actions";
      grid-template-rows: auto auto 1fr;
      align-content: start;
      row-gap: var(--ni-18);

      padding: var(--ni-64) var(--ni-22) var(--ni-22);
      border-radius: var(--border-radius-xl);

      transform: translateY(calc(var(--deck-position) * var(--ni-10)))
        scale(calc(1 - var(--deck-position) * 0.04));
    }
  }

  .trakt-vip-cancel-deck-card[data-tone="celebrate"] {
    --deck-card-ink: var(--shade-10);
    --deck-card-muted: color-mix(in srgb, var(--shade-10) 72%, transparent);
    --deck-card-accent: var(--purple-300);
    --deck-card-line: color-mix(in srgb, var(--shade-10) 16%, transparent);

    background-color: var(--shade-920);
    background-image:
      radial-gradient(
        72% 70% at 75% 110%,
        color-mix(in srgb, var(--purple-500) 48%, transparent),
        transparent 70%
      ),
      linear-gradient(
        180deg,
        var(--shade-900) 0%,
        var(--shade-800) 45%,
        var(--purple-900) 100%
      );
    border-color: color-mix(in srgb, var(--purple-400) 40%, transparent);
  }

  .deck-card-head {
    position: absolute;
    inset-block-start: var(--ni-24);
    inset-inline: var(--ni-64);

    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--deck-card-muted);

    @container vip-cancel (max-width: 760px) {
      inset-block-start: var(--ni-22);
      inset-inline: var(--ni-22);
    }
  }

  .deck-card-steps {
    display: flex;
    gap: var(--gap-xxs);

    i {
      width: var(--ni-32);
      height: var(--ni-4);
      border-radius: var(--border-radius-xxl);
      background: var(--deck-card-line);
      transition: background 300ms;

      &.is-done {
        background: var(--color-background-purple);
      }
    }
  }

  .deck-card-copy {
    grid-area: copy;
    align-self: end;
    min-width: 0;

    @container vip-cancel (max-width: 760px) {
      align-self: start;
    }
  }

  .deck-card-visual {
    grid-area: visual;
    align-self: center;
    min-width: 0;
  }

  .deck-card-actions {
    grid-area: actions;
    align-self: start;

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-s);

    @container vip-cancel (max-width: 760px) {
      align-self: end;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--gap-xs);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-vip-cancel-deck-card {
      transition-duration: 1ms;
    }
  }
</style>
